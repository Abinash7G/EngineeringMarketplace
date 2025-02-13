import React, { useState, useEffect } from "react";
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
  Alert
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import API from "../services/api";

const CDRentVerificationForm = ({ title }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    documents: [],
  });

  const [verificationStatus, setVerificationStatus] = useState("pending");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await API.get("/api/user-profile/");
        const data = response.data;

        if (data) {
          setFormData((prev) => ({
            ...prev,
            fullName: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            email: data.email || "",
            phone: data.phone_number || "",
          }));
          setIsLoading(false);
          setErrorMessage("");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setErrorMessage("Error loading profile. Please try again.");
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validExtensions = ["image/jpeg", "image/png", "image/jpg"];
    const filteredFiles = files.filter(file => validExtensions.includes(file.type));

    if (filteredFiles.length === 0) {
      setErrorMessage("Only image files (JPG, JPEG, PNG) are allowed.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...filteredFiles],
    }));
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.documents.length === 0) {
      setErrorMessage("Please upload at least one image before submitting.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("full_name", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", formData.address);

      formData.documents.forEach((file) => {
        formDataToSend.append("images", file);
      });

      await API.post("/api/rent-verification/", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setVerificationStatus("pending");
      setErrorMessage("");
      alert("Verification request submitted! ✅ Admin will review it.");
    } catch (error) {
      console.error("Error submitting verification request:", error);
      setErrorMessage("Submission failed. Please try again.");
    }
  };

  const renderForm = () => (
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
            disabled
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
            disabled
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
            disabled
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Detail Address"
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
          <InputLabel sx={{ fontWeight: "bold", marginBottom: "5px" }}>
            Upload Images (Required)
          </InputLabel>
          <Button
            variant="contained"
            component="label"
            color="primary"
            startIcon={<UploadFileIcon />}
            fullWidth
          >
            Choose Files
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept=".jpg, .jpeg, .png"
              multiple
            />
          </Button>
          <Box sx={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
            {formData.documents.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                width={80}
                height={80}
                style={{ marginRight: "10px", borderRadius: "5px" }}
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="success" fullWidth>
            Submit for Verification
          </Button>
        </Grid>
      </Grid>
    </form>
  );

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: "25px", marginTop: "30px", borderRadius: "10px" }}>
        <Typography variant="h5" sx={{ marginBottom: "20px", textAlign: "center", fontWeight: "bold" }}>
          {title || "User Verification"}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "15px" }}>
          <Avatar
            sx={{
              bgcolor: verificationStatus === "verified" ? "success.main" : verificationStatus === "failed" ? "error.main" : "warning.main",
              width: 55,
              height: 55
            }}
          >
            {verificationStatus === "verified" ? (
              <CheckCircleIcon sx={{ fontSize: 32 }} />
            ) : verificationStatus === "failed" ? (
              <ErrorOutlineIcon sx={{ fontSize: 32 }} />
            ) : (
              <HourglassEmptyIcon sx={{ fontSize: 32 }} />
            )}
          </Avatar>
          <Typography variant="body1" sx={{ marginLeft: "10px", fontWeight: "bold" }}>
            {verificationStatus === "verified"
              ? "Profile Verified ✔"
              : verificationStatus === "failed"
              ? "Verification Failed ❌"
              : "Verification Pending ⏳"}
          </Typography>
        </Box>

        {errorMessage && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {isLoading ? (
          <Typography align="center">Loading profile data...</Typography>
        ) : (
          renderForm()
        )}
      </Paper>
    </Container>
  );
};

export default CDRentVerificationForm;