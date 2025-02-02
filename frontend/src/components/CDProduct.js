import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material"; // Removed unused imports
import { ShoppingCart, Favorite } from "@mui/icons-material";
import API from "../services/api";

const CDProduct = ({ handleWishlistToggle, handleAddToCart, wishlistItems = [] }) => {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/api/products/");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSortChange = (event) => {
    const option = event.target.value;
    setSortOption(option);

    let sortedProducts = [...products];
    if (option === "priceLowToHigh") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (option === "priceHighToLow") {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    setProducts(sortedProducts);
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h5">Products</Typography>
        <Select
          value={sortOption}
          onChange={handleSortChange}
          displayEmpty
          sx={{ minWidth: "150px" }}
        >
          <MenuItem value="">Sort by</MenuItem>
          <MenuItem value="priceLowToHigh">Price: Low to High</MenuItem>
          <MenuItem value="priceHighToLow">Price: High to Low</MenuItem>
        </Select>
      </Box>

      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              {/* Rent/Sell Label */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  backgroundColor: product.category === "renting" ? "red" : "blue",
                  color: "white",
                  padding: "4px 8px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {product.category === "renting" ? "Rent" : "Sell"}
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  zIndex: 1,
                  display: "flex",
                  gap: "8px",
                }}
              >
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWishlistToggle(product);
                  }}
                  sx={{
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "white" },
                  }}
                >
                  <Favorite color={isInWishlist(product.id) ? "error" : "action"} />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  sx={{
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "white" },
                  }}
                >
                  <ShoppingCart color="primary" />
                </IconButton>
              </Box>

              <CardMedia
                component="img"
                height="200"
                image={
                  product.image
                    ? `http://127.0.0.1:8000${product.image}`
                    : "https://via.placeholder.com/200"
                }
                alt={product.name}
                sx={{ objectFit: "contain" }}
              />

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" colour="primary" sx={{ fontWeight: "bold" }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  Rs. {product.price}
                </Typography>
                {product.category === "renting" && (
                  <Typography variant="body2" color="text.secondary">
                    Per Day Rent: Rs. {product.per_day_rent}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Company: {product.company_name || "N/A"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CDProduct;
