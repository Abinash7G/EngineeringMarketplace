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
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    // Simulate retrieving the company name on login
    const loggedInCompany = "Boy Construction"; 
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

  // *** 1) Make category default to empty (so the user must pick) ***
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    perDayRent: "",
    discountPercentage: "",
    company: "",
    isAvailable: true,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // Optionally reset form here if you like:
    // setNewMaterial({...initialState});
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewMaterial((prevMaterial) => ({
      ...prevMaterial,
      image: file,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMaterial((prevMaterial) => ({
      ...prevMaterial,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // *** 2) Updated handleAddMaterial for validation + no auto‐set of category ***
  const handleAddMaterial = async () => {
    if (!newMaterial.title || !newMaterial.description || !newMaterial.price || !newMaterial.category) {
      alert("Please fill in all required fields.");
      return;
    }
  
    let updatedMaterial = {
      ...newMaterial,
      category: newMaterial.category.toLowerCase(),  // Ensure category is lowercase
      perDayRent: newMaterial.category === "Selling" ? "0" : newMaterial.perDayRent || "0",
    };
  
    const formData = new FormData();
    formData.append("title", updatedMaterial.title);
    formData.append("description", updatedMaterial.description);
    formData.append("price", updatedMaterial.price);
    formData.append("category", updatedMaterial.category);
    formData.append("perDayRent", updatedMaterial.perDayRent);
    formData.append("discountPercentage", updatedMaterial.discountPercentage || "0");
    formData.append("company", updatedMaterial.company);
    formData.append("isAvailable", updatedMaterial.isAvailable);
  
    if (updatedMaterial.image) {
      formData.append("image", updatedMaterial.image, updatedMaterial.image.name);
    }
  
    console.log("Sending request:", Object.fromEntries(formData.entries()));
  
    try {
      const response = await API.post("/api/test/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.status === 201) {
        setMaterials([...materials, response.data]);
        handleClose();
      }
    } catch (error) {
      console.error("Failed to add material:", error.response?.data || error);
      alert("Error: Failed to add material. Check server logs.");
    }
  };
  
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

      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add New Material
      </Button>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
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
                <TableCell>{material.price}</TableCell>
                <TableCell>{material.category}</TableCell>
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

          {/* 3) Category starts blank, user must pick Renting or Selling */}
          <Select
            name="category"
            fullWidth
            margin="normal"
            value={newMaterial.category}
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value="">
              <em>Select Category</em>
            </MenuItem>
            <MenuItem value="Renting">Renting</MenuItem>
            <MenuItem value="Selling">Selling</MenuItem>
          </Select>

          {/* 4) If category is Selling, disable Per Day Rent */}
          <TextField
            label="Per Day Rent"
            name="perDayRent"
            fullWidth
            margin="normal"
            value={newMaterial.perDayRent}
            onChange={handleChange}
            disabled={newMaterial.category === "Selling"}
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

          {/* 5) Company is read-only, from logged in user */}
          <TextField
            label="Company"
            name="company"
            fullWidth
            margin="normal"
            value={companyName}
            disabled
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
