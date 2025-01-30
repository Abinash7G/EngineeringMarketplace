import React, { useState, useEffect } from "react";
import ClientNavbar from "../components/ClientNavbar";
import { Box, Typography, Grid, IconButton } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../services/api";
//import API from "../services/api";
import Products from "../components/CDProduct";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Guest");
  const [companies, setCompanies] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setUsername(data.username);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    loadUserProfile();

    setCompanies([
      { id: 1, name: "ABC Construction", location: "Kathmandu", rating: 4.5 },
      { id: 2, name: "XYZ Supplies", location: "Pokhara", rating: 4.0 },
    ]);
  }, []);

  const handleWishlistToggle = (product) => {
    if (wishlist.find((item) => item.id === product.id)) {
      setWishlist(wishlist.filter((item) => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const handleAddToCart = (product) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    // Check if product already exists in cart
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      // If exists, increment quantity
      const updatedItems = cartItems.map(item =>
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    } else {
      // If new item, add to cart with quantity 1
      const newItem = {
        id: product.id,
        name: product.title,
        price: product.category === 'selling' ? product.price : product.per_day_rent,
        quantity: 1,
        image: product.image,
        color: product.color || ''
      };
      localStorage.setItem('cartItems', JSON.stringify([...cartItems, newItem]));
    }
    
    // Trigger storage event for cart component to update
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <Box>
      {/* Render Navbar */}
      <ClientNavbar
        username={username}
        wishlist={wishlist}
        cart={cart}
        onNavigateToProfile={() => navigate("/client/client-profile")}
      />

      {/* Companies Section */}
      <Box sx={{ padding: "20px", marginTop: "80px" }}>
        <Box
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography variant="h5">Companies</Typography>
          <IconButton color="primary">
            <FilterList />
          </IconButton>
        </Box>
        <Grid container spacing={3} sx={{ marginTop: "20px" }}>
          {companies.map((company) => (
            <Grid item xs={12} sm={6} md={4} key={company.id}>
              <Box
                sx={{
                  height: "150px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "16px",
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {company.name}
                </Typography>
                <Typography>{company.location}</Typography>
                <Typography>Rating: {company.rating}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Products Section */}
      <Products
        handleWishlistToggle={handleWishlistToggle}
        handleAddToCart={handleAddToCart}
      />
      
    </Box>
  );
};

export default ClientDashboard;