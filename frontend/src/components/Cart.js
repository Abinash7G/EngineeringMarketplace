import React, { useState } from "react";
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
import { Delete } from "@mui/icons-material";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Analog Magazine Rack", color: "Red", price: 120, quantity: 2 },
    { id: 2, name: "Closca Helmet", color: "Black", price: 132, quantity: 1 },
    { id: 3, name: "Sigg Water Bottle", color: "Gravel Black", price: 23, quantity: 2 },
  ]);

  // Calculate Subtotal
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Increment Quantity
  const handleIncrement = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrement Quantity
  const handleDecrement = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Delete Item
  const handleDelete = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <Box sx={{ padding: "20px", display: "flex", flexDirection: "row", gap: "30px" }}>
      {/* Cart Items */}
      <Box sx={{ flex: 3 }}>
        <Typography variant="h4" gutterBottom>
          Cart
        </Typography>
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
                        src={`https://via.placeholder.com/50`} // Replace with actual image URLs
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
      </Box>

      {/* Order Summary */}
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
        <Button variant="contained" color="success" fullWidth>
          Checkout
        </Button>
      </Box>
    </Box>
  );
};

export default Cart;
