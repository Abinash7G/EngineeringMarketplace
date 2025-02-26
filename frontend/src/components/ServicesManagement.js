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

const ServicesManagement = () => {
  // State management
  const [services, setServices] = useState([]); // Store services from backend
  const [categories, setCategories] = useState([]); // Store service categories from backend
  const [subServices, setSubServices] = useState([]); // Store sub-services based on selected category
  const [open, setOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null); // Track service ID being edited
  const [newService, setNewService] = useState({
    category: "",
    subService: "", // Single sub-service selection (matching screenshots)
    price: "",
    status: "Available",
  });
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [error, setError] = useState(null); // Error state for UI feedback

  // Fetch categories and services from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories and their sub-services (no auth required)
        const categoriesResponse = await axios.get("http://127.0.0.1:8000/api/services/");
        setCategories(categoriesResponse.data);

        // Fetch all services added by the company
        const accessToken = localStorage.getItem("access_token");
        console.log("Access Token:", accessToken); // Debug: Check if token exists
        if (!accessToken) {
          setError("No authentication token found. Please log in again.");
          return;
        }

        const servicesResponse = await axios.get("http://127.0.0.1:8000/api/company-services/", {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Ensure token is present and formatted correctly
          },
        });
        setServices(servicesResponse.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError("Unauthorized access. Please log in again.");
          // Attempt to refresh token if refresh token exists
          const refreshToken = localStorage.getItem("refresh_token");
          if (refreshToken) {
            try {
              const refreshResponse = await axios.post("http://127.0.0.1:8000/api/token/refresh/", { refresh: refreshToken });
              const newAccessToken = refreshResponse.data.access;
              localStorage.setItem("access_token", newAccessToken);
              // Retry the request with the new token
              const servicesResponse = await axios.get("http://127.0.0.1:8000/api/company-services/", {
                headers: { Authorization: `Bearer ${newAccessToken}` },
              });
              setServices(servicesResponse.data);
              setError(null); // Clear error on successful refresh
            } catch (refreshErr) {
              setError("Session expired. Please log in again.");
              console.error("Error refreshing token:", refreshErr);
            }
          }
        } else {
          setError("Failed to fetch services or categories. Please try again.");
        }
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle category selection & load sub-services
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setNewService({ ...newService, category: selectedCategory, subService: "" });
    setError(null); // Clear error on change

    const categoryData = categories.find(cat => cat.category === selectedCategory);
    if (categoryData) {
      setSubServices(categoryData.services);
    } else {
      setSubServices([]);
    }
  };

  // Handle sub-service selection
  const handleSubServiceChange = (e) => {
    setNewService({ ...newService, subService: e.target.value });
    setError(null); // Clear error on change
  };

  // Open & close modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setEditingServiceId(null);
    setNewService({ category: "", subService: "", price: "", status: "Available" });
    setError(null); // Clear error on close
    setOpen(false);
  };

  // Validate form data
  const validateForm = () => {
    if (!newService.category) {
      setError("Please select a service category.");
      return false;
    }
    if (!newService.subService) {
      setError("Please select a sub-service.");
      return false;
    }
    const priceValue = parseFloat(newService.price.replace('Rs.', '')) || 0;
    if (isNaN(priceValue) || priceValue <= 0) {
      setError("Please enter a valid positive price in Nepali Rupees (Rs.).");
      return false;
    }
    return true;
  };

  // Add or Update Service
  const handleSaveService = async () => {
    if (!validateForm()) return;
  
    setLoading(true);
    let serviceData; // Declare serviceData outside the try block to make it accessible in the catch block
    try {
      const priceValue = parseFloat(newService.price.replace('Rs.', '')) || 0;
      serviceData = {  // Assign value to serviceData
        category: newService.category,
        sub_service: newService.subService,
        price: priceValue,
        status: newService.status
      };
  
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setError("No authentication token found. Please log in again.");
        return;
      }
  
      if (editingServiceId) {
        // Update existing service
        await axios.put(`http://127.0.0.1:8000/api/company-services/${editingServiceId}/`, serviceData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setServices(services.map(service => 
          service.id === editingServiceId ? { ...service, ...serviceData } : service
        ));
      } else {
        // Add new service
        const response = await axios.post("http://127.0.0.1:8000/api/company-services/", serviceData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setServices([...services, response.data]);
      }
      setError("Service saved successfully!");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Unauthorized access. Please log in again.");
        // Attempt to refresh token if refresh token exists
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          try {
            const refreshResponse = await axios.post("http://127.0.0.1:8000/api/token/refresh/", { refresh: refreshToken });
            const newAccessToken = refreshResponse.data.access;
            localStorage.setItem("access_token", newAccessToken);
            // Retry the request with the new token
            if (editingServiceId) {
              await axios.put(`http://127.0.0.1:8000/api/company-services/${editingServiceId}/`, serviceData, {
                headers: { Authorization: `Bearer ${newAccessToken}` },
              });
              setServices(services.map(service => 
                service.id === editingServiceId ? { ...service, ...serviceData } : service
              ));
            } else {
              const response = await axios.post("http://127.0.0.1:8000/api/company-services/", serviceData, {
                headers: { Authorization: `Bearer ${newAccessToken}` },
              });
              setServices([...services, response.data]);
            }
            setError(null); // Clear error on successful refresh
          } catch (refreshErr) {
            setError("Session expired. Please log in again.");
            console.error("Error refreshing token:", refreshErr);
          }
        }
      } else {
        setError("Failed to save service. Please try again.");
      }
      console.error("Error saving service:", err);
    } finally {
      setLoading(false);
      handleClose();
    }
  };
  // Edit Service
  const handleEditService = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setEditingServiceId(serviceId);
      setNewService({
        category: service.category,
        subService: service.sub_service,
        price: `Rs.${service.price.toFixed(2)}`, // Format with Rs.
        status: service.status
      });
      handleOpen();
    }
  };

  // Delete Service
  const handleDeleteService = async (serviceId) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setError("No authentication token found. Please log in again.");
        return;
      }

      await axios.delete(`http://127.0.0.1:8000/api/company-services/${serviceId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setServices(services.filter(service => service.id !== serviceId));
      setError("Service deleted successfully!");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Unauthorized access. Please log in again.");
        // Attempt to refresh token if refresh token exists
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          try {
            const refreshResponse = await axios.post("http://127.0.0.1:8000/api/token/refresh/", { refresh: refreshToken });
            const newAccessToken = refreshResponse.data.access;
            localStorage.setItem("access_token", newAccessToken);
            // Retry the request with the new token
            await axios.delete(`http://127.0.0.1:8000/api/company-services/${serviceId}/`, {
              headers: { Authorization: `Bearer ${newAccessToken}` },
            });
            setServices(services.filter(service => service.id !== serviceId));
            setError(null); // Clear error on successful refresh
          } catch (refreshErr) {
            setError("Session expired. Please log in again.");
            console.error("Error refreshing token:", refreshErr);
          }
        }
      } else {
        setError("Failed to delete service. Please try again.");
      }
      console.error("Error deleting service:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#333' }}>
        Manage Services
      </Typography>

      {/* Display loading indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Display error or success message if exists */}
      {error && (
        <Alert 
          severity={error.includes("successfully") ? "success" : "error"} 
          sx={{ mb: 2 }} 
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Add Service Button */}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleOpen}
        sx={{ 
          mb: 2, 
          backgroundColor: '#2196f3', 
          '&:hover': { backgroundColor: '#1976d2' },
          textTransform: 'uppercase'
        }}
      >
        Add New Service
      </Button>

      {/* Service Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 1, borderRadius: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Service Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Sub-Service</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.category}</TableCell>
                <TableCell>{service.sub_service}</TableCell>
                <TableCell>Rs.{parseFloat(service.price).toFixed(2)}</TableCell>
                <TableCell>{service.status}</TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleEditService(service.id)}
                    sx={{ color: '#2196f3' }} // Blue edit icon
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    color="secondary" 
                    onClick={() => handleDeleteService(service.id)}
                    sx={{ color: '#D500F9' }} // Purple delete icon
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Service Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#f5f5f5' }}>
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
              value={newService.subService}
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
              startAdornment: "Rs." // Use Nepali Rupee symbol
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
        <DialogActions sx={{ backgroundColor: '#f5f5f5' }}>
          <Button 
            onClick={handleClose} 
            sx={{ color: "#D500F9" }} // Purple color for Cancel button
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveService} 
            sx={{ color: "#D500F9" }} // Purple color for ADD/Update button
          >
            {editingServiceId ? "Update" : "ADD"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ServicesManagement;