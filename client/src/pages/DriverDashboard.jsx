import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export default function DriverDashboard() {
  const { user, logout } = useAuth();
  const [pendingRides, setPendingRides] = useState([]);
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState("available");
  const [toast, setToast] = useState("");

  useEffect(() => {
    loadHistory();
    const s = io(SOCKET_URL);
    s.on("newRideRequest", (ride) => {
      setPendingRides((prev) => {
        if (prev.find((r) => r._id === ride._id)) return prev;
        return [ride, ...prev];
      });
      showToast("🔔 New ride request!");
    });
    s.on("rideStatusUpdate", (ride) => {
      setPendingRides((prev) => prev.filter((r) => r._id !== ride._id));
    });
    return () => s.disconnect();
  }, []);

  const loadHistory = async () => {
    try {
      const { data } = await api.get("/rides/history");
      setHistory(data);
    } catch {}
  };

  const acceptRide = async (rideId) => {
    try {
      await api.patch(`/rides/${rideId}/accept`);
      setPendingRides((prev) => prev.filter((r) => r._id !== rideId));
      showToast("✅ Ride accepted!");
      loadHistory();
      setTab("history");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to accept");
    }
  };

  const updateStatus = async (rideId, status) => {
    try {
      await api.patch(`/rides/${rideId}/status`, { status });
      loadHistory();
      showToast(`Status updated: ${status}`);
    } catch {}
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const statusColor = { requested: "#f59e0b", accepted: "#3b82f6", ongoing: "#8b5cf6", completed: "#22c55e", cancelled: "#ef4444" };

  return (
    <div style={styles.page}>
      {toast && <div style={styles.toast}>{toast}</div>}

      <nav style={styles.nav}>
        <span style={styles.navLogo}>🚗 RideApp — Driver</span>
        <div style={styles.navRight}>
          <span style={styles.navUser}>👤 {user.name}</span>
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.tabs}>
        <button onClick={() => setTab("available")} style={{ ...styles.tab, ...(tab === "available" ? styles.tabActive : {}) }}>
          🔔 Available Rides {pendingRides.length > 0 && <span style={styles.badge}>{pendingRides.length}</span>}
        </button>
        <button onClick={() => { setTab("history"); loadHistory(); }} style={{ ...styles.tab, ...(tab === "history" ? styles.tabActive : {}) }}>
          📋 My Rides
        </button>
      </div>

      <div style={styles.content}>
        {tab === "available" && (
          <div>
            <div style={styles.liveChip}>🟢 Listening for ride requests...</div>
            {pendingRides.length === 0 ? (
              <div style={{ ...styles.card, textAlign: "center", padding: "60px" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>🚗</div>
                <p style={{ color: "#666" }}>No pending rides. Waiting for passengers...</p>
              </div>
            ) : (
              pendingRides.map((ride) => (
                <div key={ride._id} style={styles.rideCard}>
                  <div style={styles.rideHeader}>
                    <span style={styles.rideId}>Ride #{ride._id.slice(-6)}</span>
                    <span style={styles.fare}>Rs. {ride.fare}</span>
                  </div>
                  <div style={styles.route}>
                    <div style={styles.routeItem}><span style={styles.greenDot} /><span>{ride.pickup?.address || `${ride.pickup?.lat}, ${ride.pickup?.lng}`}</span></div>
                    <div style={styles.routeItem}><span style={styles.redDot} /><span>{ride.drop?.address || `${ride.drop?.lat}, ${ride.drop?.lng}`}</span></div>
                  </div>
                  <div style={styles.rideMeta}>📏 {ride.distanceKm} km</div>
                  <button onClick={() => acceptRide(ride._id)} style={styles.acceptBtn}>✅ Accept Ride</button>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "history" && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>My Rides</h2>
            {history.length === 0 ? <div style={styles.empty}>No rides yet.</div> : (
              history.map((ride) => (
                <div key={ride._id} style={styles.historyItem}>
                  <div style={styles.historyTop}>
                    <span style={styles.historyDate}>{new Date(ride.createdAt).toLocaleDateString()}</span>
                    <span style={{ padding: "3px 10px", borderRadius: "20px", background: statusColor[ride.status] || "#888", color: "#fff", fontSize: "11px", fontWeight: "600" }}>{ride.status}</span>
                  </div>
                  <div style={styles.historyRoute}>{ride.pickup?.address || `${ride.pickup?.lat},${ride.pickup?.lng}`} → {ride.drop?.address || `${ride.drop?.lat},${ride.drop?.lng}`}</div>
                  <div style={styles.historyFare}>Rs. {ride.fare} · {ride.distanceKm} km</div>
                  {ride.status === "accepted" && (
                    <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                      <button onClick={() => updateStatus(ride._id, "ongoing")} style={{ padding: "7px 14px", background: "#8b5cf6", border: "none", borderRadius: "6px", color: "#fff", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>Start</button>
                      <button onClick={() => updateStatus(ride._id, "completed")} style={{ padding: "7px 14px", background: "#22c55e", border: "none", borderRadius: "6px", color: "#fff", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>Complete</button>
                    </div>
                  )}
                  {ride.status === "ongoing" && (
                    <button onClick={() => updateStatus(ride._id, "completed")} style={{ marginTop: "8px", padding: "7px 14px", background: "#22c55e", border: "none", borderRadius: "6px", color: "#fff", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>Mark Completed</button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0f0f0f", color: "#fff", fontFamily: "sans-serif" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", background: "#1a1a1a", borderBottom: "1px solid #2a2a2a" },
  navLogo: { fontSize: "18px", fontWeight: "700" },
  navRight: { display: "flex", alignItems: "center", gap: "16px" },
  navUser: { color: "#aaa", fontSize: "14px" },
  logoutBtn: { padding: "7px 14px", background: "transparent", border: "1px solid #444", borderRadius: "6px", color: "#aaa", cursor: "pointer", fontSize: "13px" },
  tabs: { display: "flex", gap: "8px", padding: "20px 24px 0" },
  tab: { padding: "10px 18px", background: "transparent", border: "1px solid #333", borderRadius: "8px", color: "#888", cursor: "pointer", fontSize: "14px", fontWeight: "500", display: "flex", alignItems: "center", gap: "8px" },
  tabActive: { background: "#fff", color: "#000", borderColor: "#fff" },
  badge: { background: "#ef4444", color: "#fff", borderRadius: "50%", width: "18px", height: "18px", fontSize: "11px", display: "inline-flex", alignItems: "center", justifyContent: "center" },
  content: { padding: "20px 24px", maxWidth: "600px" },
  liveChip: { background: "#1a2a1a", border: "1px solid #22c55e", color: "#22c55e", padding: "8px 14px", borderRadius: "20px", fontSize: "13px", marginBottom: "16px", display: "inline-block" },
  card: { background: "#1a1a1a", borderRadius: "16px", padding: "24px" },
  cardTitle: { fontSize: "20px", fontWeight: "700", marginBottom: "16px" },
  rideCard: { background: "#1a1a1a", borderRadius: "12px", padding: "20px", marginBottom: "12px" },
  rideHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" },
  rideId: { color: "#888", fontSize: "12px" },
  fare: { color: "#22c55e", fontWeight: "700", fontSize: "18px" },
  route: { marginBottom: "12px" },
  routeItem: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", color: "#ddd", fontSize: "14px" },
  greenDot: { width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e", flexShrink: 0 },
  redDot: { width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444", flexShrink: 0 },
  rideMeta: { color: "#888", fontSize: "13px", marginBottom: "14px" },
  acceptBtn: { width: "100%", padding: "12px", background: "#22c55e", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "700", fontSize: "15px", cursor: "pointer" },
  empty: { color: "#666", textAlign: "center", padding: "40px 0" },
  historyItem: { background: "#2a2a2a", borderRadius: "10px", padding: "14px", marginBottom: "10px" },
  historyTop: { display: "flex", justifyContent: "space-between", marginBottom: "6px" },
  historyDate: { color: "#888", fontSize: "12px" },
  historyRoute: { color: "#fff", fontSize: "13px", marginBottom: "4px" },
  historyFare: { color: "#888", fontSize: "12px" },
  toast: { position: "fixed", top: "20px", right: "20px", background: "#333", color: "#fff", padding: "12px 20px", borderRadius: "10px", zIndex: 1000, fontSize: "14px", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" },
};