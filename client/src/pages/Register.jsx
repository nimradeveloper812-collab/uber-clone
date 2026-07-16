import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "passenger", phone: "", vehicleNumber: "", vehicleModel: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      login(data.user, data.token);
      navigate(data.user.role === "driver" ? "/driver" : "/passenger");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div className="blob" style={{ width: 350, height: 350, background: "#22c55e", top: "-80px", left: "-80px", animation: "floaty 9s ease-in-out infinite" }} />
      <div className="blob" style={{ width: 350, height: 350, background: "#d4af37", bottom: "-90px", right: "-90px", animation: "floaty 11s ease-in-out infinite" }} />

      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
        className="glass"
        style={styles.card}
      >
        <div style={styles.logo}>🚗</div>
        <h2 style={styles.title}>Create Account</h2>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.roleToggle}>
          <motion.button whileTap={{ scale: 0.95 }} type="button" onClick={() => setForm({ ...form, role: "passenger" })}
            style={{ ...styles.roleBtn, ...(form.role === "passenger" ? styles.roleBtnActive : {}) }}>
            🧍 Passenger
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} type="button" onClick={() => setForm({ ...form, role: "driver" })}
            style={{ ...styles.roleBtn, ...(form.role === "driver" ? styles.roleBtnActive : {}) }}>
            🚗 Driver
          </motion.button>
        </div>

        <label style={styles.label}>Full Name</label>
        <input style={styles.input} name="name" value={form.name} onChange={handleChange} required />

        <label style={styles.label}>Email</label>
        <input style={styles.input} name="email" type="email" value={form.email} onChange={handleChange} required />

        <label style={styles.label}>Password</label>
        <input style={styles.input} name="password" type="password" value={form.password} onChange={handleChange} required />

        <label style={styles.label}>Phone</label>
        <input style={styles.input} name="phone" placeholder="03XXXXXXXXX" value={form.phone} onChange={handleChange} />

        <AnimatePresence>
          {form.role === "driver" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <label style={styles.label}>Vehicle Number</label>
              <input style={styles.input} name="vehicleNumber" placeholder="LEA-1234" value={form.vehicleNumber} onChange={handleChange} />
              <label style={styles.label}>Vehicle Model</label>
              <input style={styles.input} name="vehicleModel" placeholder="Suzuki Alto" value={form.vehicleModel} onChange={handleChange} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(212,175,55,0.5)" }} whileTap={{ scale: 0.97 }}
          className="shine" style={styles.button} disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </motion.button>

        <p style={styles.footerText}>Already have an account? <Link to="/login" style={styles.link}>Login</Link></p>
      </motion.form>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#050507", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", position: "relative", overflow: "hidden" },
  card: { padding: "34px 30px", borderRadius: "22px", width: "100%", maxWidth: "430px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" },
  logo: { fontSize: "40px", textAlign: "center", marginBottom: "8px" },
  title: { color: "#fff", textAlign: "center", fontSize: "24px", fontFamily: "'Sora', sans-serif", marginBottom: "18px" },
  roleToggle: { display: "flex", gap: "10px", marginBottom: "8px" },
  roleBtn: { flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "#9ca3af", fontWeight: "600", cursor: "pointer" },
  roleBtnActive: { background: "linear-gradient(135deg, #d4af37, #b8952e)", color: "#000", border: "1px solid #d4af37" },
  label: { display: "block", color: "#9ca3af", fontSize: "12px", marginBottom: "6px", marginTop: "14px" },
  input: { width: "100%", padding: "13px 14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "#fff", fontSize: "15px", outline: "none" },
  button: { width: "100%", marginTop: "26px", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #d4af37, #b8952e)", color: "#000", fontWeight: "700", fontSize: "16px", cursor: "pointer" },
  error: { background: "rgba(127,29,29,0.5)", color: "#fecaca", padding: "10px 14px", borderRadius: "10px", marginBottom: "10px", fontSize: "13px" },
  footerText: { textAlign: "center", color: "#9ca3af", fontSize: "14px", marginTop: "18px" },
  link: { color: "#d4af37", textDecoration: "none", fontWeight: "600" },
};