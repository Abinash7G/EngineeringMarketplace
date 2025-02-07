import React, { useState } from "react";
import {
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const ServicesManagement = () => {
  const [services, setServices] = useState([
    { id: 1, name: "Residential Construction", category: "Building Construction", price: "$5000", status: "Available" },
    { id: 2, name: "Geotechnical Analysis", category: "Engineering Consulting", price: "$1500", status: "Unavailable" },
  ]);

  const [open, setOpen] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    category: "",
    price: "",
    status: "Available",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setNewService({ ...newService, [e.target.name]: e.target.value });
  };

  const handleAddService = () => {
    setServices([...services, { id: services.length + 1, ...newService }]);
    handleClose();
  };

  const handleDeleteService = (id) => {
    setServices(services.filter((service) => service.id !== id));
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

      {/* Services List */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Service Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.category}</TableCell>
                <TableCell>{service.price}</TableCell>
                <TableCell>{service.status}</TableCell>
                <TableCell>
                  <IconButton color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteService(service.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Service Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Service</DialogTitle>
        <DialogContent>
          <TextField
            label="Service Name"
            name="name"
            fullWidth
            margin="normal"
            value={newService.name}
            onChange={handleChange}
          />
          <TextField
            label="Category"
            name="category"
            fullWidth
            margin="normal"
            value={newService.category}
            onChange={handleChange}
          />
          <TextField
            label="Price"
            name="price"
            fullWidth
            margin="normal"
            value={newService.price}
            onChange={handleChange}
          />
          <TextField
            label="Status"
            name="status"
            fullWidth
            margin="normal"
            value={newService.status}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddService} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ServicesManagement;
