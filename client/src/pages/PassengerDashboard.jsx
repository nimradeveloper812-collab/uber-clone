import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import io from "socket.io-client";
import { LAHORE_LOCATIONS } from "../data/locations";
import LiveMap from "../components/LiveMap";

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");

export default function PassengerDashboard() {
  const [pickupName, setPickupName] = useState("");
  const [dropName, setDropName] = useState("");
  const [ride, setRide] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
  }, []);

  useEffect(() => {
    api.get("/drivers/available").then(({ data }) => {
      setDrivers(data.map((d) => ({
        id: d._id, userId: d.user?._id, name: d.user?.name,
        vehicleModel: d.vehicleModel, lat: d.currentLocation?.lat, lng: d.currentLocation?.lng,
      })));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    socket.on("driverLocation", (data) => {
      setDrivers((prev) => prev.map((d) => (d.userId === data.driverId ? { ...d, lat: data.lat, lng: data.lng } : d)));
    });
    socket.on("rideAccepted", (data) => {
      setRide((prev) => {
        if (prev && data._id === prev._id) {
          if (Notification.permission === "granted") new Notification("Ride Accepted! 🚗", { body: "Driver is on the way." });
          return data;
        }
        return prev;
      });
    });
    return () => { socket.off("driverLocation"); socket.off("rideAccepted"); };
  }, []);

  const requestRide = async () => {
    setError("");
    if (!pickupName || !dropName) return setError("Pickup aur Drop dono select karo");
    if (pickupName === dropName) return setError("Pickup aur Drop alag hone chahiye");
    const pickup = LAHORE_LOCATIONS.find((l) => l.name === pickupName);
    const drop = LAHORE_LOCATIONS.find((l) => l.name === dropName);
    setLoading(true);
    try {
      const { data } = await api.post("/rides/request", {
        pickup: { lat: pickup.lat, lng: pickup.lng, address: pickup.name },
        drop: { lat: drop.lat, lng: drop.lng, address: drop.name },
      });
      setRide(data);
    } catch (err) {
      setError(err.response?.data?.message || "Ride request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div className="blob" style={{ width: 400, height: 400, background: "#d4af37", top: "-120px", right: "-120px" }} />
      <div className="blob" style={{ width: 350, height: 350, background: "#22c55e", bottom: "-100px", left: "-100px" }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="glass" style={styles.card}>
        <h2 style={styles.heading}>🚕 Request a Ride</h2>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={styles.error}>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <label style={styles.label}>📍 Pickup Location</label>
        <select style={styles.select} value={pickupName} onChange={(e) => setPickupName(e.target.value)}>
          <option value="">Select pickup...</option>
          {LAHORE_LOCATIONS.map((loc) => <option key={loc.name} value={loc.name}>{loc.name}</option>)}
        </select>

        <div style={styles.routeLine}>
          <div style={styles.dotGreen} />
          <div style={styles.dashLine} />
          <div style={styles.dotRed} />
        </div>

        <label style={styles.label}>🎯 Drop Location</label>
        <select style={styles.select} value={dropName} onChange={(e) => setDropName(e.target.value)}>
          <option value="">Select drop...</option>
          {LAHORE_LOCATIONS.map((loc) => <option key={loc.name} value={loc.name}>{loc.name}</option>)}
        </select>

        <motion.button whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(212,175,55,0.5)" }} whileTap={{ scale: 0.97 }}
          className="shine" style={styles.button} onClick={requestRide} disabled={loading}>
          {loading ? "Requesting..." : "🚕 Request Ride"}
        </motion.button>

        <AnimatePresence>
          {ride && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={styles.rideCard}>
              <p><strong>Status:</strong> <span style={{ color: "#22c55e" }}>{ride.status}</span></p>
              <p><strong>Fare:</strong> Rs. {ride.fare}</p>
              <p><strong>Distance:</strong> {ride.distanceKm} km</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
        className="glass" style={styles.card}>
        <h3 style={styles.heading}>🌍 Drivers Nearby (Live)</h3>
        <LiveMap drivers={drivers} />
        {drivers.length === 0 && <p style={{ color: "#9ca3af", marginTop: 10 }}>No drivers available right now</p>}
        {drivers.map((d, i) => (
          <motion.div key={d.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} style={styles.driverRow}>
            <div style={styles.driverAvatar}>🚗</div>
            <div>
              <p style={styles.driverName}>{d.name}</p>
              <p style={styles.driverMeta}>{d.vehicleModel}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#050507", padding: "40px 16px", display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", position: "relative", overflow: "hidden" },
  card: { borderRadius: "22px", padding: "26px", width: "100%", maxWidth: "480px", color: "#fff" },
  heading: { marginBottom: "16px", fontSize: "19px", fontFamily: "'Sora', sans-serif" },
  label: { display: "block", fontSize: "12px", color: "#9ca3af", marginBottom: "6px", marginTop: "10px" },
  select: { width: "100%", padding: "13px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "#fff", fontSize: "15px" },
  routeLine: { display: "flex", alignItems: "center", gap: "6px", padding: "8px 4px" },
  dotGreen: { width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" },
  dotRed: { width: "8px", height: "8px", borderRadius: "50%", background: "#f87171", boxShadow: "0 0 8px #f87171" },
  dashLine: { flex: 1, height: "1px", background: "repeating-linear-gradient(90deg, #444 0 6px, transparent 6px 12px)" },
  button: { width: "100%", marginTop: "20px", padding: "15px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #d4af37, #b8952e)", color: "#000", fontWeight: "700", fontSize: "16px", cursor: "pointer" },
  error: { background: "rgba(127,29,29,0.5)", color: "#fecaca", padding: "10px 14px", borderRadius: "10px", marginBottom: "10px", fontSize: "13px" },
  rideCard: { marginTop: "18px", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", fontSize: "14px", lineHeight: "1.9", border: "1px solid rgba(255,255,255,0.06)" },
  driverRow: { display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  driverAvatar: { fontSize: "22px", background: "rgba(255,255,255,0.04)", width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  driverName: { fontWeight: "600", fontSize: "14px" },
  driverMeta: { fontSize: "12px", color: "#9ca3af" },
};