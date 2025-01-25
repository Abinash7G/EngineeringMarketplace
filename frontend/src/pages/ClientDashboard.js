import React, { useState, useEffect } from "react"; 
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  AppBar,
  Toolbar,
  Badge,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Select,
  MenuItem as DropdownItem,
} from "@mui/material";
import {
  Search,
  ShoppingCart,
  AccountCircle,
  FilterList,
  Favorite,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../services/api";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Guest");
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [filters, setFilters] = useState({
    location: [],
    rating: [],
    type: [],
  });

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
    setProducts([
      {
        id: 1,
        name: "Cement Bag",
        description: "High-quality cement for construction",
        price: 600,
        type: "sale",
        image: "/image/cement.jpg",
        company: "XYZ Supplies",
        availability: "In Stock",
      },
      {
        id: 2,
        name: "Theodolite",
        description: "High-precision surveying instrument",
        price: 1500,
        type: "rent",
        image: "/image/totalstation.png",
        company: "ABC Construction",
        availability: "Limited Stock",
      },
    ]);
  }, []);

  const handleFilterClick = (event) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleProfileClick = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleFilterChange = (filterCategory, value) => {
    const updatedFilters = { ...filters };
    if (updatedFilters[filterCategory].includes(value)) {
      updatedFilters[filterCategory] = updatedFilters[filterCategory].filter(
        (item) => item !== value
      );
    } else {
      updatedFilters[filterCategory].push(value);
    }
    setFilters(updatedFilters);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleWishlistToggle = (product) => {
    if (wishlist.find((item) => item.id === product.id)) {
      setWishlist(wishlist.filter((item) => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const handleAddToCart = (product) => {
    if (!cart.find((item) => item.id === product.id)) {
      setCart([...cart, product]);
    }
  };

  const applyFilters = () => {
    handleFilterClose();
  };

  const filteredCompanies = companies.filter(
    (company) =>
      (!filters.location.length || filters.location.includes(company.location)) &&
      (!filters.rating.length || filters.rating.some((r) => company.rating >= parseFloat(r)))
  );

  let filteredProducts = products.filter(
    (product) =>
      (!filters.type.length || filters.type.includes(product.type)) &&
      (!filters.location.length ||
        companies.some(
          (company) =>
            company.name === product.company && filters.location.includes(company.location)
        ))
  );

  if (sortOption === "priceLowToHigh") {
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "priceHighToLow") {
    filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <Box>
      {/* Navbar */}
      <AppBar position="fixed" color="primary">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Welcome, {username}</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <IconButton>
              <Search />
            </IconButton>
            <IconButton>
              <Badge badgeContent={wishlist.length} color="secondary">
                <Favorite />
              </Badge>
            </IconButton>
            <IconButton>
              <Badge badgeContent={cart.length} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
            <IconButton onClick={handleProfileClick}>
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={profileAnchor}
              open={Boolean(profileAnchor)}
              onClose={handleProfileClose}
              PaperProps={{
                style: { width: "150px" },
              }}
            >
              <MenuItem onClick={() => navigate("/client/client-profile")}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Companies Section */}
      <Box sx={{ padding: "20px", marginTop: "80px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5">Companies</Typography>
          <IconButton onClick={handleFilterClick} color="primary">
            <FilterList />
          </IconButton>
        </Box>
        <Grid container spacing={3} sx={{ marginTop: "20px" }}>
          {filteredCompanies.map((company) => (
            <Grid item xs={12} sm={6} md={4} key={company.id}>
              <Card sx={{ height: "250px", boxShadow: 3, borderRadius: "16px" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "600", marginBottom: "8px" }}>
                    {company.name}
                  </Typography>
                  <Typography color="textSecondary">{company.location}</Typography>
                  <Typography>Rating: {company.rating}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Products Section */}
      <Box sx={{ padding: "20px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5">Products</Typography>
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
        <Grid container spacing={3} sx={{ marginTop: "20px" }}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  boxShadow: 3,
                  borderRadius: "16px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: 5,
                  },
                }}
              >
                {product.type === "rent" && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      backgroundColor: "rgba(255, 87, 34, 0.9)",
                      color: "white",
                      padding: "5px 15px",
                      borderRadius: "20px",
                      zIndex: 1,
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    Rent
                  </Box>
                )}
                <CardMedia
                  component="img"
                  sx={{
                    height: "200px",
                    objectFit: "contain",
                    backgroundColor: "#f9f9f9",
                  }}
                  image={product.image}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "600", marginBottom: "8px" }}>
                    {product.name}
                  </Typography>
                  <Typography color="textSecondary">{product.description}</Typography>
                  <Typography>Price: Rs. {product.price}</Typography>
                  <Typography>Company: {product.company}</Typography>
                  <Typography>Availability: {product.availability}</Typography>
                </CardContent>
                <Box
                  sx={{
                    padding: "10px",
                    textAlign: "right",
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <IconButton
                    color="primary"
                    onClick={() => handleWishlistToggle(product)}
                    sx={{
                      backgroundColor: wishlist.find((item) => item.id === product.id)
                        ? "#ffcccb"
                        : "#e3f2fd",
                      borderRadius: "50%",
                      "&:hover": { backgroundColor: "#bbdefb" },
                      padding: "10px",
                    }}
                  >
                    <Favorite />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleAddToCart(product)}
                    sx={{
                      backgroundColor: "#e3f2fd",
                      borderRadius: "50%",
                      "&:hover": { backgroundColor: "#bbdefb" },
                      padding: "10px",
                    }}
                  >
                    <ShoppingCart />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Filters Dropdown */}
      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={handleFilterClose}
        PaperProps={{
          style: { width: "300px", padding: "10px" },
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: "10px" }}>
          Filters
        </Typography>
        <Box>
          <Typography variant="body1" sx={{ marginBottom: "5px" }}>
            Location
          </Typography>
          {["Kathmandu", "Pokhara"].map((location) => (
            <FormControlLabel
              key={location}
              control={
                <Checkbox
                  checked={filters.location.includes(location)}
                  onChange={() => handleFilterChange("location", location)}
                />
              }
              label={location}
            />
          ))}
        </Box>
        <Box>
          <Typography variant="body1" sx={{ marginTop: "10px", marginBottom: "5px" }}>
            Rating
          </Typography>
          {["4.0", "4.5"].map((rating) => (
            <FormControlLabel
              key={rating}
              control={
                <Checkbox
                  checked={filters.rating.includes(rating)}
                  onChange={() => handleFilterChange("rating", rating)}
                />
              }
              label={`${rating}+`}
            />
          ))}
        </Box>
        <Box>
          <Typography variant="body1" sx={{ marginTop: "10px", marginBottom: "5px" }}>
            Type
          </Typography>
          {["sale", "rent"].map((type) => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  checked={filters.type.includes(type)}
                  onChange={() => handleFilterChange("type", type)}
                />
              }
              label={type === "sale" ? "For Sale" : "For Rent"}
            />
          ))}
        </Box>
        <Button variant="contained" color="primary" sx={{ marginTop: "10px" }} onClick={applyFilters}>
          Apply Filters
        </Button>
      </Menu>
    </Box>
  );
};

export default ClientDashboard;