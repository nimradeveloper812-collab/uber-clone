import { useEffect, useState } from "react";
import api from "../api/axios";

export default function RideHistory() {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    api.get("/rides/history").then(({ data }) => setRides(data));
  }, []);

  const statusColor = {
    completed: "#22c55e",
    cancelled: "#f87171",
    requested: "#facc15",
    accepted: "#60a5fa",
    ongoing: "#a78bfa",
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Ride History</h2>
        {rides.length === 0 && <p style={styles.empty}>No rides yet</p>}
        {rides.map((r) => (
          <div key={r._id} style={styles.rideCard}>
            <div>
              <p style={styles.route}>{r.pickup?.address || "Pickup"} → {r.drop?.address || "Drop"}</p>
              <p style={styles.meta}>{new Date(r.createdAt).toLocaleDateString()} • {r.distanceKm} km</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={styles.fare}>Rs. {r.fare}</p>
              <span style={{ ...styles.badge, background: statusColor[r.status] || "#333" }}>{r.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0f0f0f", padding: "30px 16px", display: "flex", justifyContent: "center" },
  card: { background: "#1a1a2e", borderRadius: "16px", padding: "24px", width: "100%", maxWidth: "550px", color: "#fff" },
  heading: { fontSize: "20px", marginBottom: "16px" },
  empty: { color: "#9ca3af", textAlign: "center", padding: "30px 0" },
  rideCard: { background: "#0f0f0f", borderRadius: "12px", padding: "14px", marginBottom: "12px", display: "flex", justifyContent: "space-between" },
  route: { fontWeight: "600", fontSize: "14px", marginBottom: "4px" },
  meta: { color: "#9ca3af", fontSize: "13px" },
  fare: { fontWeight: "700", fontSize: "15px", marginBottom: "6px" },
  badge: { fontSize: "11px", padding: "3px 10px", borderRadius: "12px", color: "#000", fontWeight: "700" },
};