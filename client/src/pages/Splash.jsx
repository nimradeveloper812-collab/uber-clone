import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/login"), 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.logoBox}>
        <div style={styles.logo}>🚗</div>
        <h1 style={styles.title}>RideApp</h1>
        <p style={styles.tagline}>Your ride, your way</p>
      </div>
      <div style={styles.spinner}></div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontFamily: "'Segoe UI', sans-serif",
  },
  logoBox: { textAlign: "center", animation: "fadeIn 1s ease-in" },
  logo: { fontSize: "64px", marginBottom: "10px" },
  title: { fontSize: "42px", fontWeight: "800", margin: 0, letterSpacing: "1px" },
  tagline: { color: "#9ca3af", marginTop: "8px", fontSize: "15px" },
  spinner: {
    marginTop: "40px",
    width: "32px",
    height: "32px",
    border: "3px solid #333",
    borderTop: "3px solid #22c55e",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};