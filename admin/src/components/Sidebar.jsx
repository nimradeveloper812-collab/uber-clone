import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkStyle = ({ isActive }) => ({
    ...styles.link,
    background: isActive ? "#8b5cf6" : "transparent",
    color: isActive ? "#fff" : "#8b8b9e",
  });

  return (
    <div style={styles.sidebar}>
      <div>
        <div style={styles.logo}>🛡️ Admin Panel</div>
        <p style={styles.adminName}>{admin?.name}</p>

        <nav style={styles.nav}>
          <NavLink to="/dashboard" style={linkStyle}>📊 Dashboard</NavLink>
          <NavLink to="/drivers" style={linkStyle}>🚗 Drivers</NavLink>
          <NavLink to="/passengers" style={linkStyle}>🧍 Passengers</NavLink>
          <NavLink to="/rides" style={linkStyle}>📋 Rides</NavLink>
        </nav>
      </div>

      <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Logout</button>
    </div>
  );
}

const styles = {
  sidebar: { width: "230px", minHeight: "100vh", background: "#16161f", borderRight: "1px solid #2a2a3d", padding: "24px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "fixed" },
  logo: { color: "#fff", fontWeight: "800", fontSize: "17px", marginBottom: "4px" },
  adminName: { color: "#8b8b9e", fontSize: "12px", marginBottom: "24px" },
  nav: { display: "flex", flexDirection: "column", gap: "6px" },
  link: { textDecoration: "none", padding: "11px 14px", borderRadius: "10px", fontSize: "14px", fontWeight: "600" },
  logoutBtn: { background: "transparent", border: "1px solid #f87171", color: "#f87171", padding: "10px", borderRadius: "10px", cursor: "pointer", fontWeight: "600" },
};