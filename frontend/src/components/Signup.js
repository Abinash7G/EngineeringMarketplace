import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { TextField, Button, Typography, Box, Container, Link } from "@mui/material";

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "Client",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await API.post("api/signup/", formData);
      setMessage(response.data.message);
      setFormData({
        username: "",
        email: "",
        password: "",
        phoneNumber: "",
        role: "User",
      },1000); // Clear form data
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.error);
      } else {
        setMessage("Signup failed. Please try again.");
      }
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 4,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "#f9f9f9",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom sx={{ color: "#0073e6" }}>
        Signup Page 
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
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          variant="outlined"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Contact Number"
          name="contactNumber"
          type="text"
          variant="outlined"
          value={formData.contactNumber}
          onChange={handleChange}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Signup
        </Button>
      </Box>
      {message && (
        <Typography
          variant="body1"
          align="center"
          sx={{ mt: 2, color: message.includes("successful") ? "#28a745" : "#d9534f" }}
        >
          {message}
        </Typography>
      )}
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Already have an account?{' '}
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate("/login")} //navigation to login page
          sx={{ color: "#0073e6", textDecoration: "underline" }}
        >
          Log in
        </Link>
      </Typography>
    </Container>
  );
};

export default SignupPage;
