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
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import API from "../services/api";
import Footer from "../pages/footer";  // Assuming this is the correct path
import ClientNavbar from "../components/ClientNavbar"; // Import ClientNavbar (adjust path as needed)

const CDRentVerificationForm = ({ title }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    documents: [],
  });
  const BACKEND_URL = "http://127.0.0.1:8000";
  const [verificationStatus, setVerificationStatus] = useState("pending");
  const [verificationId, setVerificationId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        const response = await API.get("/api/rent-verification/user/");
        if (response.data) {
          setVerificationStatus(response.data.status);
          setVerificationId(response.data.id);
          setFormData((prev) => ({
            ...prev,
            fullName: response.data.full_name || "",
            email: response.data.email || "",
            phone: response.data.phone || "",
            address: response.data.address || "",
            documents: response.data.images || [],
          }));
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          const userResponse = await API.get("/api/user-profile/");
          if (userResponse.data) {
            setFormData((prev) => ({
              ...prev,
              fullName: `${userResponse.data.first_name || ""} ${userResponse.data.last_name || ""}`.trim() || userResponse.data.full_name || "",
              email: userResponse.data.email || "",
              phone: userResponse.data.phone_number || "",
            }));
          }
        } else {
          console.error("Error fetching verification status:", error);
          setErrorMessage("Failed to load verification details.");
        }
      }
    };

    fetchVerificationStatus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validExtensions = ["image/jpeg", "image/png", "image/jpg"];
    const filteredFiles = files.filter((file) => validExtensions.includes(file.type));

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

      if (verificationId) {
        formDataToSend.append("address", formData.address);
      } else {
        formDataToSend.append("full_name", formData.fullName);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("phone", formData.phone);
        formDataToSend.append("address", formData.address);
      }

      formData.documents.forEach((file) => {
        formDataToSend.append("images", file);
      });

      if (verificationId) {
        const response = await API.put(
          `/api/rent-verification/user-update/${verificationId}/`,
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setVerificationStatus(response.data.status);
        alert("Verification resubmitted! Status is now pending.");
      } else {
        await API.post("/api/rent-verification/", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setVerificationStatus("pending");
        alert("Verification request submitted! Admin will review it.");
      }

      setErrorMessage("");
    } catch (error) {
      console.error("Submission failed:", error);
      setErrorMessage("Submission failed. Please try again.");
    }
  };

  const isFormEditable = verificationStatus === "pending" || verificationStatus === "rejected";

  // Handler for navigating to profile (passed to ClientNavbar)
  const handleNavigateToProfile = () => {
    // Replace with your actual profile route
    window.location.href = "/client/profile"; // Or use navigate from react-router-dom if available
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Add ClientNavbar at the top */}
      <ClientNavbar
        wishlist={[]} // Placeholder: Replace with actual wishlist data if available
        cartItems={[]} // Placeholder: Replace with actual cart data if available
        onNavigateToProfile={handleNavigateToProfile}
      />

      {/* Main content */}
      <Container maxWidth="sm" sx={{ flex: 1, mt: 8 }}>
        <Paper elevation={3} sx={{ padding: "25px", marginTop: "30px", borderRadius: "10px" }}>
          <Typography variant="h5" sx={{ marginBottom: "20px", textAlign: "center", fontWeight: "bold" }}>
            {title || "User Verification"}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "15px" }}>
            <Avatar
              sx={{
                bgcolor: verificationStatus === "verified" ? "success.main" : verificationStatus === "rejected" ? "error.main" : "warning.main",
                width: 55,
                height: 55,
              }}
            >
              {verificationStatus === "verified" ? (
                <CheckCircleIcon sx={{ fontSize: 32 }} />
              ) : verificationStatus === "rejected" ? (
                <CancelIcon sx={{ fontSize: 32 }} />
              ) : (
                <HourglassEmptyIcon sx={{ fontSize: 32 }} />
              )}
            </Avatar>
            <Typography variant="body1" sx={{ marginLeft: "10px", fontWeight: "bold" }}>
              {verificationStatus === "verified"
                ? "Profile Verified ✔"
                : verificationStatus === "rejected"
                ? "Verification Rejected "
                : "Verification Pending ⏳"}
            </Typography>
          </Box>

          {errorMessage && <Alert severity="error" sx={{ marginBottom: 2 }}>{errorMessage}</Alert>}

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
                  disabled={!isFormEditable}
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
                  disabled={!isFormEditable}
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
              </Grid>

              <Grid item xs={12}>
                <InputLabel sx={{ fontWeight: "bold", marginBottom: "5px" }}>
                  Uploaded Images
                </InputLabel>
                <Box sx={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
                  {formData.documents.length > 0 ? (
                    formData.documents.map((img, index) => (
                      <img
                        key={index}
                        src={img instanceof File ? URL.createObjectURL(img) : `${BACKEND_URL}${img.image}`}
                        alt={`uploaded-${index}`}
                        width={100}
                        height={100}
                        style={{ marginRight: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No images uploaded
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="success" fullWidth disabled={!isFormEditable}>
                  {verificationStatus === "verified" ? "Update Details" : "Submit for Verification"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>

      {/* Footer at the bottom */}
      <Footer />
    </Box>
  );
};

export default CDRentVerificationForm;