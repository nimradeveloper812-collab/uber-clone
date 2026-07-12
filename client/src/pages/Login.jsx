import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
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
      login(data.user, data.token);
      navigate(data.user.role === "driver" ? "/driver" : "/passenger");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.logo}>🚗</div>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login to continue</p>

        {error && <div style={styles.error}>{error}</div>}

        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button style={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={styles.footerText}>
          No account? <Link to="/register" style={styles.link}>Register</Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" },
  card: { background: "#1a1a2e", padding: "32px 28px", borderRadius: "18px", width: "100%", maxWidth: "400px", boxShadow: "0 8px 30px rgba(0,0,0,0.4)" },
  logo: { fontSize: "40px", textAlign: "center", marginBottom: "8px" },
  title: { color: "#fff", textAlign: "center", fontSize: "24px", marginBottom: "4px" },
  subtitle: { color: "#9ca3af", textAlign: "center", fontSize: "14px", marginBottom: "20px" },
  label: { display: "block", color: "#9ca3af", fontSize: "13px", marginBottom: "6px", marginTop: "14px" },
  input: { width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #333", background: "#0f0f0f", color: "#fff", fontSize: "15px", outline: "none" },
  button: { width: "100%", marginTop: "24px", padding: "13px", borderRadius: "10px", border: "none", background: "#22c55e", color: "#000", fontWeight: "700", fontSize: "16px", cursor: "pointer" },
  error: { background: "#7f1d1d", color: "#fecaca", padding: "10px 14px", borderRadius: "8px", marginBottom: "10px", fontSize: "13px" },
  footerText: { textAlign: "center", color: "#9ca3af", fontSize: "14px", marginTop: "18px" },
  link: { color: "#22c55e", textDecoration: "none", fontWeight: "600" },
};