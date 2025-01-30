import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  TextField,
  Paper,
} from "@mui/material";
import { Delete, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  // Replace static useState with useEffect to load cart items from localStorage or global state
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load cart items from localStorage or your preferred storage method
    const loadCartItems = () => {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    };

    loadCartItems();
    
    // Optional: Subscribe to cart updates if using a state management solution
    const handleCartUpdate = (event) => {
      if (event.key === 'cartItems') {
        loadCartItems();
      }
    };
    
    window.addEventListener('storage', handleCartUpdate);
    return () => window.removeEventListener('storage', handleCartUpdate);
  }, []);

  // Calculate Subtotal
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Update quantity and sync with storage
  const updateCartItems = (newItems) => {
    setCartItems(newItems);
    localStorage.setItem('cartItems', JSON.stringify(newItems));
  };

  const handleIncrement = (id) => {
    const newItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCartItems(newItems);
  };

  const handleDecrement = (id) => {
    const newItems = cartItems.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    updateCartItems(newItems);
  };

  const handleDelete = (id) => {
    const newItems = cartItems.filter((item) => item.id !== id);
    updateCartItems(newItems);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Add a function to handle checkout
  const handleCheckout = () => {
    // Implement checkout logic
    console.log('Proceeding to checkout with items:', cartItems);
  };

  return (
    <Box sx={{ padding: "20px", display: "flex", flexDirection: "row", gap: "30px" }}>
      <Box sx={{ marginBottom: "20px" }}>
        <IconButton onClick={handleGoBack} color="primary">
          <ArrowBack />
        </IconButton>
      </Box>

      <Box sx={{ flex: 3 }}>
        <Typography variant="h4" gutterBottom>
          Cart items
        </Typography>
        
        {cartItems.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center', my: 4 }}>
            Your cart is empty
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img
                          src={item.image || `https://via.placeholder.com/50`}
                          alt={item.name}
                          style={{ width: "50px", height: "50px", borderRadius: "8px" }}
                        />
                        <Box>
                          <Typography>{item.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.color}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>Rs. {item.price}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleDecrement(item.id)}
                        >
                          -
                        </Button>
                        <TextField
                          value={item.quantity}
                          size="small"
                          sx={{ width: "50px", textAlign: "center" }}
                          inputProps={{ readOnly: true }}
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleIncrement(item.id)}
                        >
                          +
                        </Button>
                      </Box>
                    </TableCell>
                    <TableCell>Rs. {item.price * item.quantity}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDelete(item.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Box
        sx={{
          flex: 1,
          padding: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <Typography>Subtotal</Typography>
          <Typography>Rs. {subtotal}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <Typography>Shipping</Typography>
          <Typography>Free</Typography>
        </Box>
        <TextField
          placeholder="Add coupon code"
          fullWidth
          size="small"
          sx={{ marginBottom: "10px" }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6">Rs. {subtotal}</Typography>
        </Box>
        <Button 
          variant="contained" 
          color="success" 
          fullWidth 
          onClick={handleCheckout}
          disabled={cartItems.length === 0}
        >
          Checkout
        </Button>
      </Box>
    </Box>
  );
};

export default Cart;