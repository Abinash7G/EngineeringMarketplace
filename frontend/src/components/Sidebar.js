import React from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaTools, FaChartBar, FaCog } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>Admin</h2>
      <ul style={styles.menu}>
        <li>
          <Link to="/admin/dashboard" style={styles.link}>
            <FaChartBar /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/users" style={styles.link}>
            <FaUsers /> Users
          </Link>
        </li>
        <li>
          <Link to="/admin/services" style={styles.link}>
            <FaTools /> Services
          </Link>
        </li>
        <li>
          <Link to="/admin/settings" style={styles.link}>
            <FaCog /> Settings
          </Link>
        </li>
      </ul>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "250px",
    backgroundColor: "#007bff",
    color: "white",
    height: "100vh",
    padding: "20px",
    boxSizing: "border-box",
  },
  logo: {
    fontSize: "1.5rem",
    marginBottom: "20px",
  },
  menu: {
    listStyle: "none",
    padding: 0,
  },
  link: {
    display: "flex",
    alignItems: "center",
    color: "white",
    textDecoration: "none",
    padding: "10px",
    margin: "5px 0",
    borderRadius: "5px",
    transition: "background 0.3s",
  },
};

export default Sidebar;
