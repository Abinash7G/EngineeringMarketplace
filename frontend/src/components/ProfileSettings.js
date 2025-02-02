import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    companyName: "",
    email: "",
    phoneNumber: "",
    address: "",
    logo: null,
  });

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    showPassword: false,
  });

  useEffect(() => {
    // Simulate fetching data from the backend
    const fetchProfile = async () => {
      const mockProfileData = {
        companyName: "Boy Construction",
        email: "contact@boyconstruction.com",
        phoneNumber: "123-456-7890",
        address: "123 Main St, City, Country",
      };
      setProfile(mockProfileData);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleLogoChange = (e) => {
    setProfile({ ...profile, logo: e.target.files[0] });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword({ ...password, [name]: value });
  };

  const toggleShowPassword = () => {
    setPassword({ ...password, showPassword: !password.showPassword });
  };

  const handleSaveChanges = () => {
    // Simulate saving profile changes
    console.log("Profile saved:", profile);
  };

  const handleChangePassword = () => {
    // Simulate password update
    console.log("Password updated:", password.newPassword);
    setPasswordDialogOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>
      <TextField
        label="Company Name"
        name="companyName"
        fullWidth
        margin="normal"
        value={profile.companyName}
        onChange={handleChange}
      />
      <TextField
        label="Email"
        name="email"
        fullWidth
        margin="normal"
        value={profile.email}
        onChange={handleChange}
      />
      <TextField
        label="Phone Number"
        name="phoneNumber"
        fullWidth
        margin="normal"
        value={profile.phoneNumber}
        onChange={handleChange}
      />
      <TextField
        label="Address"
        name="address"
        fullWidth
        margin="normal"
        value={profile.address}
        onChange={handleChange}
      />
      <Typography variant="body1" gutterBottom>
        Upload Logo:
      </Typography>
      <input type="file" onChange={handleLogoChange} />
      <div style={{ marginTop: "16px" }}>
        {profile.logo && (
          <img
            src={URL.createObjectURL(profile.logo)}
            alt="Logo Preview"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
        )}
      </div>
      <Button
        variant="outlined"
        color="secondary"
        sx={{ mt: 2 }}
        onClick={() => setPasswordDialogOpen(true)}
      >
        Change Password
      </Button>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, ml: 2 }}
        onClick={handleSaveChanges}
      >
        Save Changes
      </Button>

      {/* Change Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Current Password"
            name="currentPassword"
            type={password.showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={password.currentPassword}
            onChange={handlePasswordChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowPassword}>
                    {password.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="New Password"
            name="newPassword"
            type={password.showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={password.newPassword}
            onChange={handlePasswordChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowPassword}>
                    {password.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleChangePassword} color="primary">
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfileSettings;
