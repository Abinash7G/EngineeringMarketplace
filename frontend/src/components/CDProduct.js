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
  MenuItem as DropdownItem,
  Modal,
  Button,
} from "@mui/material";
import { ShoppingCart, Favorite } from "@mui/icons-material";
import API from "../services/api";

const CDProduct = ({ handleWishlistToggle, handleAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

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
    const sortOption = event.target.value;
    setSortOption(sortOption);

    let sortedProducts = [...products];
    if (sortOption === "priceLowToHigh") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === "priceHighToLow") {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    setProducts(sortedProducts);
  };

  const handleCardClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <Box sx={{ padding: "20px" }}>
      {/* Sorting Dropdown */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Products
        </Typography>
        <Select
          value={sortOption}
          onChange={handleSortChange}
          displayEmpty
          sx={{ minWidth: "150px" }}
        >
          <DropdownItem value="">Sort by</DropdownItem>
          <DropdownItem value="priceLowToHigh">Price: Low to High</DropdownItem>
          <DropdownItem value="priceHighToLow">Price: High to Low</DropdownItem>
        </Select>
      </Box>

      {/* Product Cards */}
      <Grid container spacing={2} justifyContent="center">
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: 3,
                borderRadius: "16px",
                height: "360px",
                position: "relative",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: 5,
                },
              }}
              onClick={() => handleCardClick(product)}
            >
              {/* Badge for Rent/Sale */}
              <Box
                sx={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  backgroundColor:
                    product.category === "renting"
                      ? "rgba(255, 87, 34, 0.9)"
                      : "rgba(34, 150, 243, 0.9)",
                  color: "white",
                  padding: "5px 15px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  zIndex: 1,
                }}
              >
                {product.category === "renting" ? "Rent" : "For Sale"}
              </Box>

              {/* Product Image */}
              <CardMedia
                component="img"
                sx={{
                  height: "150px",
                  objectFit: "contain",
                  backgroundColor: "#f9f9f9",
                }}
                image={
                  product.image.startsWith("http")
                    ? product.image
                    : `http://127.0.0.1:8000/media/${product.image}`
                }
                alt={product.title}
              />

              {/* Product Details */}
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "600" }}>
                  {product.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "gray",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {product.description}
                </Typography>
                {product.category === "selling" ? (
                  <Typography>Price: Rs. {product.price}</Typography>
                ) : (
                  <Typography>Per Day Rent: Rs. {product.per_day_rent}</Typography>
                )}
              </CardContent>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <IconButton
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWishlistToggle(product);
                  }}
                >
                  <Favorite />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  <ShoppingCart />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal for Product Details */}
      <Modal
        open={Boolean(selectedProduct)}
        onClose={handleCloseModal}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            width: "500px",
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: 3,
            padding: "20px",
            textAlign: "center",
          }}
        >
          {selectedProduct && (
            <>
              <Typography variant="h5" sx={{ marginBottom: "20px" }}>
                {selectedProduct.title}
              </Typography>
              <CardMedia
                component="img"
                sx={{
                  height: "200px",
                  objectFit: "contain",
                  marginBottom: "20px",
                }}
                image={
                  selectedProduct.image.startsWith("http")
                    ? selectedProduct.image
                    : `http://127.0.0.1:8000/media/${selectedProduct.image}`
                }
                alt={selectedProduct.title}
              />
              <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                {selectedProduct.description}
              </Typography>
              <Typography variant="body2" sx={{ color: "gray", marginBottom: "10px" }}>
                {selectedProduct.category === "selling"
                  ? `Price: Rs. ${selectedProduct.price}`
                  : `Per Day Rent: Rs. ${selectedProduct.per_day_rent}`}
              </Typography>
              <Button variant="contained" onClick={handleCloseModal}>
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default CDProduct;
