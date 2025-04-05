import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Snackbar, Alert } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ClientNavbar from "../components/ClientNavbar";  
import Products from "../components/CDProduct";
import CDCompany from "../components/CDCompany"; 
import Footer from "../pages/footer"; // Import the Footer component

import {
  fetchUserProfile,
  fetchCartItems,
  fetchWishlistItems,
  addToCart,
  addToWishlist,
  removeFromWishlist,
} from "../services/api"; // Removed refreshAccessToken since it's handled by interceptor
import CDBanner from "../components/CDBanner";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Guest");
  
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Check for authentication
        const token = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token"); // Get refresh token
        if (!token || !refreshToken) {
          navigate("/login");
          return;
        }

        // Load user data
        const userData = await fetchUserProfile();
        setUsername(userData.username);

        // Load cart and wishlist
        await loadCartAndWishlist();
      } catch (error) {
        console.error("Error loading initial data:", error);
        // The interceptor will handle 401/403 and refresh token or redirect to login
      }
    };

    loadInitialData();
    
  }, [navigate]);

  const loadCartAndWishlist = async () => {
    try {
      const [cartData, wishlistData] = await Promise.all([
        fetchCartItems(),
        fetchWishlistItems(),
      ]);
      setCartItems(cartData.data); // Update state with cart data
      setWishlistItems(wishlistData.data); // Update state with wishlist data
    } catch (error) {
      console.error("Error loading cart and wishlist:", error);
    }
  };

  const handleWishlistToggle = async (product) => {
    try {
      const isInWishlist = wishlistItems.some(item => item.id === product.id);
      
      if (isInWishlist) {
        await removeFromWishlist(product.id);
        setWishlistItems(prev => prev.filter(item => item.id !== product.id));
        showSnackbar("Removed from wishlist", "info");
      } else {
        await addToWishlist(product.id);
        setWishlistItems(prev => [...prev, product]);
        showSnackbar("Added to wishlist", "success");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      showSnackbar("Failed to update wishlist", "error");
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.id);
      await loadCartAndWishlist(); // Reload cart data
      showSnackbar("Added to cart", "success");
    } catch (error) {
      console.error("Error adding to cart:", error);
      showSnackbar("Failed to add to cart", "error");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box>
      <ClientNavbar
        username={username}
        wishlist={wishlistItems}
        cartItems={cartItems}
        onNavigateToProfile={() => navigate("/client/client-profile")}
      />
      <CDBanner/>
      <Box sx={{ padding: "20px", marginTop: "64px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5">Construction Company</Typography>
          <IconButton color="primary">
            <FilterList />
          </IconButton>
        </Box>
        <CDCompany />
      </Box>
      <Products
        handleWishlistToggle={handleWishlistToggle}
        handleAddToCart={handleAddToCart}
        wishlistItems={wishlistItems}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Footer />

    </Box>
    
  );
};

export default ClientDashboard;

