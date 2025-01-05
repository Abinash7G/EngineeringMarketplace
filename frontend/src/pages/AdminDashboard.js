import React from "react";
import { FaUsers, FaTools, FaChartBar, FaEnvelope } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Chart from "../components/Chart";
import Table from "../components/Table";

const AdminDashboard = () => {
  return (
    <div style={styles.dashboardContainer}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div style={styles.mainContent}>
        <header style={styles.header}>
          <h1>Admin Dashboard</h1>
          <input type="text" placeholder="Search..." style={styles.searchBar} />
          <div style={styles.profile}>
            <FaEnvelope style={styles.icon} />
            <div>Admin</div>
          </div>
        </header>

        {/* Overview Cards */}
        <section style={styles.overview}>
          <div style={styles.card}>
            <FaUsers size={30} />
            <div>
              <h3>Total Users</h3>
              <p>1200</p>
            </div>
          </div>
          <div style={styles.card}>
            <FaTools size={30} />
            <div>
              <h3>Active Services</h3>
              <p>350</p>
            </div>
          </div>
          <div style={styles.card}>
            <FaChartBar size={30} />
            <div>
              <h3>Total Revenue</h3>
              <p>$45,000</p>
            </div>
          </div>
        </section>

        {/* Analytics Charts */}
        <section style={styles.analytics}>
          <h2>Analytics</h2>
          <Chart />
        </section>

        {/* Management Table */}
        <section style={styles.tableSection}>
          <h2>User Management</h2>
          <Table />
        </section>
      </div>
    </div>
  );
};

const styles = {
  dashboardContainer: {
    display: "flex",
  },
  mainContent: {
    flex: 1,
    padding: "20px",
    backgroundColor: "#f9f9f9",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  searchBar: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    width: "300px",
  },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  icon: {
    color: "#007bff",
    cursor: "pointer",
  },
  overview: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  },
  card: {
    flex: 1,
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  analytics: {
    marginBottom: "20px",
  },
  tableSection: {
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    padding: "20px",
  },
};

export default AdminDashboard;
