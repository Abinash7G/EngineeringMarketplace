import React, { useState, useEffect } from "react";
import API from "../services/api";

const CompanyRegistration = () => {
  const [formData, setFormData] = useState({
    companyType: "",
    companyName: "",
    companyEmail: "",
    companyRegistrationId: "",
    location: "",
    servicesProvided: [],
  });

  const [servicesOptions, setServicesOptions] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await API.get("/api/services/");
        setServicesOptions(response.data); // Assuming API returns an array of service objects
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      const serviceId = parseInt(value, 10);
      setFormData((prevData) => ({
        ...prevData,
        servicesProvided: checked
          ? [...prevData.servicesProvided, serviceId]
          : prevData.servicesProvided.filter((id) => id !== serviceId),
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/api/signup/", formData);
      setMessage(response.data.message);
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.error);
      } else {
        setMessage("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Company Registration</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Company Type:</label>
        <select
          name="companyType"
          value={formData.companyType}
          onChange={handleChange}
          style={styles.input}
          required
        >
          <option value="">Select Company Type</option>
          <option value="construction">Construction Company</option>
          <option value="supplier">Material Supplier</option>
        </select>

        <label style={styles.label}>Company Name:</label>
        <input
          type="text"
          name="companyName"
          placeholder="Enter your company name"
          value={formData.companyName}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>Company Email:</label>
        <input
          type="email"
          name="companyEmail"
          placeholder="Enter company email"
          value={formData.companyEmail}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>Company Registration ID:</label>
        <input
          type="text"
          name="companyRegistrationId"
          placeholder="Enter registration ID"
          value={formData.companyRegistrationId}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>Location:</label>
        <input
          type="text"
          name="location"
          placeholder="Enter location"
          value={formData.location}
          onChange={handleChange}
          style={styles.input}
          required
        />

        {formData.companyType === "construction" && (
          <>
            <label style={styles.label}>List of Services:</label>
            <div style={styles.checkboxContainer}>
              {servicesOptions.map((service) => (
                <div key={service.id} style={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    id={`service-${service.id}`}
                    name="servicesProvided"
                    value={service.id}
                    checked={formData.servicesProvided.includes(service.id)}
                    onChange={handleChange}
                  />
                  <label htmlFor={`service-${service.id}`} style={styles.checkboxLabel}>
                    {service.name}
                  </label>
                </div>
              ))}
            </div>
          </>
        )}

        <button type="submit" style={styles.button}>
          Register
        </button>
      </form>
      {message && (
        <p
          style={{
            ...styles.message,
            color: message.includes("successful") ? "#28a745" : "#d9534f",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "left",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#0073e6",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    fontWeight: "bold",
    fontSize: "1rem",
    marginBottom: "5px",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "border-color 0.3s",
  },
  checkboxContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  checkboxItem: {
    display: "flex",
    alignItems: "center",
  },
  checkboxLabel: {
    marginLeft: "5px",
  },
  button: {
    padding: "10px",
    fontSize: "1rem",
    color: "white",
    backgroundColor: "#0073e6",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  message: {
    marginTop: "15px",
    fontSize: "1rem",
    textAlign: "center",
  },
};

export default CompanyRegistration;
