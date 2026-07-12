import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function PassengerDashboard() {
  const { user, logout } = useAuth();
  const [pickup, setPickup] = useState({ lat: "", lng: "", address: "" });
  const [drop, setDrop] = useState({ lat: "", lng: "", address: "" });
  const [currentRide, setCurrentRide] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("book");

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    try {
      const { data } = await api.get("/rides/history");
      setHistory(data);
    } catch {}
  };

  const requestRide = async () => {
    if (!pickup.lat || !pickup.lng || !drop.lat || !drop.lng) {
      setError("Please fill in all coordinates");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/rides/request", { pickup, drop });
      setCurrentRide(data);
      setTab("status");
      loadHistory();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to request ride");
    } finally {
      setLoading(false);
    }
  };

  const cancelRide = async () => {
    if (!currentRide) return;
    try {
      await api.patch(`/rides/${currentRide._id}/status`, { status: "cancelled" });
      setCurrentRide({ ...currentRide, status: "cancelled" });
      loadHistory();
    } catch {}
  };

  const statusColor = { requested: "#f59e0b", accepted: "#3b82f6", ongoing: "#8b5cf6", completed: "#22c55e", cancelled: "#ef4444" };

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <span style={styles.navLogo}>🚗 RideApp</span>
        <div style={styles.navRight}>
          <span style={styles.navUser}>👋 {user.name}</span>
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.tabs}>
        {["book", "status", "history"].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}>
            {t === "book" ? "📍 Book Ride" : t === "status" ? "🔄 Current Ride" : "📋 History"}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {tab === "book" && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Request a Ride</h2>
            <p style={styles.hint}>💡 Enter lat/lng (e.g. Lahore: 31.5204, 74.3587)</p>
            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.locationBlock}>
              <div style={styles.greenDot} />
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Pickup</label>
                <div style={styles.row}>
                  <input style={styles.input} placeholder="Lat" value={pickup.lat} onChange={(e) => setPickup({ ...pickup, lat: e.target.value })} />
                  <input style={styles.input} placeholder="Lng" value={pickup.lng} onChange={(e) => setPickup({ ...pickup, lng: e.target.value })} />
                </div>
                <input style={{ ...styles.input, width: "100%", boxSizing: "border-box" }} placeholder="Address (optional)" value={pickup.address} onChange={(e) => setPickup({ ...pickup, address: e.target.value })} />
              </div>
            </div>

            <div style={styles.locationBlock}>
              <div style={styles.redDot} />
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Drop</label>
                <div style={styles.row}>
                  <input style={styles.input} placeholder="Lat" value={drop.lat} onChange={(e) => setDrop({ ...drop, lat: e.target.value })} />
                  <input style={styles.input} placeholder="Lng" value={drop.lng} onChange={(e) => setDrop({ ...drop, lng: e.target.value })} />
                </div>
                <input style={{ ...styles.input, width: "100%", boxSizing: "border-box" }} placeholder="Address (optional)" value={drop.address} onChange={(e) => setDrop({ ...drop, address: e.target.value })} />
              </div>
            </div>

            <button onClick={requestRide} style={styles.btn} disabled={loading}>
              {loading ? "Requesting..." : "🚗 Request Ride"}
            </button>
          </div>
        )}

        {tab === "status" && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Current Ride</h2>
            {!currentRide ? (
              <div style={styles.empty}>No active ride. Book one first!</div>
            ) : (
              <div>
                <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: "20px", background: statusColor[currentRide.status] || "#888", color: "#fff", fontWeight: "700", fontSize: "13px", marginBottom: "20px" }}>
                  {currentRide.status.toUpperCase()}
                </div>
                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}><span style={styles.infoLabel}>📍 Pickup</span><span style={styles.infoVal}>{currentRide.pickup?.address || `${currentRide.pickup?.lat}, ${currentRide.pickup?.lng}`}</span></div>
                  <div style={styles.infoItem}><span style={styles.infoLabel}>🏁 Drop</span><span style={styles.infoVal}>{currentRide.drop?.address || `${currentRide.drop?.lat}, ${currentRide.drop?.lng}`}</span></div>
                  <div style={styles.infoItem}><span style={styles.infoLabel}>📏 Distance</span><span style={styles.infoVal}>{currentRide.distanceKm} km</span></div>
                  <div style={styles.infoItem}><span style={styles.infoLabel}>💰 Fare</span><span style={styles.infoVal}>Rs. {currentRide.fare}</span></div>
                </div>
                {currentRide.status === "requested" && (
                  <button onClick={cancelRide} style={{ ...styles.btn, background: "#ef4444", borderColor: "#ef4444", color: "#fff" }}>Cancel Ride</button>
                )}
              </div>
            )}
          </div>
        )}

        {tab === "history" && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Ride History</h2>
            {history.length === 0 ? <div style={styles.empty}>No rides yet.</div> : (
              history.map((ride) => (
                <div key={ride._id} style={styles.historyItem}>
                  <div style={styles.historyTop}>
                    <span style={styles.historyDate}>{new Date(ride.createdAt).toLocaleDateString()}</span>
                    <span style={{ padding: "3px 10px", borderRadius: "20px", background: statusColor[ride.status] || "#888", color: "#fff", fontSize: "11px", fontWeight: "600" }}>{ride.status}</span>
                  </div>
                  <div style={styles.historyRoute}>{ride.pickup?.address || `${ride.pickup?.lat},${ride.pickup?.lng}`} → {ride.drop?.address || `${ride.drop?.lat},${ride.drop?.lng}`}</div>
                  <div style={styles.historyFare}>Rs. {ride.fare} · {ride.distanceKm} km</div>
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
  navLogo: { fontSize: "20px", fontWeight: "700" },
  navRight: { display: "flex", alignItems: "center", gap: "16px" },
  navUser: { color: "#aaa", fontSize: "14px" },
  logoutBtn: { padding: "7px 14px", background: "transparent", border: "1px solid #444", borderRadius: "6px", color: "#aaa", cursor: "pointer", fontSize: "13px" },
  tabs: { display: "flex", gap: "8px", padding: "20px 24px 0" },
  tab: { padding: "10px 18px", background: "transparent", border: "1px solid #333", borderRadius: "8px", color: "#888", cursor: "pointer", fontSize: "14px", fontWeight: "500" },
  tabActive: { background: "#fff", color: "#000", borderColor: "#fff" },
  content: { padding: "20px 24px", maxWidth: "600px" },
  card: { background: "#1a1a1a", borderRadius: "16px", padding: "28px" },
  cardTitle: { fontSize: "20px", fontWeight: "700", marginBottom: "16px", color: "#fff" },
  hint: { color: "#666", fontSize: "13px", marginBottom: "20px" },
  error: { background: "#ff4444", color: "#fff", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" },
  label: { color: "#aaa", fontSize: "13px", fontWeight: "500", display: "block", marginBottom: "6px" },
  row: { display: "flex", gap: "10px", marginBottom: "8px" },
  input: { flex: 1, padding: "10px 12px", background: "#2a2a2a", border: "1px solid #333", borderRadius: "8px", color: "#fff", fontSize: "14px", outline: "none" },
  locationBlock: { display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "20px" },
  greenDot: { width: "12px", height: "12px", borderRadius: "50%", background: "#22c55e", marginTop: "32px", flexShrink: 0 },
  redDot: { width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444", marginTop: "32px", flexShrink: 0 },
  btn: { width: "100%", padding: "13px", background: "#fff", border: "2px solid #fff", borderRadius: "8px", color: "#000", fontSize: "15px", fontWeight: "700", cursor: "pointer", marginTop: "8px" },
  infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" },
  infoItem: { background: "#2a2a2a", borderRadius: "10px", padding: "14px" },
  infoLabel: { display: "block", color: "#888", fontSize: "12px", marginBottom: "4px" },
  infoVal: { color: "#fff", fontSize: "14px", fontWeight: "600" },
  empty: { color: "#666", textAlign: "center", padding: "40px 0" },
  historyItem: { background: "#2a2a2a", borderRadius: "10px", padding: "14px", marginBottom: "10px" },
  historyTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" },
  historyDate: { color: "#888", fontSize: "12px" },
  historyRoute: { color: "#fff", fontSize: "13px", marginBottom: "4px" },
  historyFare: { color: "#888", fontSize: "12px" },
};