import React from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaTools, FaChartBar, FaCog, FaSignOutAlt } from "react-icons/fa";
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button } from "@mui/material";

const Sidebar = () => {
  const handleLogout = () => {
    alert("You have been logged out!");
    // Add actual logout logic here (e.g., clearing tokens, redirecting, etc.)
  };

  return (
    <Box
      sx={{
        width: "250px", // Sidebar width
        backgroundColor: "#007bff", // Sidebar background color
        color: "white", // Sidebar text color
        height: "100vh", // Sidebar stretches to full viewport height
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // Align logo/menu and logout button
        position: "sticky", // Sidebar stays fixed during scroll
        top: 0, // Position the sticky sidebar at the top
      }}
    >
      {/* Logo and Menu */}
      <Box>
        <Typography
          variant="h5"
          component="h2"
          sx={{ marginBottom: "20px", fontWeight: "bold", color: "white", textAlign: "center" }}
        >
          Admin
        </Typography>

        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/admin/dashboard">
              <ListItemIcon sx={{ color: "white" }}>
                <FaChartBar />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/admin/users">
              <ListItemIcon sx={{ color: "white" }}>
                <FaUsers />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/admin/services">
              <ListItemIcon sx={{ color: "white" }}>
                <FaTools />
              </ListItemIcon>
              <ListItemText primary="Services" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/admin/settings">
              <ListItemIcon sx={{ color: "white" }}>
                <FaCog />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Logout Button */}
      <Box>
        <Button
          variant="contained"
          color="error"
          startIcon={<FaSignOutAlt />}
          onClick={handleLogout}
          sx={{
            width: "90%",
            margin: "10px auto",
            backgroundColor: "#dc3545",
            "&:hover": { backgroundColor: "#c82333" },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
