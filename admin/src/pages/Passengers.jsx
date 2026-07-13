import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";

export default function Passengers() {
  const [passengers, setPassengers] = useState([]);

  const load = () => api.get("/admin/users?role=passenger").then(({ data }) => setPassengers(data));

  useEffect(() => { load(); }, []);

  const toggleBlock = async (id) => {
    await api.patch(`/admin/users/${id}/block`);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this passenger permanently?")) return;
    await api.delete(`/admin/users/${id}`);
    load();
  };

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.content}>
        <h1 style={styles.heading}>Passengers ({passengers.length})</h1>
        <div style={styles.table}>
          <div style={styles.headerRow}>
            <span>Name</span><span>Email</span><span>Rating</span><span>Status</span><span>Actions</span>
          </div>
          {passengers.map((p) => (
            <div key={p._id} style={styles.row}>
              <span style={{ fontWeight: 600 }}>{p.name}</span>
              <span>{p.email}</span>
              <span>⭐ {p.rating}</span>
              <span style={{ color: p.isBlocked ? "#f87171" : "#22c55e" }}>
                {p.isBlocked ? "Blocked" : "Active"}
              </span>
              <div style={styles.actions}>
                <button style={styles.blockBtn} onClick={() => toggleBlock(p._id)}>
                  {p.isBlocked ? "Unblock" : "Block"}
                </button>
                <button style={styles.deleteBtn} onClick={() => remove(p._id)}>Delete</button>
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
  headerRow: { display: "grid", gridTemplateColumns: "1.5fr 2fr 1fr 1fr 1.5fr", padding: "14px 20px", background: "#1e1e2d", color: "#8b8b9e", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" },
  row: { display: "grid", gridTemplateColumns: "1.5fr 2fr 1fr 1fr 1.5fr", padding: "14px 20px", borderTop: "1px solid #2a2a3d", alignItems: "center", color: "#fff", fontSize: "14px" },
  actions: { display: "flex", gap: "8px" },
  blockBtn: { background: "transparent", border: "1px solid #facc15", color: "#facc15", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", cursor: "pointer" },
  deleteBtn: { background: "transparent", border: "1px solid #f87171", color: "#f87171", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", cursor: "pointer" },
};