import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaTools } from "react-icons/fa";

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <div style={styles.logo}>
        <h1 style={styles.logoText}>ERsathii</h1>
      </div>

      {/* Center Menu */}
      <ul style={styles.ul}>
        <li style={styles.li}>
          <Link to="/" style={styles.link}>
            Home
          </Link>
        </li>
        <li
          style={styles.li}
          onMouseEnter={() => setDropdownVisible(true)}
          onMouseLeave={() => setDropdownVisible(false)}
          onClick={toggleDropdown}
        >
          <span style={styles.link}>
            <FaTools style={styles.icon} /> Services
          </span>
          {dropdownVisible && (
            <ul style={styles.dropdown}>
              <li style={styles.dropdownItem}>
                <Link to="/survey-instrument" style={styles.dropdownLink}>
                  Survey Instrument Rentals
                </Link>
              </li>
              <li style={styles.dropdownItem}>
                <Link to="/engineering-consulting" style={styles.dropdownLink}>
                  Engineering Consulting
                </Link>
              </li>
              <li style={styles.dropdownItem}>
                <Link to="/building-construction" style={styles.dropdownLink}>
                  Building Construction
                </Link>
              </li>
              <li style={styles.dropdownItem}>
                <Link to="/post-maintenance" style={styles.dropdownLink}>
                  Post-Construction Maintenance
                </Link>
              </li>
              <li style={styles.dropdownItem}>
                <Link to="/material-marketplace" style={styles.dropdownLink}>
                  Material Marketplace
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>

      {/* Right Section */}
      <div style={styles.rightSection}>
        <input
          type="text"
          placeholder="Search..."
          style={styles.searchBox}
        />
        <Link to="/signup" style={styles.link}>
          Signup
        </Link>
        <Link to="/login" style={styles.link}>
          Login
        </Link>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#007BFF",
    padding: "10px 20px",
  },
  logo: {
    fontSize: "1.5rem",
    color: "white",
    fontWeight: "bold",
  },
  logoText: {
    margin: 0,
    color: "white",
  },
  ul: {
    display: "flex",
    listStyleType: "none",
    margin: 0,
    padding: 0,
    justifyContent: "center",
    flex: 1,
  },
  li: {
    margin: "0 15px",
    position: "relative",
    cursor: "pointer",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "1rem",
  },
  icon: {
    marginRight: "5px",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    backgroundColor: "white",
    listStyleType: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
  },
  dropdownItem: {
    margin: "5px 0",
  },
  dropdownLink: {
    textDecoration: "none",
    color: "#007BFF",
    fontWeight: "normal",
    display: "block",
    padding: "5px",
    borderRadius: "5px",
    transition: "background-color 0.3s",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  searchBox: {
    padding: "5px 10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    outline: "none",
    fontSize: "1rem",
  },
};

export default Navbar;