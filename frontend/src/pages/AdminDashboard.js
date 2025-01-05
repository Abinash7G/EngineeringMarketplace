import React, { useState } from "react";
import { FaUsers, FaTools, FaChartBar, FaBuilding } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Chart from "../components/Chart";

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "ABC Construction",
      email: "contact@abcconstruction.com",
      role: "Construction Company",
      subscription: "Monthly",
      safetyTraining: true,
      feedback: "Excellent service but needs faster response time.",
    },
    {
      id: 2,
      name: "XYZ Supplies",
      email: "sales@xyzsupplies.com",
      role: "Material Supplier",
      subscription: "Quarterly",
      safetyTraining: false,
      feedback: "Reliable but room for improvement in material quality.",
    },
  ]);

  const approveCompany = (id) => {
    alert(`Approved company with ID: ${id}`);
    setCompanies(companies.filter((company) => company.id !== id));
  };

  const rejectCompany = (id) => {
    alert(`Rejected company with ID: ${id}`);
    setCompanies(companies.filter((company) => company.id !== id));
  };

  return (
    <div style={styles.dashboardContainer}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div style={styles.mainContent}>
        <header style={styles.header}>
          <h1>Admin Dashboard</h1>
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
            <FaBuilding size={30} />
            <div>
              <h3>Total Companies</h3>
              <p>200</p>
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

        {/* Company Management */}
        <section style={styles.companyManagement}>
          <h2>Company Management</h2>
          <div style={styles.tableHeader}>
            <div>ID</div>
            <div>Name</div>
            <div>Email</div>
            <div>Role</div>
            <div>Subscription</div>
            <div>Actions</div>
          </div>
          {companies.map((company) => (
            <div key={company.id} style={styles.tableRow}>
              <div>{company.id}</div>
              <div>{company.name}</div>
              <div>{company.email}</div>
              <div>{company.role}</div>
              <div>{company.subscription}</div>
              <div>
                <button style={styles.approveButton} onClick={() => approveCompany(company.id)}>
                  Approve
                </button>
                <button style={styles.rejectButton} onClick={() => rejectCompany(company.id)}>
                  Reject
                </button>
                <button style={styles.viewButton} onClick={() => alert(`Viewing details for ${company.name}`)}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Safety Training */}
        <section style={styles.safetyTraining}>
          <h2>Safety Training Requests</h2>
          <div style={styles.tableHeader}>
            <div>ID</div>
            <div>Company</div>
            <div>Request Training</div>
          </div>
          {companies
            .filter((company) => company.safetyTraining)
            .map((company) => (
              <div key={company.id} style={styles.tableRow}>
                <div>{company.id}</div>
                <div>{company.name}</div>
                <div>
                  <button style={styles.requestButton} onClick={() => alert(`Requested training for ${company.name}`)}>
                    Request Training
                  </button>
                </div>
              </div>
            ))}
        </section>

        {/* Feedback and Disputes */}
        <section style={styles.feedbackSection}>
          <h2>Feedback & Disputes</h2>
          {companies.map((company) => (
            <div key={company.id} style={styles.feedbackRow}>
              <h3>{company.name}</h3>
              <p>{company.feedback}</p>
              <button style={styles.resolveButton} onClick={() => alert(`Resolved issue for ${company.name}`)}>
                Resolve Dispute
              </button>
            </div>
          ))}
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
    marginBottom: "20px",
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
  companyManagement: {
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 2fr 2fr 2fr 3fr",
    fontWeight: "bold",
    paddingBottom: "10px",
    borderBottom: "2px solid #ddd",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 2fr 2fr 2fr 3fr",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #ddd",
  },
  approveButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    marginRight: "10px",
    cursor: "pointer",
  },
  rejectButton: {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    marginRight:"10px",
    cursor: "pointer",
  },
  viewButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "20px",
  },
  safetyTraining: {
    marginTop: "20px",
  },
  feedbackSection: {
    marginTop: "20px",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  feedbackRow: {
    marginBottom: "10px",
  },
  resolveButton: {
    backgroundColor: "#ffa500",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default AdminDashboard;
