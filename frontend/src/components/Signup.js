import React, { useState } from "react";
import API from "../services/api";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    contactNumber: "",
    role: "Client",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("api/signup/", formData);
      setMessage(response.data.message);
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.error);
      } else {
        setMessage("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Signup</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Username:</label>
        <input
          type="text"
          name="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>Contact Number:</label>
        <input
          type="text"
          name="contactNumber"
          placeholder="Enter your contact number"
          value={formData.contactNumber}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          Signup
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

export default SignupPage;
