import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.logo}>🚗</div>
        <h2 style={styles.title}>Create Account</h2>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.roleToggle}>
          <button type="button" onClick={() => setForm({ ...form, role: "passenger" })}
            style={{ ...styles.roleBtn, ...(form.role === "passenger" ? styles.roleBtnActive : {}) }}>
            🧍 Passenger
          </button>
          <button type="button" onClick={() => setForm({ ...form, role: "driver" })}
            style={{ ...styles.roleBtn, ...(form.role === "driver" ? styles.roleBtnActive : {}) }}>
            🚗 Driver
          </button>
        </div>

        <label style={styles.label}>Full Name</label>
        <input style={styles.input} name="name" value={form.name} onChange={handleChange} required />

        <label style={styles.label}>Email</label>
        <input style={styles.input} name="email" type="email" value={form.email} onChange={handleChange} required />

        <label style={styles.label}>Password</label>
        <input style={styles.input} name="password" type="password" value={form.password} onChange={handleChange} required />

        <label style={styles.label}>Phone</label>
        <input style={styles.input} name="phone" placeholder="03XXXXXXXXX" value={form.phone} onChange={handleChange} />

        {form.role === "driver" && (
          <>
            <label style={styles.label}>Vehicle Number</label>
            <input style={styles.input} name="vehicleNumber" placeholder="LEA-1234" value={form.vehicleNumber} onChange={handleChange} />

            <label style={styles.label}>Vehicle Model</label>
            <input style={styles.input} name="vehicleModel" placeholder="Suzuki Alto" value={form.vehicleModel} onChange={handleChange} />
          </>
        )}

        <button style={styles.button} disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p style={styles.footerText}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" },
  card: { background: "#1a1a2e", padding: "32px 28px", borderRadius: "18px", width: "100%", maxWidth: "420px", boxShadow: "0 8px 30px rgba(0,0,0,0.4)" },
  logo: { fontSize: "40px", textAlign: "center", marginBottom: "8px" },
  title: { color: "#fff", textAlign: "center", fontSize: "24px", marginBottom: "18px" },
  roleToggle: { display: "flex", gap: "10px", marginBottom: "10px" },
  roleBtn: { flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid #333", background: "#0f0f0f", color: "#9ca3af", fontWeight: "600", cursor: "pointer" },
  roleBtnActive: { background: "#22c55e", color: "#000", border: "1px solid #22c55e" },
  label: { display: "block", color: "#9ca3af", fontSize: "13px", marginBottom: "6px", marginTop: "14px" },
  input: { width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #333", background: "#0f0f0f", color: "#fff", fontSize: "15px", outline: "none" },
  button: { width: "100%", marginTop: "24px", padding: "13px", borderRadius: "10px", border: "none", background: "#22c55e", color: "#000", fontWeight: "700", fontSize: "16px", cursor: "pointer" },
  error: { background: "#7f1d1d", color: "#fecaca", padding: "10px 14px", borderRadius: "8px", marginBottom: "10px", fontSize: "13px" },
  footerText: { textAlign: "center", color: "#9ca3af", fontSize: "14px", marginTop: "18px" },
  link: { color: "#22c55e", textDecoration: "none", fontWeight: "600" },
};