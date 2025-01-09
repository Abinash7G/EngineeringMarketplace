import React, { useState } from "react";
import API from "../services/api";
import { FaGoogle } from "react-icons/fa"; // Import Google icon from react-icons
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
} from "@mui/material";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
    <Container maxWidth="xs" sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Username"
          name="username"
          variant="outlined"
          value={formData.username}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          value={formData.password}
          onChange={handleChange}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </Box>

      <Typography
        variant="body2"
        align="center"
        sx={{ mt: 2, color: "primary.main", cursor: "pointer" }}
        onClick={handleForgotPassword}
      >
        Forgot Password?
      </Typography>

      <Button
        variant="contained"
        startIcon={<FaGoogle />}
        onClick={handleGoogleLogin}
        sx={{
          mt: 2,
          bgcolor: "#db4437",
          color: "white",
          "&:hover": { bgcolor: "#c33d2e" },
        }}
        fullWidth
      >
        Login with Google
      </Button>

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Don’t have an account?{" "}
        <span style={{ fontWeight: "bold", cursor: "pointer", color: "#0073e6" }}>
          Create one
        </span>
      </Typography>

      {message && (
        <Typography
          variant="body1"
          align="center"
          sx={{ mt: 2, color: "error.main" }}
        >
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default Login;
