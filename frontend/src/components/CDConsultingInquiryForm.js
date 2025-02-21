import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
} from "@mui/material";

const CDConsultingInquiryForm = () => {
  // State for form data
  const [formData, setFormData] = useState({
    fullName: "",
    location: "",
    email: "",
    phoneNumber: "",
    category: "",
    subService: "",
    floorRequirements: "",
    floorDetails: "",
    blueprint: null,
    lalpurja: null,
    landTaxPaper: null,
  });

  // Categories and Sub-Services
  const services = {
    "Engineering Consulting": [
      "Structural Engineering",
      "Geotechnical Analysis",
      "Civil Design and Planning",
      "Environmental Impact Assessment",
    ],
    // Add more categories and sub-services as needed
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file uploads
  const handleFileUpload = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    // Simulate appointment scheduling
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + 1); // Appointment after one day

    console.log(
      `Appointment Scheduled for: ${appointmentDate.toLocaleDateString()}`
    );
    console.log(
      `Notification sent to ${formData.phoneNumber} and ${formData.email}`
    );

    // Reset form after submission
    setFormData({
      fullName: "",
      location: "",
      email: "",
      phoneNumber: "",
      category: "",
      subService: "",
      floorRequirements: "",
      floorDetails: "",
      blueprint: null,
      lalpurja: null,
      landTaxPaper: null,
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Consulting Inquiry Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Full Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Full Name"
              fullWidth
              margin="normal"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              variant="outlined"
            />
          </Grid>

          {/* Location */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Location"
              fullWidth
              margin="normal"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              variant="outlined"
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              variant="outlined"
            />
          </Grid>

          {/* Phone Number */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              fullWidth
              margin="normal"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              variant="outlined"
            />
          </Grid>

          {/* Category Dropdown */}
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel id="category-label" shrink={formData.category ? true : false}>
                Category
              </InputLabel>
              <Select
                label="category-label"
                fullWidth
                multiline
                rows={3}
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                variant="outlined"
              >
                <MenuItem value="" disabled>
                  Select a Category
                </MenuItem>
                {Object.keys(services).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Sub-Service Dropdown */}
          <Grid item xs={12}>
          <FormControl fullWidth required disabled={!formData.category} variant="outlined">
            <InputLabel id="sub-service-label" shrink={formData.subService ? true : false}>
                Sub-Service
              </InputLabel>
              <Select
                label="sub-service-label"
                fullWidth
                multiline
                rows={3}
                name="subService"
                value={formData.subService}
                onChange={handleInputChange}
                required
                variant="outlined"
              >
                <MenuItem value="" disabled>
                  Select a Sub-Service
                </MenuItem>
                {formData.category &&
                  services[formData.category].map((subService) => (
                    <MenuItem key={subService} value={subService}>
                      {subService}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Floor-wise Requirements */}
          <Grid item xs={12}>
            <TextField
              label="Floor-wise Requirements"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              name="floorRequirements"
              value={formData.floorRequirements}
              onChange={handleInputChange}
              required
              variant="outlined"
            />
          </Grid>

          {/* Floor Details */}
          <Grid item xs={12}>
            <TextField
              label="Floor Details"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              name="floorDetails"
              value={formData.floorDetails}
              onChange={handleInputChange}
              required
              variant="outlined"
            />
          </Grid>

          {/* Blueprint Upload */}
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ mt: 1, mb: 1 }}>
              Upload Blueprint (PDF or Image)
            </Typography>
            <input
              type="file"
              name="blueprint"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              required
            />
          </Grid>

          {/* Lalpurja Upload */}
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ mt: 1, mb: 1 }}>
              Upload Lalpurja Photocopy (PDF or Image)
            </Typography>
            <input
              type="file"
              name="lalpurja"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              required
            />
          </Grid>

          {/* Land Tax Paper Upload */}
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ mt: 1, mb: 1 }}>
              Upload Land Tax Paper (PDF or Image)
            </Typography>
            <input
              type="file"
              name="landTaxPaper"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              required
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit Inquiry
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default CDConsultingInquiryForm;