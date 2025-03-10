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
  Tabs,
  Tab,
} from "@mui/material";
import { ShoppingCart, Favorite } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const CDProduct = ({ handleWishlistToggle, handleAddToCart, wishlistItems = [] }) => {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [tabValue, setTabValue] = useState("all"); // Add tab state
  const [verificationStatus, setVerificationStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/api/products/");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchVerificationStatus = async () => {
      try {
        const response = await API.get("/api/rent-verification/user/");
        setVerificationStatus(response.data.status);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setVerificationStatus("not_found");
        } else {
          console.error("Error fetching verification status:", error);
        }
      }
    };

    fetchProducts();
    fetchVerificationStatus();
  }, []);

  const categoryLabels = {
    renting: "Rent",
    selling: "Buy",
  };

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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredProducts = products.filter((product) => {
    if (tabValue === "all") return true;
    return product.category === tabValue;
  });

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const handleAddToCartWithVerification = (product) => {
    if (product.category === "renting" && verificationStatus !== "verified") {
      alert("You need to verify your profile to rent items.");
      navigate("/upload-kyc");
      return;
    }
    handleAddToCart(product);
  };

  return (
    <Box sx={{ padding: "40px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main" }}>
          Products
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="All" value="all" />
            <Tab label="Rent" value="renting" />
            <Tab label="Buy" value="selling" />
          </Tabs>
          <Select
            value={sortOption}
            onChange={handleSortChange}
            displayEmpty
            sx={{ minWidth: "150px", backgroundColor: "background.paper" }}
          >
            <MenuItem value="">Sort by</MenuItem>
            <MenuItem value="priceLowToHigh">Price: Low to High</MenuItem>
            <MenuItem value="priceHighToLow">Price: High to Low</MenuItem>
          </Select>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                borderRadius: "12px",
                boxShadow: 3,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 6,
                },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  backgroundColor: product.category === "renting" ? "error.main" : "primary.main",
                  color: "white",
                  padding: "6px 12px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  borderRadius: "0 0 12px 0",
                }}
              >
                {categoryLabels[product.category] || "Unknown"}
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
                    "&:hover": { backgroundColor: "grey.100" },
                  }}
                >
                  <Favorite color={isInWishlist(product.id) ? "error" : "action"} />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCartWithVerification(product);
                  }}
                  sx={{
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "grey.100" },
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
                sx={{ objectFit: "contain", borderBottom: "1px solid grey.300" }}
              />

              <CardContent sx={{ flexGrow: 1, padding: "16px" }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 1 }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                  Rs. {product.price}
                </Typography>
                {product.category === "renting" && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Per Day Rent: Rs. {product.per_day_rent}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
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