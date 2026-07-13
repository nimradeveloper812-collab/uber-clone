import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);

  const load = () => api.get("/admin/drivers").then(({ data }) => setDrivers(data));

  useEffect(() => { load(); }, []);

  const toggleBlock = async (userId) => {
    await api.patch(`/admin/users/${userId}/block`);
    load();
  };

  const remove = async (userId) => {
    if (!confirm("Delete this driver permanently?")) return;
    await api.delete(`/admin/users/${userId}`);
    load();
  };

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.content}>
        <h1 style={styles.heading}>Drivers ({drivers.length})</h1>
        <div style={styles.table}>
          <div style={styles.headerRow}>
            <span>Name</span><span>Vehicle</span><span>Rating</span><span>Status</span><span>Actions</span>
          </div>
          {drivers.map((d) => (
            <div key={d._id} style={styles.row}>
              <div>
                <p style={styles.name}>{d.user?.name}</p>
                <p style={styles.sub}>{d.user?.phone}</p>
              </div>
              <span>{d.vehicleModel} • {d.vehicleNumber}</span>
              <span>⭐ {d.user?.rating || 5}</span>
              <span style={{ color: d.user?.isBlocked ? "#f87171" : "#22c55e" }}>
                {d.user?.isBlocked ? "Blocked" : "Active"}
              </span>
              <div style={styles.actions}>
                <button style={styles.blockBtn} onClick={() => toggleBlock(d.user._id)}>
                  {d.user?.isBlocked ? "Unblock" : "Block"}
                </button>
                <button style={styles.deleteBtn} onClick={() => remove(d.user._id)}>Delete</button>
              </div>
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
  headerRow: { display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1.5fr", padding: "14px 20px", background: "#1e1e2d", color: "#8b8b9e", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" },
  row: { display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1.5fr", padding: "14px 20px", borderTop: "1px solid #2a2a3d", alignItems: "center", color: "#fff", fontSize: "14px" },
  name: { fontWeight: "600" },
  sub: { color: "#8b8b9e", fontSize: "12px" },
  actions: { display: "flex", gap: "8px" },
  blockBtn: { background: "transparent", border: "1px solid #facc15", color: "#facc15", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", cursor: "pointer" },
  deleteBtn: { background: "transparent", border: "1px solid #f87171", color: "#f87171", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", cursor: "pointer" },
};