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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const ServicesManagement = () => {
  const [services, setServices] = useState([]); // Store added services
  const [categories, setCategories] = useState([]); // Store service categories from backend
  const [subServices, setSubServices] = useState([]); // Store sub-services based on selected category
  const [open, setOpen] = useState(false);
  const [editingServiceIndex, setEditingServiceIndex] = useState(null); // Track service being edited

  const [newService, setNewService] = useState({
    category: "",
    subServices: [], // Allow multiple selection
    price: "",
    status: "Available",
  });

  // Fetch categories & services from backend
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/services/")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching services:", error));
  }, []);

  // Handle category selection & load sub-services
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setNewService({ ...newService, category: selectedCategory, subServices: [] });

    const categoryData = categories.find(cat => cat.category === selectedCategory);
    if (categoryData) {
      setSubServices(categoryData.services);
    } else {
      setSubServices([]);
    }
  };

  // Open & close modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setEditingServiceIndex(null);
    setNewService({ category: "", subServices: [], price: "", status: "Available" });
    setOpen(false);
  };

  // Add or Update Service
  const handleSaveService = () => {
    if (!newService.category || newService.subServices.length === 0) return;

    const newEntries = newService.subServices.map(sub => ({
      category: newService.category,
      subService: sub,
      price: newService.price,
      status: newService.status
    }));

    if (editingServiceIndex !== null) {
      // Update existing service
      setServices((prev) =>
        prev.map((s, i) => (i === editingServiceIndex ? newEntries[0] : s))
      );
    } else {
      // Add new services (one row per sub-service)
      setServices([...services, ...newEntries]);
    }
    
    handleClose();
  };

  // Edit Service
  const handleEditService = (index) => {
    setEditingServiceIndex(index);
    setNewService({
      category: services[index].category,
      subServices: [services[index].subService], // Set the selected sub-service
      price: services[index].price,
      status: services[index].status
    });
    handleOpen();
  };

  // Delete Service
  const handleDeleteService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Manage Services
      </Typography>

      {/* Add Service Button */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add New Service
      </Button>

      {/* Service Table */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Service Category</TableCell>
              <TableCell>Sub-Service</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service, index) => (
              <TableRow key={index}>
                <TableCell>{service.category}</TableCell>
                <TableCell>{service.subService}</TableCell>
                <TableCell>${service.price}</TableCell>
                <TableCell>{service.status}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditService(index)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteService(index)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Service Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingServiceIndex !== null ? "Edit Service" : "Add New Service"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Service Category</InputLabel>
            <Select value={newService.category} onChange={handleCategoryChange}>
              {categories.map((category) => (
                <MenuItem key={category.category} value={category.category}>
                  {category.category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Sub-Services</InputLabel>
            <Select
              multiple
              value={newService.subServices}
              onChange={(e) => setNewService({ ...newService, subServices: e.target.value })}
              disabled={!newService.category}
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
          />

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newService.status}
              onChange={(e) => setNewService({ ...newService, status: e.target.value })}
            >
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Unavailable">Unavailable</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveService} color="primary">
            {editingServiceIndex !== null ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ServicesManagement;
