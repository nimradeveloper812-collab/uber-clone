import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then(({ data }) => setStats(data));
  }, []);

  const cards = stats ? [
    { label: "Total Passengers", value: stats.totalPassengers, icon: "🧍", color: "#60a5fa" },
    { label: "Total Drivers", value: stats.totalDrivers, icon: "🚗", color: "#22c55e" },
    { label: "Total Rides", value: stats.totalRides, icon: "📋", color: "#8b5cf6" },
    { label: "Active Rides", value: stats.activeRides, icon: "🟢", color: "#facc15" },
    { label: "Completed Rides", value: stats.completedRides, icon: "✅", color: "#f472b6" },
  ] : [];

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.content}>
        <h1 style={styles.heading}>Dashboard Overview</h1>
        <div style={styles.grid}>
          {cards.map((c) => (
            <div key={c.label} style={styles.card}>
              <div style={{ fontSize: "26px" }}>{c.icon}</div>
              <p style={{ ...styles.value, color: c.color }}>{c.value}</p>
              <p style={styles.label}>{c.label}</p>
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
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" },
  card: { background: "#16161f", border: "1px solid #2a2a3d", borderRadius: "14px", padding: "20px" },
  value: { fontSize: "28px", fontWeight: "800", margin: "10px 0 4px" },
  label: { color: "#8b8b9e", fontSize: "13px" },
};