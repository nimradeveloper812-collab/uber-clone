import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";

export default function Rides() {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    api.get("/admin/rides").then(({ data }) => setRides(data));
  }, []);

  const statusColor = {
    completed: "#22c55e", cancelled: "#f87171", requested: "#facc15", accepted: "#60a5fa", ongoing: "#a78bfa",
  };

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.content}>
        <h1 style={styles.heading}>All Rides ({rides.length})</h1>
        <div style={styles.table}>
          <div style={styles.headerRow}>
            <span>Passenger</span><span>Driver</span><span>Route</span><span>Fare</span><span>Status</span>
          </div>
          {rides.map((r) => (
            <div key={r._id} style={styles.row}>
              <span>{r.passenger?.name || "-"}</span>
              <span>{r.driver?.name || "Unassigned"}</span>
              <span style={{ fontSize: "13px" }}>{r.pickup?.address} → {r.drop?.address}</span>
              <span>Rs. {r.fare}</span>
              <span style={{ ...styles.badge, background: statusColor[r.status] || "#333" }}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  layout: { display: "flex", background: "#0a0a0a", minHeight: "100vh" },
  content: { marginLeft: "230px", padding: "32px", flex: 1 },
  heading: { color: "#fff", fontSize: "24px", marginBottom: "24px" },
  table: { background: "#16161f", borderRadius: "14px", border: "1px solid #2a2a3d", overflow: "hidden" },
  headerRow: { display: "grid", gridTemplateColumns: "1.3fr 1.3fr 2fr 1fr 1fr", padding: "14px 20px", background: "#1e1e2d", color: "#8b8b9e", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" },
  row: { display: "grid", gridTemplateColumns: "1.3fr 1.3fr 2fr 1fr 1fr", padding: "14px 20px", borderTop: "1px solid #2a2a3d", alignItems: "center", color: "#fff", fontSize: "14px" },
  badge: { fontSize: "11px", padding: "3px 10px", borderRadius: "12px", color: "#000", fontWeight: "700", width: "fit-content" },
};