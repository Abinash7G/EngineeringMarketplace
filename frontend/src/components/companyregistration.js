import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Link,
} from "@mui/material";

const CompanyRegistration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyType: "",
    companyName: "",
    companyEmail: "",
    companyRegistrationId: "",
    location: "",
    servicesProvided: [], // Ensure it's an empty array initially
  });

  const [servicesOptions, setServicesOptions] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch services from backend when "Construction Company" is selected
  useEffect(() => {
    const fetchServices = async () => {
      if (formData.companyType === "construction") {
        // Fetch services only for Construction Company
        try {
          const response = await API.get("/api/services/");
          if (response.status === 200) {
            setServicesOptions(response.data); // Update state with fetched services
          } else {
            setServicesOptions([]); // Reset state if no services are available
          }
        } catch (error) {
          console.error("Error fetching services:", error);
          setServicesOptions([]); // Reset state on error
        }
      } else {
        setServicesOptions([]); // Clear services for non-construction companies
      }
    };

    fetchServices();
  }, [formData.companyType]); // Dependency on companyType

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      const serviceId = parseInt(value, 10); // Ensure value is parsed as an integer
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

    // Map frontend keys to backend keys
    const payload = {
      company_type: formData.companyType,
      company_name: formData.companyName,
      company_email: formData.companyEmail,
      company_registration_id: formData.companyRegistrationId,
      location: formData.location,
      services_provided: formData.servicesProvided, // Adjusted for snake_case
    };

    if (!payload.company_type || !payload.company_name || !payload.company_email) {
      setMessage("Please fill out all required fields.");
      return;
    }

    try {
      const response = await API.post("/company-registration/", payload); // Updated payload
      setMessage(response.data.message || "Registration successful!");
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Backend Error:", error.response.data); // Log backend error for debugging
        setMessage(error.response.data.error || "An error occurred.");
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
            {servicesOptions.length > 0 ? (
              servicesOptions.map((service) => (
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
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No services available.
              </Typography>
            )}
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

export default CompanyRegistration;
