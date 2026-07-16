import { useEffect, useState } from "react";
import api from "../api/axios";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");

export default function DriverDashboard() {
  const [requests, setRequests] = useState([]);
  const [online, setOnline] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // existing pending requests load (reload pe bhi dikhein)
  useEffect(() => {
    api.get("/rides/pending").then(({ data }) => setRequests(data)).catch(() => {});
  }, []);

  useEffect(() => {
    socket.on("newRideRequest", (ride) => {
      setRequests((prev) => [ride, ...prev]);
      if (Notification.permission === "granted") {
        new Notification("New Ride Request! 🚕", { body: `Fare: Rs. ${ride.fare}` });
      }
    });
    return () => socket.off("newRideRequest");
  }, []);

  useEffect(() => {
    if (!online || !user?.id) return;
    const interval = setInterval(() => {
      navigator.geolocation?.getCurrentPosition((pos) => {
        socket.emit("driverLocationUpdate", {
          driverId: user.id,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [online, user]);

  const acceptRide = async (id) => {
    try {
      await api.patch(`/rides/${id}/accept`);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept");
    }
  };

  const declineRide = (id) => setRequests((prev) => prev.filter((r) => r._id !== id));

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.headerRow}>
          <h2 style={styles.heading}>Driver Dashboard</h2>
          <button onClick={() => setOnline(!online)} style={{ ...styles.statusBtn, background: online ? "#22c55e" : "#4b5563" }}>
            {online ? "🟢 Online" : "⚪ Offline"}
          </button>
        </div>

        {requests.length === 0 && <p style={styles.empty}>No ride requests yet — waiting for passengers...</p>}

        {requests.map((r) => (
          <div key={r._id} style={styles.rideCard}>
            <div>
              <p style={styles.route}>{r.pickup?.address || "Pickup"} → {r.drop?.address || "Drop"}</p>
              <p style={styles.meta}>{r.passenger?.name || "Passenger"} • {r.distanceKm} km • Rs. {r.fare}</p>
            </div>
            <div style={styles.actions}>
              <button style={styles.acceptBtn} onClick={() => acceptRide(r._id)}>Accept</button>
              <button style={styles.declineBtn} onClick={() => declineRide(r._id)}>Decline</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0f0f0f", padding: "30px 16px", display: "flex", justifyContent: "center" },
  card: { background: "#1a1a2e", borderRadius: "16px", padding: "24px", width: "100%", maxWidth: "500px", color: "#fff" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  heading: { fontSize: "20px" },
  statusBtn: { border: "none", padding: "8px 14px", borderRadius: "20px", color: "#000", fontWeight: "700", fontSize: "13px", cursor: "pointer" },
  empty: { color: "#9ca3af", textAlign: "center", padding: "30px 0" },
  rideCard: { background: "#0f0f0f", borderRadius: "12px", padding: "14px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  route: { fontWeight: "600", fontSize: "14px", marginBottom: "4px" },
  meta: { color: "#9ca3af", fontSize: "13px" },
  actions: { display: "flex", gap: "8px" },
  acceptBtn: { background: "#22c55e", color: "#000", border: "none", padding: "8px 14px", borderRadius: "8px", fontWeight: "700", cursor: "pointer" },
  declineBtn: { background: "transparent", color: "#f87171", border: "1px solid #f87171", padding: "8px 14px", borderRadius: "8px", cursor: "pointer" },
};