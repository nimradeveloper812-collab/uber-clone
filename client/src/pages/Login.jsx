import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
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
      <div className="blob" style={{ width: 350, height: 350, background: "#d4af37", top: "-80px", right: "-80px", animation: "floaty 8s ease-in-out infinite" }} />
      <div className="blob" style={{ width: 350, height: 350, background: "#22c55e", bottom: "-100px", left: "-100px", animation: "floaty 10s ease-in-out infinite" }} />

      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="glass"
        style={styles.card}
      >
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} style={styles.logo}>🚗</motion.div>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login to continue your journey</p>

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={styles.error}>
            {error}
          </motion.div>
        )}

        <label style={styles.label}>Email</label>
        <input style={styles.input} type="email" placeholder="you@example.com"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />

        <label style={styles.label}>Password</label>
        <input style={styles.input} type="password" placeholder="••••••••"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />

        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(212,175,55,0.5)" }}
          whileTap={{ scale: 0.97 }}
          className="shine"
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>

        <p style={styles.footerText}>
          No account? <Link to="/register" style={styles.link}>Register</Link>
        </p>
      </motion.form>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#050507", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", position: "relative", overflow: "hidden" },
  card: { padding: "36px 30px", borderRadius: "22px", width: "100%", maxWidth: "410px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" },
  logo: { fontSize: "44px", textAlign: "center", marginBottom: "6px" },
  title: { color: "#fff", textAlign: "center", fontSize: "25px", fontFamily: "'Sora', sans-serif", fontWeight: "700" },
  subtitle: { color: "#9ca3af", textAlign: "center", fontSize: "13px", marginTop: "6px", marginBottom: "20px" },
  label: { display: "block", color: "#9ca3af", fontSize: "12px", marginBottom: "6px", marginTop: "14px", letterSpacing: "0.5px" },
  input: { width: "100%", padding: "13px 14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "#fff", fontSize: "15px", outline: "none" },
  button: { width: "100%", marginTop: "26px", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #d4af37, #b8952e)", color: "#000", fontWeight: "700", fontSize: "16px", cursor: "pointer" },
  error: { background: "rgba(127,29,29,0.5)", color: "#fecaca", padding: "10px 14px", borderRadius: "10px", marginBottom: "10px", fontSize: "13px", border: "1px solid rgba(248,113,113,0.3)" },
  footerText: { textAlign: "center", color: "#9ca3af", fontSize: "14px", marginTop: "20px" },
  link: { color: "#d4af37", textDecoration: "none", fontWeight: "600" },
};