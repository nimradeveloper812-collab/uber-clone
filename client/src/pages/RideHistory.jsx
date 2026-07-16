import { useEffect, useState } from "react";
import api from "../api/axios";

export default function RideHistory() {
  const [rides, setRides] = useState([]);
  const [ratingFor, setRatingFor] = useState(null);
  const [stars, setStars] = useState(5);

  const load = () => api.get("/rides/history").then(({ data }) => setRides(data));

  useEffect(() => { load(); }, []);

  const statusColor = {
    completed: "#22c55e", cancelled: "#f87171", requested: "#facc15", accepted: "#60a5fa", ongoing: "#a78bfa",
  };

  const submitRating = async () => {
    try {
      await api.post(`/ratings/${ratingFor}`, { stars });
      setRatingFor(null);
      setStars(5);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Rating failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Ride History</h2>
        {rides.length === 0 && <p style={styles.empty}>No rides yet</p>}
        {rides.map((r) => (
          <div key={r._id} style={styles.rideCard}>
            <div style={{ flex: 1 }}>
              <p style={styles.route}>{r.pickup?.address || "Pickup"} → {r.drop?.address || "Drop"}</p>
              <p style={styles.meta}>{new Date(r.createdAt).toLocaleDateString()} • {r.distanceKm} km</p>

              {r.status === "completed" && !r.rating && (
                ratingFor === r._id ? (
                  <div style={styles.ratingBox}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span key={n} onClick={() => setStars(n)} style={{ cursor: "pointer", fontSize: "20px", color: n <= stars ? "#facc15" : "#4b5563" }}>★</span>
                    ))}
                    <button style={styles.submitBtn} onClick={submitRating}>Submit</button>
                  </div>
                ) : (
                  <button style={styles.rateBtn} onClick={() => setRatingFor(r._id)}>⭐ Rate this ride</button>
                )
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={styles.fare}>Rs. {r.fare}</p>
              <span style={{ ...styles.badge, background: statusColor[r.status] || "#333" }}>{r.status}</span>
              {r.rating && <p style={{ marginTop: 6, fontSize: 13 }}>⭐ {r.rating}</p>}
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
  rateBtn: { marginTop: "8px", background: "transparent", border: "1px solid #facc15", color: "#facc15", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", cursor: "pointer" },
  ratingBox: { marginTop: "8px", display: "flex", alignItems: "center", gap: "4px" },
  submitBtn: { marginLeft: "10px", background: "#22c55e", color: "#000", border: "none", padding: "5px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer" },
};