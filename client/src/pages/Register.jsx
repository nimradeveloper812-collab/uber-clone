import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "passenger", vehicleNumber: "", vehicleModel: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

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
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>🚗</div>
        <h1 style={styles.title}>RideApp</h1>
        <p style={styles.subtitle}>Create your account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.roleRow}>
            {["passenger", "driver"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setForm({ ...form, role: r })}
                style={{ ...styles.roleBtn, ...(form.role === r ? styles.roleBtnActive : {}) }}
              >
                {r === "passenger" ? "🧑 Passenger" : "🚗 Driver"}
              </button>
            ))}
          </div>

          <label style={styles.label}>Full Name</label>
          <input style={styles.input} placeholder="Nimra Ahmed" value={form.name} onChange={set("name")} required />

          <label style={styles.label}>Email</label>
          <input style={styles.input} type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} required />

          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" placeholder="Min 6 characters" value={form.password} onChange={set("password")} required minLength={6} />

          <label style={styles.label}>Phone</label>
          <input style={styles.input} placeholder="+92 300 0000000" value={form.phone} onChange={set("phone")} />

          {form.role === "driver" && (
            <>
              <label style={styles.label}>Vehicle Number</label>
              <input style={styles.input} placeholder="LHR-1234" value={form.vehicleNumber} onChange={set("vehicleNumber")} />
              <label style={styles.label}>Vehicle Model</label>
              <input style={styles.input} placeholder="Honda City 2022" value={form.vehicleModel} onChange={set("vehicleModel")} />
            </>
          )}

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#0f0f0f", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" },
  card: { background: "#1a1a1a", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" },
  logo: { fontSize: "48px", textAlign: "center", marginBottom: "8px" },
  title: { color: "#fff", fontSize: "28px", fontWeight: "700", textAlign: "center", margin: "0 0 4px" },
  subtitle: { color: "#888", textAlign: "center", marginBottom: "24px" },
  roleRow: { display: "flex", gap: "10px", marginBottom: "20px" },
  roleBtn: { flex: 1, padding: "10px", background: "#2a2a2a", border: "2px solid #333", borderRadius: "8px", color: "#888", cursor: "pointer", fontWeight: "600", fontSize: "14px" },
  roleBtnActive: { border: "2px solid #fff", color: "#fff", background: "#333" },
  label: { display: "block", color: "#aaa", fontSize: "13px", marginBottom: "6px", fontWeight: "500" },
  input: { width: "100%", padding: "12px 14px", background: "#2a2a2a", border: "1px solid #333", borderRadius: "8px", color: "#fff", fontSize: "15px", marginBottom: "14px", boxSizing: "border-box", outline: "none" },
  btn: { width: "100%", padding: "13px", background: "#000", border: "2px solid #fff", borderRadius: "8px", color: "#fff", fontSize: "15px", fontWeight: "600", cursor: "pointer", marginTop: "4px" },
  error: { background: "#ff4444", color: "#fff", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" },
  footer: { color: "#888", textAlign: "center", marginTop: "20px", fontSize: "14px" },
  link: { color: "#fff", fontWeight: "600" },
};