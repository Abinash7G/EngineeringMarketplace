import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  InputAdornment,
} from "@mui/material";
import { Phone, LocationOn, CheckCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import ClientNavbar from "../components/ClientNavbar.js"; // Same directory
import Footer from "../pages/footer.js"; // Pages folder one level up

const ClientProfile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/api/user-profile/");
        const data = response.data;
        setProfile({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          phoneNumber: data.phone_number || "",
          address: data.address || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage("Error fetching profile. Please log in again.");
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      await API.put("/api/user-profile/", {
        first_name: profile.firstName,
        last_name: profile.lastName,
        phone_number: profile.phoneNumber,
        address: profile.address,
      });
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Error updating profile. Please try again.");
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage("New password and confirm password do not match.");
      return;
    }

    try {
      await API.put("/api/change-password/", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setMessage("Password updated successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage("Error updating password. Please try again.");
    }
  };

  const handleNavigateToProfile = () => {
    navigate("/client/profile"); // Already on profile, but included for ClientNavbar
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {console.log("Rendering ClientProfile with ClientNavbar and Footer")}
      <ClientNavbar
        wishlist={[]} // Placeholder: Replace with actual data if available
        cartItems={[]} // Placeholder: Replace with actual data if available
        onNavigateToProfile={handleNavigateToProfile}
      />
      <Box sx={{ flex: 1, mt: 10, px: 3, py: 4 }}>

        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", textAlign: "center", mb: 4 }}>
          Hello, {`${profile.firstName} ${profile.lastName}`.trim() || "User"}
        </Typography>

        <Box sx={{ maxWidth: 800, mx: "auto" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Basic Information
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={profile.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={profile.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                value={profile.email}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <CheckCircle color="success" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={profile.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                InputProps={{
                  endAdornment: <Phone color="primary" />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address (optional)"
                value={profile.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                InputProps={{
                  endAdornment: <LocationOn color="primary" />,
                }}
              />
            </Grid>
          </Grid>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
            sx={{ mb: 4 }}
          >
            Save Changes
          </Button>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" sx={{ mb: 2 }}>
            Change Password
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                value={passwords.currentPassword}
                onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={passwords.newPassword}
                onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePasswordUpdate}
              >
                Change Password
              </Button>
            </Grid>
          </Grid>

          {message && (
            <Typography
              variant="body1"
              align="center"
              sx={{
                mt: 2,
                color: message.includes("successfully") ? "#28a745" : "#d9534f",
              }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default ClientProfile;