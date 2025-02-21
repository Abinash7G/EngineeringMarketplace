import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import API from "../services/api"; // Axios instance
//import { FaGoogle } from "react-icons/fa"; // Google icon
import { TextField, Button, Typography, Box, Container } from "@mui/material";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [email, setEmail] = useState(""); // For forgot password
  const [message, setMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false); // Toggle forgot password view

  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); 

    try {
        const response = await API.post("/api/login/", formData);
        if (response.status === 200) {
            const { access, role,company_id } = response.data;
            localStorage.setItem("access_token", access);
            localStorage.setItem("company_id", company_id);
            

            // Redirect based on role
            if (role === "Platformadmin") navigate("/admin"); //!* Redirect to admin dashboard *!
            else if (role === "Admin") navigate("/company"); //company dashboard
            else navigate("/client");
        }
    } catch (error) {
        if (error.response) {
            setMessage(error.response.data.message || "Invalid credentials.");
        } else {
            setMessage("An error occurred. Please try again.");
        }
    }
};
  // const handleGoogleLogin = () => {
  //   window.location.href = "http://127.0.0.1:8000/auth/login/google-oauth2/";
  // };

  const handleForgotPassword = async () => {
    try {
      const response = await API.post("api/forgot-password/", { email });
      if (response.status === 200) {
        setMessage("Password reset email sent!");
        setShowForgotPassword(false); // Return to login view
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.error || "Error resetting password.");
      } else {
        setMessage("No response from server. Please try again later.");
      }
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {showForgotPassword ? "Forgot Password" : "Login"}
      </Typography>
      {!showForgotPassword ? (
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
      ) : (
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleForgotPassword();
          }}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Email"
            name="email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Reset Password
          </Button>
        </Box>
      )}

      {!showForgotPassword && (
        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 2, color: "primary.main", cursor: "pointer" }}
          onClick={() => setShowForgotPassword(true)}
        >
          Forgot Password?
        </Typography>
      )}

      {showForgotPassword && (
        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 2, color: "primary.main", cursor: "pointer" }}
          onClick={() => setShowForgotPassword(false)}
        >
          Back to Login
        </Typography>
      )}

      {/* {!showForgotPassword && (
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
      )} */}

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          style={{ fontWeight: "bold", cursor: "pointer", color: "#0073e6" }}
        >
          Create one
        </span>
      </Typography>

      {message && (
        <Typography
          variant="body1"
          align="center"
          sx={{ mt: 2, color: message.includes("successful") ? "green" : "error.main" }}
        >
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default Login;
