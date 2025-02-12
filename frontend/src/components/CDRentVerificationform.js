import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Grid,
  InputLabel,
  Avatar,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const CDRentVerificationform = ({ title, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    document: null,
  });

  const [verificationStatus, setVerificationStatus] = useState("pending"); // "pending" | "failed" | "verified"
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setErrorMessage("Uploading a license or citizenship is required!");
      return;
    }

    setFormData((prev) => ({ ...prev, document: file }));
    setErrorMessage(""); // Clear error if file is uploaded
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.document) {
      setErrorMessage("Please upload a license or citizenship document before submitting.");
      return;
    }

    // Simulate verification process
    const isVerified = Math.random() > 0.3; // 70% chance of success
    if (isVerified) {
      setVerificationStatus("verified");
      alert("Profile verified successfully! ✅");
      onSubmit(formData);
    } else {
      setVerificationStatus("failed");
      setErrorMessage("Verification failed. Please upload a valid document and try again.");
    }
  };

  const handleRetry = () => {
    setVerificationStatus("pending");
    setErrorMessage("");
    setFormData((prev) => ({ ...prev, document: null })); // Clear the file input
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: "20px", marginTop: "30px", borderRadius: "10px" }}>
        <Typography variant="h5" sx={{ marginBottom: "15px", textAlign: "center" }}>
          {title || "User Verification"}
        </Typography>

        {/* Profile Verification Status */}
        <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          {verificationStatus === "verified" ? (
            <Avatar sx={{ bgcolor: "green", width: 50, height: 50 }}>
              <CheckCircleIcon />
            </Avatar>
          ) : verificationStatus === "failed" ? (
            <Avatar sx={{ bgcolor: "red", width: 50, height: 50 }}>
              <ErrorOutlineIcon />
            </Avatar>
          ) : (
            <Typography variant="body1" color="text.secondary">
              Profile Verification: Pending
            </Typography>
          )}
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                name="fullName"
                variant="outlined"
                fullWidth
                required
                value={formData.fullName}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                name="phone"
                type="tel"
                variant="outlined"
                fullWidth
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                variant="outlined"
                fullWidth
                required
                multiline
                rows={2}
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <InputLabel>Upload License or Citizenship (Required)</InputLabel>
              <input type="file" onChange={handleFileChange} accept=".jpg, .jpeg, .png, .pdf" />
              {errorMessage && (
                <Typography color="error" sx={{ marginTop: "5px" }}>
                  {errorMessage}
                </Typography>
              )}
            </Grid>

            <Grid item xs={6}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Submit
              </Button>
            </Grid>

            <Grid item xs={6}>
              <Button variant="outlined" color="secondary" fullWidth onClick={handleRetry} disabled={verificationStatus !== "failed"}>
                Retry
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CDRentVerificationform;
