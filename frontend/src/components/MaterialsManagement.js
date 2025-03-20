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
  const [companyId, setCompanyId] = useState(null); // Store company_id instead of companyName
  const [materials, setMaterials] = useState([]);
  const [open, setOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    perDayRent: "",
    discountPercentage: "",
    company: "",
    isAvailable: true,
    id: null, // For editing existing materials
  });

  // Fetch company ID and materials on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const storedCompanyId = localStorage.getItem("company_id");
        if (!storedCompanyId) {
          console.error("Company ID not found. Please log in again.");
          return;
        }

        const numericCompanyId = parseInt(storedCompanyId, 10);
        if (isNaN(numericCompanyId)) {
          console.error("Invalid company ID format. Please log in again.");
          return;
        }

        setCompanyId(numericCompanyId);
        fetchMaterials(numericCompanyId);
      } catch (error) {
        console.error("Error fetching company or materials data:", error);
      }
    };
    loadInitialData();
  }, []);

  // Fetch materials for the logged-in company's ID using /api/test/
  const fetchMaterials = async (companyId) => {
    if (!companyId) {
      console.error("No company ID available to fetch materials.");
      return;
    }
    try {
      const response = await API.get(`/api/test/?company_id=${companyId}`);
      if (response.status === 200) {
        setMaterials(response.data);
      } else {
        console.error("Failed to fetch materials:", response.status);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const handleOpen = () => {
    // Reset form and ensure company name is set to the logged-in company
    setNewMaterial({
      title: "",
      description: "",
      price: "",
      category: "",
      perDayRent: "",
      discountPercentage: "",
      company: companyId,
      isAvailable: true,
      id: null,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewMaterial({
      title: "",
      description: "",
      price: "",
      category: "",
      perDayRent: "",
      discountPercentage: "",
      company: companyId || "", // Use companyId
      isAvailable: true,
      id: null,
    });
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
      [name]: type === "checkbox" ? checked : name === "category" ? value : value,
    }));
  };

  const handleAddOrUpdateMaterial = async () => {
    if (!newMaterial.title || !newMaterial.description || !newMaterial.price || !newMaterial.category) {
      alert("Please fill in all required fields.");
      return;
    }

    let updatedMaterial = {
      ...newMaterial,
      // category: newMaterial.category.toLowerCase(),
      perDayRent: newMaterial.category === "Selling" ? "0" : newMaterial.perDayRent || "0",
      discountPercentage: newMaterial.discountPercentage || "0",
      company: companyId, // Use companyId instead of companyName
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

    try {
      let response;
      if (newMaterial.id) {
        // Update existing material
        response = await API.put(`/api/test/${newMaterial.id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Add new material
        response = await API.post("/api/test/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.status === 201 || response.status === 200) {
        fetchMaterials(companyId); // Refresh the list with only the logged-in company's materials
        handleClose();
      }
    } catch (error) {
      console.error("Failed to save material:", error.response?.data || error);
      alert("Error: Failed to save material. Check server logs.");
    }
  };

  const handleEditMaterial = (material) => {
    if (material.company === companyId) {
      setNewMaterial({
        ...material,
        image: null, // Reset image for editing (user can upload a new one if needed)
      });
      setOpen(true);
    } else {
      alert("You can only edit materials belonging to your company.");
    }
  };

  const handleDeleteMaterial = (id) => {
    const materialToDelete = materials.find((material) => material.id === id);
    if (materialToDelete.company === companyId) {
      if (window.confirm("Are you sure you want to delete this material?")) {
        API.delete(`/api/test/${id}/`)
          .then(() => {
            setMaterials(materials.filter((material) => material.id !== id));
          })
          .catch((error) => {
            console.error("Failed to delete material:", error);
            alert("Error: Failed to delete material.");
          });
      }
    } else {
      alert("You can only delete materials belonging to your company.");
    }
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
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
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
                  <IconButton color="primary" onClick={() => handleEditMaterial(material)}>
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
        <DialogTitle>{newMaterial.id ? "Edit Material" : "Add New Material"}</DialogTitle>
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

          <Typography variant="body1" gutterBottom> {/* Add label for Select */}
           
          </Typography>
          <Select
            name="category"
            fullWidth
            margin="normal"
            value={newMaterial.category || ""} // Ensure it's an empty string if undefined
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value="">
              <em>Select Category</em>
            </MenuItem>
            <MenuItem value="Renting">Renting</MenuItem>
            <MenuItem value="Selling">Selling</MenuItem>
          </Select>

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

          <TextField
            label="Company"
            name="company"
            fullWidth
            margin="normal"
            value={newMaterial.company || companyId || "Default Company"} // Ensure company name is always displayed
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
          <Button onClick={handleAddOrUpdateMaterial} color="primary">
            {newMaterial.id ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
   
export default MaterialsManagement;