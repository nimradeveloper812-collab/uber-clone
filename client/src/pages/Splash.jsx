import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/login"), 2800);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.page}>
      <div className="blob" style={{ width: 400, height: 400, background: "#d4af37", top: "-100px", left: "-100px" }} />
      <div className="blob" style={{ width: 400, height: 400, background: "#22c55e", bottom: "-100px", right: "-100px" }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ textAlign: "center", zIndex: 2 }}
      >
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          style={styles.carWrap}
        >
          <motion.span
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            style={styles.carEmoji}
          >
            🚗
          </motion.span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          style={styles.title}
        >
          Ride<span style={{ color: "#d4af37" }}>App</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={styles.tagline}
        >
          Luxury rides. One tap away.
        </motion.p>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "140px" }}
          transition={{ delay: 1.3, duration: 1.2, ease: "easeInOut" }}
          style={styles.loadBar}
        />
      </motion.div>
    </div>
  );
}

const styles = {
  page: { height: "100vh", width: "100vw", background: "#050507", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Sora', sans-serif", position: "relative", overflow: "hidden" },
  carWrap: { fontSize: "70px" },
  carEmoji: { display: "inline-block", filter: "drop-shadow(0 10px 20px rgba(212,175,55,0.4))" },
  title: { fontSize: "46px", fontWeight: "800", letterSpacing: "1px", marginTop: "10px" },
  tagline: { color: "#9ca3af", marginTop: "10px", fontSize: "15px", letterSpacing: "0.5px" },
  loadBar: { height: "3px", background: "linear-gradient(90deg, #d4af37, #22c55e)", borderRadius: "10px", margin: "30px auto 0", boxShadow: "0 0 15px rgba(212,175,55,0.6)" },
};