import React, { useState } from "react";
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

const ClientNavbar = ({ username, wishlist, cart, onNavigateToProfile }) => {
  const navigate = useNavigate();
  const [profileAnchor, setProfileAnchor] = useState(null);

  const handleWishlistClick = () => {
    navigate("/client/wishlist"); // Redirect to Wishlist page
  };

  const handleCartClick = () => {
    navigate("/client/cart"); // Redirect to Cart page
  };

  const handleProfileClick = (event) => setProfileAnchor(event.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);

  const handleLogout = () => {
    navigate("/"); // Redirect to home
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
            <Badge badgeContent={cart.length} color="secondary">
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
