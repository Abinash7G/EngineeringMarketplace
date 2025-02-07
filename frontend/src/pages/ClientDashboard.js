import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, IconButton, Snackbar, Alert } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ClientNavbar from "../components/ClientNavbar";  // Changed from ./ClientNavbar
import Products from "../components/CDProduct";
import {
  fetchUserProfile,
  fetchCartItems,
  fetchWishlistItems,
  addToCart,
  addToWishlist,
  removeFromWishlist,
} from "../services/api";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Guest");
  const [companies, setCompanies] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Check for authentication
        const token = localStorage.getItem("access_token");
        if (!token) {
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
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate("/login");
        }
      }
    };

    loadInitialData();
    setCompanies([
      { id: 1, name: "ABC Construction", location: "Kathmandu", rating: 4.5 },
      { id: 2, name: "XYZ Supplies", location: "Pokhara", rating: 4.0 },
    ]);
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

      <Box sx={{ padding: "20px", marginTop: "64px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5">Companies</Typography>
          <IconButton color="primary">
            <FilterList />
          </IconButton>
        </Box>

        <Grid container spacing={3} sx={{ marginTop: "20px" }}>
          {companies.map((company) => (
            <Grid item xs={12} sm={6} md={4} key={company.id}>
              <Box sx={{
                height: "150px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                textAlign: "center"
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{company.name}</Typography>
                <Typography>{company.location}</Typography>
                <Typography>Rating: {company.rating}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
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
    </Box>
  );
};

export default ClientDashboard;
