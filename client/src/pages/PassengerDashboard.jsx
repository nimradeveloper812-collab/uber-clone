import { useState, useEffect } from "react";
import api from "../api/axios";
import io from "socket.io-client";
import { LAHORE_LOCATIONS } from "../data/locations";

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");

export default function PassengerDashboard() {
  const [pickupName, setPickupName] = useState("");
  const [dropName, setDropName] = useState("");
  const [ride, setRide] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/drivers/available").then(({ data }) => setDrivers(data)).catch(() => {});
  }, []);

  useEffect(() => {
    socket.on("rideAccepted", (data) => {
      setRide((prev) => (prev && data._id === prev._id ? data : prev));
    });
    return () => socket.off("rideAccepted");
  }, []);

  const requestRide = async () => {
    setError("");
    if (!pickupName || !dropName) {
      setError("Pickup aur Drop dono select karo");
      return;
    }
    if (pickupName === dropName) {
      setError("Pickup aur Drop alag hone chahiye");
      return;
    }

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
      <div style={styles.card}>
        <h2 style={styles.heading}>Request a Ride</h2>

        {error && <div style={styles.error}>{error}</div>}

        <label style={styles.label}>📍 Pickup Location</label>
        <select style={styles.select} value={pickupName} onChange={(e) => setPickupName(e.target.value)}>
          <option value="">Select pickup...</option>
          {LAHORE_LOCATIONS.map((loc) => (
            <option key={loc.name} value={loc.name}>{loc.name}</option>
          ))}
        </select>

        <label style={styles.label}>🎯 Drop Location</label>
        <select style={styles.select} value={dropName} onChange={(e) => setDropName(e.target.value)}>
          <option value="">Select drop...</option>
          {LAHORE_LOCATIONS.map((loc) => (
            <option key={loc.name} value={loc.name}>{loc.name}</option>
          ))}
        </select>

        <button style={styles.button} onClick={requestRide} disabled={loading}>
          {loading ? "Requesting..." : "🚕 Request Ride"}
        </button>

        {ride && (
          <div style={styles.rideCard}>
            <p><strong>Status:</strong> {ride.status}</p>
            <p><strong>Fare:</strong> Rs. {ride.fare}</p>
            <p><strong>Distance:</strong> {ride.distanceKm} km</p>
          </div>
        )}
      </div>

      <div style={styles.card}>
        <h3 style={styles.heading}>Available Drivers Nearby</h3>
        {drivers.length === 0 && <p style={{ color: "#9ca3af" }}>No drivers available right now</p>}
        {drivers.map((d) => (
          <div key={d._id} style={styles.driverRow}>
            <div style={styles.driverAvatar}>🚗</div>
            <div>
              <p style={styles.driverName}>{d.user?.name}</p>
              <p style={styles.driverMeta}>{d.vehicleModel} • {d.vehicleNumber}</p>
            </div>
            <div style={styles.driverRating}>⭐ {d.user?.rating || 5}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0f0f0f", padding: "30px 16px", display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" },
  card: { background: "#1a1a2e", borderRadius: "16px", padding: "24px", width: "100%", maxWidth: "480px", color: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" },
  heading: { marginBottom: "16px", fontSize: "20px" },
  label: { display: "block", fontSize: "13px", color: "#9ca3af", marginBottom: "6px", marginTop: "12px" },
  select: { width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #333", background: "#0f0f0f", color: "#fff", fontSize: "15px" },
  button: { width: "100%", marginTop: "20px", padding: "14px", borderRadius: "10px", border: "none", background: "#22c55e", color: "#000", fontWeight: "700", fontSize: "16px", cursor: "pointer" },
  error: { background: "#7f1d1d", color: "#fecaca", padding: "10px 14px", borderRadius: "8px", marginBottom: "10px", fontSize: "14px" },
  rideCard: { marginTop: "18px", background: "#0f0f0f", padding: "14px", borderRadius: "10px", fontSize: "14px", lineHeight: "1.8" },
  driverRow: { display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: "1px solid #2a2a3d" },
  driverAvatar: { fontSize: "24px", background: "#0f0f0f", width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  driverName: { fontWeight: "600", fontSize: "14px" },
  driverMeta: { fontSize: "12px", color: "#9ca3af" },
  driverRating: { marginLeft: "auto", fontSize: "13px" },
};