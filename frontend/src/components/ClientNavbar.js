import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Menu as MenuIcon, Search, Favorite, ShoppingCart, AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import ClientSidebar from "./ClientSidebar"; // Import Sidebar

const ClientNavbar = ({ wishlist, onNavigateToProfile }) => {
  const navigate = useNavigate();
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar open state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/api/user-profile/");
        setFirstName(response.data.first_name || "Guest");
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchData();
    updateCartCount();

    window.addEventListener("storage", updateCartCount);
    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const updateCartCount = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCartCount(cartItems.length);
  };

  const handleWishlistClick = () => navigate("/client/wishlist");
  const handleCartClick = () => navigate("/client/cart");
  const handleProfileClick = (event) => setProfileAnchor(event.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);
  const handleLogout = () => navigate("/");
  
  // ✅ Toggle Sidebar Function
  const handleSidebarToggle = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <>
      <AppBar position="fixed" color="primary" sx={{ padding: "5px 20px" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          
          {/* Sidebar Toggle */}
          <IconButton color="inherit" onClick={handleSidebarToggle}>
            <MenuIcon sx={{ fontSize: 28 }} />
          </IconButton>

          {/* Welcome Text */}
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "left", fontSize: "18px" }}>
            Welcome, {firstName}
          </Typography>

          {/* Search Bar */}
          <TextField
            placeholder="Search products..."
            variant="outlined"
            size="small"
            sx={{
              backgroundColor: "white",
              borderRadius: "8px",
              width: "230px",
              marginRight: "10px",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "gray" }} />
                </InputAdornment>
              ),
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Navbar Icons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <IconButton onClick={handleWishlistClick}>
              <Badge badgeContent={wishlist.length} color="secondary">
                <Favorite sx={{ fontSize: 24 }} />
              </Badge>
            </IconButton>
            <IconButton onClick={handleCartClick}>
              <Badge badgeContent={cartCount} color="secondary">
                <ShoppingCart sx={{ fontSize: 24 }} />
              </Badge>
            </IconButton>
            <IconButton onClick={handleProfileClick}>
              <AccountCircle sx={{ fontSize: 26 }} />
            </IconButton>

            {/* Profile Dropdown Menu */}
            <Menu anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={handleProfileClose}>
              <MenuItem onClick={onNavigateToProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ✅ Sidebar Component (Controlled with State) */}
      <ClientSidebar open={sidebarOpen} onClose={handleSidebarClose} />
    </>
  );
};

export default ClientNavbar;
