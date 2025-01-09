import React, { useState, useEffect } from "react";
import API from "../services/api";
import {
  Container,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";

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
        const response = await API.get("/api/services/"); // Replace with your actual API endpoint
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

    if (!formData.companyType || !formData.companyName || !formData.companyEmail) {
      setMessage("Please fill out all required fields.");
      return;
    }

    try {
      const response = await API.post("/api/signup/", formData); // Replace with your actual API endpoint
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
        Company Registration
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* Company Type */}
        <FormControl fullWidth variant="outlined" required>
  <InputLabel>Company Type</InputLabel>
  <Select
    name="companyType"
    value={formData.companyType}
    onChange={handleChange}
    label="Company Type"
  >
    <MenuItem value="">
      <em>Select Company Type</em>
    </MenuItem>
    <MenuItem value="construction">Construction Company</MenuItem>
    <MenuItem value="supplier">Material Supplier</MenuItem>
  </Select>
</FormControl>


        {/* Company Name */}
        <TextField
          label="Company Name"
          name="companyName"
          variant="outlined"
          value={formData.companyName}
          onChange={handleChange}
          fullWidth
          required
        />

        {/* Company Email */}
        <TextField
          label="Company Email"
          name="companyEmail"
          type="email"
          variant="outlined"
          value={formData.companyEmail}
          onChange={handleChange}
          fullWidth
          required
        />

        {/* Company Registration ID */}
        <TextField
          label="Company Registration ID"
          name="companyRegistrationId"
          variant="outlined"
          value={formData.companyRegistrationId}
          onChange={handleChange}
          fullWidth
          required
        />

        {/* Location */}
        <TextField
          label="Location"
          name="location"
          variant="outlined"
          value={formData.location}
          onChange={handleChange}
          fullWidth
          required
        />

        {/* List of Services (only for Construction Companies) */}
        {formData.companyType === "construction" && (
          <Box>
            <Typography variant="subtitle1">List of Services:</Typography>
            {servicesOptions.map((service) => (
              <FormControlLabel
                key={service.id}
                control={
                  <Checkbox
                    name="servicesProvided"
                    value={service.id}
                    checked={formData.servicesProvided.includes(service.id)}
                    onChange={handleChange}
                  />
                }
                label={service.name}
              />
            ))}
          </Box>
        )}

        {/* Register Button */}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>
      </Box>

      {/* Message */}
      {message && (
        <Typography
          variant="body1"
          align="center"
          sx={{ mt: 2, color: message.includes("successful") ? "#28a745" : "#d9534f" }}
        >
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default CompanyRegistration;
