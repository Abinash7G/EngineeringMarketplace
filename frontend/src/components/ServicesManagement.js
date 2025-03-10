import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const ServicesManagement = () => {
  const [services, setServices] = useState([]); // Store services from backend
  const [categories, setCategories] = useState([]); // Store service categories from backend
  const [subServices, setSubServices] = useState([]); // Store sub-services based on selected category
  const [open, setOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null); // Track service ID being edited
  const [newService, setNewService] = useState({
    category: "",
    serviceId: "", // Store service_id (ID of the sub-service) from ersathi_service
    price: "",
    status: "Available",
  });
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [error, setError] = useState(null); // Error state for UI feedback

  // Helper function to check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds
      return decoded.exp < currentTime;
    } catch (error) {
      return true; // Treat as expired if decoding fails
    }
  };

  // Fetch categories and services from backend with token validation
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories and their sub-services (no auth required)
        const categoriesResponse = await axios.get("http://127.0.0.1:8000/api/services/");
        setCategories(categoriesResponse.data);

        // Fetch all services added by the company with token handling
        let accessToken = localStorage.getItem("access_token");
        if (!accessToken || isTokenExpired(accessToken)) {
          await handleAuthError(null, true); // Force token refresh if expired or missing
          accessToken = localStorage.getItem("access_token"); // Get new token
          if (!accessToken) {
            setError("No valid authentication token found. Please log in again.");
            return;
          }
        }

        const servicesResponse = await axios.get("http://127.0.0.1:8000/api/company-services/get/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setServices(servicesResponse.data);
      } catch (err) {
        await handleAuthError(err, true); // Pass true to indicate initial fetch
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle authentication errors, including initial fetch
  const handleAuthError = async (err, isInitialFetch = false) => {
    if (err?.response?.status === 401 || !err) {
      setError("Unauthorized access. Please log in again.");
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const refreshResponse = await axios.post("http://127.0.0.1:8000/api/token/refresh/", { refresh: refreshToken });
          const newAccessToken = refreshResponse.data.access;
          if (newAccessToken) {
            localStorage.setItem("access_token", newAccessToken);
            if (isInitialFetch) {
              const servicesResponse = await axios.get("http://127.0.0.1:8000/api/company-services/get/", {
                headers: { Authorization: `Bearer ${newAccessToken}` },
              });
              setServices(servicesResponse.data);
            }
            setError(null); // Clear error on successful refresh
          } else {
            throw new Error("Invalid access token received");
          }
        } catch (refreshErr) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login"; // Redirect to login if no refresh token
        }
      } else {
        setError("No refresh token available. Please log in again.");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login"; // Redirect to login if no refresh token
      }
    } else {
      setError("Failed to fetch services or categories. Please try again.");
    }
  };

  // Handle category selection & load sub-services
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setNewService({ ...newService, category: selectedCategory, serviceId: "" });
    setError(null); // Clear error on change

    const categoryData = categories.find((cat) => cat.category === selectedCategory);
    if (categoryData) {
      setSubServices(categoryData.services);
    } else {
      setSubServices([]);
    }
  };

  // Handle sub-service selection (now using service_id instead of name)
  const handleSubServiceChange = (e) => {
    const selectedServiceName = e.target.value;
    setNewService({ ...newService, serviceId: "" }); // Reset temporarily
    setError(null); // Clear error on change

    const selectedService = subServices.find((s) => s.name === selectedServiceName);
    if (selectedService) {
      setNewService((prev) => ({
        ...prev,
        serviceId: selectedService.id, // Store the ID for API calls
      }));
    }
  };

  // Open & close modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setEditingServiceId(null);
    setNewService({ category: "", serviceId: "", price: "", status: "Available" });
    setError(null); // Clear error on close
    setOpen(false);
  };

  // Validate form data
  const validateForm = () => {
    if (!newService.category) {
      setError("Please select a service category.");
      console.log("Validation failed: Category is missing.");
      return false;
    }
    if (!newService.serviceId) {
      setError("Please select a sub-service.");
      console.log("Validation failed: Sub-service is missing.");
      return false;
    }
    const priceStr = newService.price.replace("Rs.", "").trim();
    const priceValue = parseFloat(priceStr) || 0;
    if (isNaN(priceValue) || priceValue <= 0) {
      setError("Please enter a valid positive price in Nepali Rupees (Rs.).");
      console.log("Validation failed: Invalid price.");
      return false;
    }
    console.log("Form validation passed.");
    return true;
  };

  // Add or Update Service
  const handleSaveService = async () => {
    if (!validateForm()) return;
  
    setLoading(true);
    let serviceData;
    try {
      const priceStr = newService.price.replace("Rs.", "").trim();
      const priceValue = parseFloat(priceStr) || 0;
      serviceData = {
        service_id: newService.serviceId,
        price: priceValue,
        status: newService.status,
      };
  
      let accessToken = localStorage.getItem("access_token");
      if (!accessToken || isTokenExpired(accessToken)) {
        await handleAuthError(null);
        accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          setError("No valid authentication token found. Please log in again.");
          return;
        }
      }
  
      if (editingServiceId) {
        // Update existing service
        console.log("Updating service with data:", serviceData);
        await axios.put(`http://127.0.0.1:8000/api/company-services/${editingServiceId}/update/`, serviceData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setServices(
          services.map((service) =>
            service.id === editingServiceId
              ? {
                  ...service,
                  ...serviceData,
                  sub_service: subServices.find((s) => s.id === serviceData.service_id)?.name || service.sub_service,
                  category: categories.find((c) => c.services.some((s) => s.id === serviceData.service_id))?.category || service.category,
                }
              : service
          )
        );
      } else {
        // Add new service
        console.log("Adding new service with data:", serviceData);
        const response = await axios.post("http://127.0.0.1:8000/api/company-services/create/", serviceData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setServices([
          ...services,
          {
            ...response.data,
            sub_service: subServices.find((s) => s.id === response.data.service_id)?.name || response.data.sub_service,
            category: categories.find((c) => c.services.some((s) => s.id === response.data.service_id))?.category || response.data.category,
          },
        ]);
      }
      setError("Service saved successfully!");
    } catch (err) {
      console.error("Error saving service:", err);
      await handleAuthError(err);
      setError("Failed to save service. Please check logs or try again.");
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  // Edit Service
  const handleEditService = (serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    if (service) {
      setEditingServiceId(serviceId);
      setNewService({
        category: service.category,
        serviceId: service.service_id, // Use the service_id from the backend
        price: `Rs.${service.price.toFixed(2)}`, // Format with Rs.
        status: service.status,
      });
      // Find the category to load sub-services for editing
      const categoryData = categories.find((cat) => cat.category === service.category);
      setSubServices(categoryData ? categoryData.services : []);
      handleOpen();
    }
  };

  // Delete Service
  const handleDeleteService = async (serviceId) => {
    setLoading(true);
    try {
      let accessToken = localStorage.getItem("access_token");
      if (!accessToken || isTokenExpired(accessToken)) {
        await handleAuthError(null);
        accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          setError("No valid authentication token found. Please log in again.");
          return;
        }
      }

      await axios.delete(`http://127.0.0.1:8000/api/company-services/${serviceId}/delete/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setServices(services.filter((service) => service.id !== serviceId));
      setError("Service deleted successfully!");
    } catch (err) {
      await handleAuthError(err);
      setError("Failed to delete service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#333" }}>
        Manage Services
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert
          severity={error.includes("successfully") ? "success" : "error"}
          sx={{ mb: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{
          mb: 2,
          backgroundColor: "#2196f3",
          "&:hover": { backgroundColor: "#1976d2" },
          textTransform: "uppercase",
        }}
      >
        Add New Service
      </Button>

      <TableContainer component={Paper} sx={{ boxShadow: 1, borderRadius: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Service Category</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Sub-Service</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.category}</TableCell>
                <TableCell>{service.sub_service}</TableCell>
                <TableCell>Rs.{parseFloat(service.price).toFixed(2) || "0.00"}</TableCell>
                <TableCell>{service.status}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditService(service.id)}
                    sx={{ color: "#2196f3" }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteService(service.id)}
                    sx={{ color: "#D500F9" }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: "#f5f5f5" }}>
          {editingServiceId ? "Edit Service" : "Add New Service"}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Service Category</InputLabel>
            <Select
              value={newService.category}
              onChange={handleCategoryChange}
              label="Service Category"
              error={!!error && error.includes("category")}
            >
              {categories.map((category) => (
                <MenuItem key={category.category} value={category.category}>
                  {category.category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Sub-Service</InputLabel>
            <Select
              value={subServices.find((s) => s.id === newService.serviceId)?.name || ""}
              onChange={handleSubServiceChange}
              disabled={!newService.category}
              label="Sub-Service"
              error={!!error && error.includes("sub-service")}
            >
              {subServices.map((subService) => (
                <MenuItem key={subService.id} value={subService.name}>
                  {subService.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Price"
            fullWidth
            sx={{ mt: 2 }}
            value={newService.price}
            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
            InputProps={{
              startAdornment: "Rs.",
            }}
            error={!!error && error.includes("price")}
            helperText={error && error.includes("price") ? error : ""}
          />

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newService.status}
              onChange={(e) => setNewService({ ...newService, status: e.target.value })}
              label="Status"
            >
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Unavailable">Unavailable</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#f5f5f5" }}>
          <Button onClick={handleClose} sx={{ color: "#D500F9" }}>
            Cancel
          </Button>
          <Button onClick={handleSaveService} sx={{ color: "#D500F9" }}>
            {editingServiceId ? "Update" : "ADD"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ServicesManagement;