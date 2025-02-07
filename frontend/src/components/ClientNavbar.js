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
} from "@mui/material";
import { Search, Favorite, ShoppingCart, AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ClientNavbar = ({ username, wishlist, onNavigateToProfile }) => {
  const navigate = useNavigate();
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // Add useEffect to track cart count
  useEffect(() => {
    // Initial cart count
    updateCartCount();

    // Listen for cart updates
    window.addEventListener('storage', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const updateCartCount = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartCount(cartItems.length);
  };

  const handleWishlistClick = () => {
    navigate("/client/wishlist");
  };

  const handleCartClick = () => {
    navigate("/client/cart");
  };

  const handleProfileClick = (event) => setProfileAnchor(event.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <AppBar position="fixed" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Welcome, {username}</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <IconButton>
            <Search />
          </IconButton>
          <IconButton onClick={handleWishlistClick}> 
            <Badge badgeContent={wishlist.length} color="secondary">
              <Favorite />
            </Badge>
          </IconButton>
          <IconButton onClick={handleCartClick}>
            <Badge badgeContent={cartCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
          <IconButton onClick={handleProfileClick}>
            <AccountCircle />
          </IconButton>
          <Menu anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={handleProfileClose}>
            <MenuItem onClick={onNavigateToProfile}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ClientNavbar;