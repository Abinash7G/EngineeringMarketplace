import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { 
  TextField, Button, Typography, Box, Container, Link, 
  IconButton, InputAdornment 
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const SignupPage = () => {
  const navigate = useNavigate();

  // ✅ Ensure all fields are initialized with an empty string
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "User",
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await API.post("api/signup/", formData);
      setMessage(response.data.message);
      setTimeout(() => {
        setFormData({
          username: "",
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          phoneNumber: "",
          role: "User",
        });
      }, 1000); // Clear form after 1 second
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
          value={formData.username || ""} // ✅ Added fallback
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="First Name"
          name="first_name"
          variant="outlined"
          value={formData.first_name || ""} // ✅ Added fallback
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Last Name"
          name="last_name"
          variant="outlined"
          value={formData.last_name || ""} // ✅ Added fallback
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          variant="outlined"
          value={formData.email || ""} // ✅ Added fallback
          onChange={handleChange}
          fullWidth
          required
        />
        {/* Password Field with Eye Icon */}
        <TextField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          value={formData.password || ""} // ✅ Added fallback
          onChange={handleChange}
          fullWidth
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          type="text"
          variant="outlined"
          value={formData.phoneNumber || ""} // ✅ Added fallback
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
          onClick={() => navigate("/login")}
          sx={{ color: "#0073e6", textDecoration: "underline" }}
        >
          Log in
        </Link>
      </Typography>
    </Container>
  );
};

export default SignupPage;
