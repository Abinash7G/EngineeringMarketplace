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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Select,
  MenuItem,
  IconButton,
  Checkbox,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import API from "../services/api";

const MaterialsManagement = () => {
  // Mocking the company name from the login session
  const [companyName, setCompanyName] = useState("");

  // Simulate retrieving the company name on login
  useEffect(() => {
    // Replace with actual API call or session context retrieval
    const loggedInCompany = "Boy Construction"; // Example logged-in company
    setCompanyName(loggedInCompany);
  }, []);

  const [materials, setMaterials] = useState([
    {
      id: 1,
      title: "Total Station",
      category: "Renting",
      price: 1500,
      perDayRent: 1500,
      discountPercentage: 0,
      company: "Boy Construction",
      isAvailable: false,
      createdAt: "Jan 31, 2025, 7:18 a.m.",
      image: "totalstation.png",
    },
    {
      id: 2,
      title: "Tripod",
      category: "Renting",
      price: 300,
      perDayRent: 300,
      discountPercentage: 5,
      company: "Brother Construction Point",
      isAvailable: true,
      createdAt: "Jan 31, 2025, 7:18 a.m.",
      image: "tripod.png",
    },
  ]);

  const [open, setOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    description: "",
    price: "",
    perDayRent: "",
    discountPercentage: "",
    category: "Renting",
    company: "",
    isAvailable: true,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Access the uploaded file
    setNewMaterial((prevMaterial) => ({
      ...prevMaterial,
      image: file, // Update the image in the state
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMaterial((prevMaterial) => ({
      ...prevMaterial,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // *** Only changed handleAddMaterial to send multipart/form-data ***
  const handleAddMaterial = async () => {
    // Dynamically set category
    const updatedMaterial = {
      ...newMaterial,
      category: companyName.includes("Construction") ? "Renting" : "Selling",
      company: companyName,
      createdAt: new Date().toLocaleString(),
    };
    console.log(updatedMaterial); // Just to see what we're sending

    try {
      // 1) Build FormData to handle file + other fields
      const formData = new FormData();
      formData.append("title", updatedMaterial.title);
      formData.append("description", updatedMaterial.description);
      formData.append("price", updatedMaterial.price);
      formData.append("perDayRent", updatedMaterial.perDayRent);
      formData.append("discountPercentage", updatedMaterial.discountPercentage || "");
      formData.append("category", updatedMaterial.category);
      formData.append("company", updatedMaterial.company);
      formData.append("createdAt", updatedMaterial.createdAt);
      formData.append("isAvailable", updatedMaterial.isAvailable);

      // If user selected a file, append it
      if (updatedMaterial.image) {
        formData.append("image", updatedMaterial.image, updatedMaterial.image.name);
      }

      // 2) POST to /api/test/ using multipart/form-data
      const response = await API.post("/api/test/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 3) With Axios, use response.data
      if (response.status === 200 || response.status === 201) {
        const addedMaterial = response.data;
        setMaterials([...materials, addedMaterial]);
        handleClose();
      } else {
        console.error("Failed to add material. Status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Fetch existing materials from the backend
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch("/api/company-products/");
        if (response.ok) {
          const data = await response.json();
          setMaterials(data);
        } else {
          console.error("Failed to fetch materials.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchMaterials();
  }, []);

  const handleDeleteMaterial = (id) => {
    setMaterials(materials.filter((material) => material.id !== id));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Manage Materials
      </Typography>

      {/* Add Material Button */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add New Material
      </Button>

      {/* Materials Table */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Per Day Rent</TableCell>
              <TableCell>Discount (%)</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Is Available</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materials.map((material) => (
              <TableRow key={material.id}>
                <TableCell>{material.title}</TableCell>
                <TableCell>{material.category}</TableCell>
                <TableCell>{material.price}</TableCell>
                <TableCell>{material.perDayRent}</TableCell>
                <TableCell>{material.discountPercentage}</TableCell>
                <TableCell>{material.company}</TableCell>
                <TableCell>
                  <Checkbox checked={material.isAvailable} disabled />
                </TableCell>
                <TableCell>{material.createdAt}</TableCell>
                <TableCell>
                  <IconButton color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteMaterial(material.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Material Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Material</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            fullWidth
            margin="normal"
            value={newMaterial.title}
            onChange={handleChange}
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="normal"
            value={newMaterial.description}
            onChange={handleChange}
          />
          <TextField
            label="Price"
            name="price"
            fullWidth
            margin="normal"
            value={newMaterial.price}
            onChange={handleChange}
          />
          <TextField
            label="Per Day Rent"
            name="perDayRent"
            fullWidth
            margin="normal"
            value={newMaterial.perDayRent}
            onChange={handleChange}
          />
          <TextField
            label="Discount Percentage"
            name="discountPercentage"
            fullWidth
            margin="normal"
            value={newMaterial.discountPercentage}
            onChange={handleChange}
          />
          <Typography variant="body1" gutterBottom>
            Image:
          </Typography>
          <input type="file" onChange={handleFileChange} />
          <Select
            label="Category"
            name="category"
            fullWidth
            margin="normal"
            value={newMaterial.category}
            onChange={handleChange}
          >
            <MenuItem value="Renting">Renting</MenuItem>
            <MenuItem value="Selling">Selling</MenuItem>
          </Select>
          <TextField
            label="Company"
            name="company"
            fullWidth
            margin="normal"
            value={companyName} // Set to logged-in company
            disabled // Make it non-editable
          />
          <Checkbox
            name="isAvailable"
            checked={newMaterial.isAvailable}
            onChange={handleChange}
          />
          <Typography variant="body2">Is Available</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddMaterial} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MaterialsManagement;
