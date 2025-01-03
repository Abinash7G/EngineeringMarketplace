import React, { useState } from "react";
import API from "../services/api";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "Client", // Default role
    companyType: "", // Default empty for Company-specific roles
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear any existing messages
    try {
      const response = await API.post("login/", formData);
      if (response.status === 200) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        localStorage.setItem("user_role", formData.role);

        if (formData.role === "Company") {
          localStorage.setItem("company_type", formData.companyType);
        }

        setMessage("Login successful!");
      } else {
        setMessage("Unexpected response from the server. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        // Server responded with an error status code
        setMessage(
          error.response.data.message || "Invalid credentials. Please try again."
        );
      } else if (error.request) {
        // Request was made but no response received
        setMessage("No response from the server. Please try again later.");
      } else {
        // Other errors
        setMessage("An error occurred. Please try again.");
      }
    }
  };

  const handleGoogleLogin = () => {
    setMessage("Login with Google clicked!");
  };

  const handleForgotPassword = () => {
    setMessage("Forgot Password clicked!");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Role Selection */}
        <label style={styles.label}>Logging as a :</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="Client">Client</option>
          <option value="Company">Company</option>
        </select>

        {/* Company Type Selection */}
        {formData.role === "Company" && (
          <>
            <label style={styles.label}>Company Type:</label>
            <select
              name="companyType"
              value={formData.companyType}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">Select Company Type</option>
              <option value="Construction Company">
                Construction Company
              </option>
              <option value="Material Supplier">Material Supplier</option>
            </select>
          </>
        )}

        {/* Login Fields */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
        />

        {/* Login Button */}
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>

      {/* Additional Options */}
      <p style={styles.link} onClick={handleForgotPassword}>
        Forgot Password?
      </p>
      <button style={styles.googleButton} onClick={handleGoogleLogin}>
        Login with Google
      </button>
      <p style={styles.createAccount}>
        Don’t have an account?{" "}
        <span style={styles.createAccountLink}>Create one</span>
      </p>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

// CSS Styles
const styles = {
  container: {
    maxWidth: "400px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#0073e6",
  },
  label: {
    fontSize: "1rem",
    marginBottom: "5px",
    display: "block",
    textAlign: "left",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  select: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
    backgroundColor: "#fff",
    cursor: "pointer",
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
  link: {
    color: "#0073e6",
    fontSize: "0.9rem",
    cursor: "pointer",
    textDecoration: "underline",
    marginTop: "10px",
  },
  googleButton: {
    marginTop: "15px",
    padding: "10px",
    fontSize: "1rem",
    color: "white",
    backgroundColor: "#db4437",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  createAccount: {
    marginTop: "20px",
    fontSize: "0.9rem",
  },
  createAccountLink: {
    color: "#0073e6",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "underline",
  },
  message: {
    marginTop: "15px",
    fontSize: "1rem",
    color: "#d9534f",
  },
};

export default Login;
