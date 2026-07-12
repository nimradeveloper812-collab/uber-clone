import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>🚗</div>
        <h1 style={styles.title}>RideApp</h1>
        <p style={styles.subtitle}>Sign in to your account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
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
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>Register</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#0f0f0f", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" },
  card: { background: "#1a1a1a", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "400px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" },
  logo: { fontSize: "48px", textAlign: "center", marginBottom: "8px" },
  title: { color: "#fff", fontSize: "28px", fontWeight: "700", textAlign: "center", margin: "0 0 4px" },
  subtitle: { color: "#888", textAlign: "center", marginBottom: "28px" },
  label: { display: "block", color: "#aaa", fontSize: "13px", marginBottom: "6px", fontWeight: "500" },
  input: { width: "100%", padding: "12px 14px", background: "#2a2a2a", border: "1px solid #333", borderRadius: "8px", color: "#fff", fontSize: "15px", marginBottom: "16px", boxSizing: "border-box", outline: "none" },
  btn: { width: "100%", padding: "13px", background: "#000", border: "2px solid #fff", borderRadius: "8px", color: "#fff", fontSize: "15px", fontWeight: "600", cursor: "pointer", marginTop: "4px" },
  error: { background: "#ff4444", color: "#fff", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" },
  footer: { color: "#888", textAlign: "center", marginTop: "20px", fontSize: "14px" },
  link: { color: "#fff", fontWeight: "600" },
};