import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      if (data.user.role !== "admin") {
        setError("Access denied — admin account required");
        setLoading(false);
        return;
      }
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.logo}>🛡️</div>
        <h2 style={styles.title}>RideApp Admin</h2>
        <p style={styles.subtitle}>Control panel access only</p>

        {error && <div style={styles.error}>{error}</div>}

        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="admin@rideapp.com"
          required
        />

        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="••••••••"
          required
        />

        <button style={styles.button} disabled={loading}>
          {loading ? "Verifying..." : "Login to Admin Panel"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg, #0a0a0a 0%, #1e1b2e 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" },
  card: { background: "#16161f", padding: "36px 30px", borderRadius: "18px", width: "100%", maxWidth: "400px", boxShadow: "0 8px 30px rgba(0,0,0,0.5)", border: "1px solid #2a2a3d" },
  logo: { fontSize: "40px", textAlign: "center", marginBottom: "8px" },
  title: { color: "#fff", textAlign: "center", fontSize: "22px", marginBottom: "4px" },
  subtitle: { color: "#8b8b9e", textAlign: "center", fontSize: "13px", marginBottom: "20px" },
  label: { display: "block", color: "#8b8b9e", fontSize: "13px", marginBottom: "6px", marginTop: "14px" },
  input: { width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #2a2a3d", background: "#0a0a0a", color: "#fff", fontSize: "15px", outline: "none" },
  button: { width: "100%", marginTop: "24px", padding: "13px", borderRadius: "10px", border: "none", background: "#8b5cf6", color: "#fff", fontWeight: "700", fontSize: "15px", cursor: "pointer" },
  error: { background: "#7f1d1d", color: "#fecaca", padding: "10px 14px", borderRadius: "8px", marginBottom: "10px", fontSize: "13px" },
};