import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Box,
  Paper,
  Button,
} from "@mui/material";
import { Delete, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const navigate = useNavigate();

  const wishlistItems = [
    {
      id: 1,
      name: "Product Split",
      price: "€100.00 €70.00",
      status: "In Stock",
      image: "https://via.placeholder.com/50",
    },
    {
      id: 2,
      name: "Product Grid",
      price: "€250.00",
      status: "In Stock",
      image: "https://via.placeholder.com/50",
    },
    {
      id: 3,
      name: "Product Stacked",
      price: "€135.00",
      status: "In Stock",
      image: "https://via.placeholder.com/50",
    },
  ];

  const handleAddToCart = (item) => {
    console.log(`Added ${item.name} to cart`);
  };

  const handleRemove = (item) => {
    console.log(`Removed ${item.name} from wishlist`);
  };

  const handleGoBack = () => {
    navigate(-1); // Navigates back to the previous page
  };

  return (
    <Box sx={{ padding: "20px" }}>
      {/* Back Arrow Icon */}
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <IconButton onClick={handleGoBack} color="primary">
          <ArrowBack />
        </IconButton>
      </Box>

      {/* Wishlist Table */}
      <Typography variant="h4" gutterBottom>
        My Wishlist
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Actions</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Stock Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wishlistItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <IconButton onClick={() => handleRemove(item)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: "50px", marginRight: "10px" }}
                    />
                    {item.name}
                  </Box>
                </TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Wishlist;
