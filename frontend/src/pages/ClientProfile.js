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
import API from "../services/api";

const ClientProfile = () => {
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

  // Fetch user data on component mount
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

  // Handle input changes for profile fields
  const handleInputChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  // Handle input changes for password fields
  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  // Save changes to the profile
  const handleSaveChanges = async () => {
    try {
      const response = await API.put("/api/user-profile/", {
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

  // Save updated password
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
  
  
  return (
    <Box sx={{ padding: "20px" }}>
      {/* Title with user's first and last name */}
      <Typography variant="h4" gutterBottom>
        Profile, {`${profile.firstName} ${profile.lastName}`}
      </Typography>

      {/* Basic Information Section */}
      <Box sx={{ marginBottom: "20px" }}>
        <Typography variant="h6">Basic Information</Typography>
        <Grid container spacing={2} sx={{ marginTop: "10px" }}>
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
      </Box>

      <Divider />

      {/* Save Changes Button */}
      <Box sx={{ marginTop: "20px" }}>
        <Button variant="contained" color="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Box>

      {/* Change Password Section */}
      <Box sx={{ marginTop: "20px", marginBottom: "20px" }}>
        <Typography variant="h6">Change Password</Typography>
        <Grid container spacing={2} sx={{ marginTop: "10px" }}>
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
            <Button variant="contained" color="primary" onClick={handlePasswordUpdate}>
              Change Password
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Message Section */}
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
  );
};

export default ClientProfile;
