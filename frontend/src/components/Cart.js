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
import API, { fetchCartItems } from "../services/api";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const response = await fetchCartItems();
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    loadCartItems();
  }, []);

  const handleIncrement = async (id) => {
    try {
      await API.post('/api/cart/add/', {
        product_id: id,
        quantity: 1,
      });
      const response = await fetchCartItems();
      setCartItems(response.data);
    } catch (error) {
      console.error("Error incrementing item:", error);
    }
  };

  const handleDecrement = async (id) => {
    const item = cartItems.find((item) => item.product_id === id);
    if (item.quantity > 1) {
      try {
        await API.post('/api/cart/add/', {
          product_id: id,
          quantity: -1,
        });
        const response = await fetchCartItems();
        setCartItems(response.data);
      } catch (error) {
        console.error("Error decrementing item:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/cart/remove/${id}/`);
      const response = await fetchCartItems();
      setCartItems(response.data);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleCheckout = async () => {
    console.log("Proceeding to checkout with items:", cartItems);
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + parseFloat(item.price) * item.quantity,
    0
  );

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
          <Typography variant="h6" sx={{ textAlign: "center", my: 4 }}>
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
                  <TableRow key={item.product_id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img
                          src={item.image ? `http://127.0.0.1:8000${item.image}` : "/api/placeholder/50/50"}
                          alt={item.name}
                          style={{ width: "50px", height: "50px", borderRadius: "8px" }}
                        />
                        <Typography>{item.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>Rs. {item.price}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleDecrement(item.product_id)}
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
                          onClick={() => handleIncrement(item.product_id)}
                        >
                          +
                        </Button>
                      </Box>
                    </TableCell>
                    <TableCell>Rs. {parseFloat(item.price) * item.quantity}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDelete(item.product_id)}>
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
