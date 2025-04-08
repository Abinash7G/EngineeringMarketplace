// import React, { useState, useEffect } from "react";
// import API from "../services/api";
// import {
//   Box,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   TextField,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   CircularProgress,
//   Alert,
// } from "@mui/material";
// import Sidebar from "../components/Sidebar";
// import { useNavigate } from "react-router-dom";

// const Services = () => {
//   const navigate = useNavigate();
//   const [categoriesWithServices, setCategoriesWithServices] = useState([]); // Nested structure from /api/services/
//   const [categories, setCategories] = useState([]); // For the category dropdown
//   const [openDialog, setOpenDialog] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentService, setCurrentService] = useState({ id: null, name: "", category_id: "", newCategory: "" });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [addNewCategory, setAddNewCategory] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         // Fetch categories for the dropdown
//         const categoriesResponse = await API.get("/api/service-categories/");
//         setCategories(categoriesResponse.data);

//         // Fetch services with their categories
//         const servicesResponse = await API.get("/api/services/");
//         setCategoriesWithServices(servicesResponse.data);
//       } catch (error) {
//         setError("Failed to fetch data. Please try again.");
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleAddService = () => {
//     setIsEditing(false);
//     setAddNewCategory(false);
//     setCurrentService({ id: null, name: "", category_id: "", newCategory: "" });
//     setOpenDialog(true);
//   };

//   const handleEditService = (service, categoryName) => {
//     setIsEditing(true);
//     setAddNewCategory(false);
//     setCurrentService({
//       id: service.id,
//       name: service.name,
//       category_id: categories.find((cat) => cat.name === categoryName)?.id || "",
//       newCategory: "",
//     });
//     setOpenDialog(true);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentService((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleToggleCategoryMode = () => {
//     setAddNewCategory(!addNewCategory);
//     setCurrentService((prev) => ({ ...prev, category_id: "", newCategory: "" }));
//   };

//   const handleSaveService = async () => {
//     if (!currentService.name) {
//       setError("Please provide a service name.");
//       return;
//     }

//     if (!addNewCategory && !currentService.category_id) {
//       setError("Please select a category.");
//       return;
//     }

//     if (addNewCategory && !currentService.newCategory) {
//       setError("Please provide a new category name.");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       let categoryId = currentService.category_id;

//       if (addNewCategory) {
//         const categoryResponse = await API.post("/api/service-categories/", {
//           name: currentService.newCategory,
//         });
//         categoryId = categoryResponse.data.id;
//         setCategories((prev) => [...prev, categoryResponse.data]); // Update the category dropdown
//       }

//       const payload = {
//         name: currentService.name,
//         category_id: categoryId,
//       };

//       if (isEditing) {
//         const response = await API.put(`/api/services/${currentService.id}/`, payload);
//         // Refetch the nested structure after updating
//         const servicesResponse = await API.get("/api/services/");
//         setCategoriesWithServices(servicesResponse.data);
//         alert("Service updated successfully!");
//       } else {
//         const response = await API.post("/api/services/create/", payload);
//         // Refetch the nested structure after adding
//         const servicesResponse = await API.get("/api/services/");
//         setCategoriesWithServices(servicesResponse.data);
//         alert("Service added successfully!");
//       }
//       setOpenDialog(false);
//     } catch (error) {
//       if (error.response?.status === 400 && error.response?.data?.name) {
//         setError("A service with this name already exists.");
//       } else if (error.response?.status === 400 && error.response?.data?.category_id) {
//         setError("Invalid category selected. Please try again.");
//       } else {
//         setError("Failed to save service. Please try again.");
//       }
//       console.error("Error saving service:", error);
//       console.error("Error response:", error.response?.data);
//       console.error("Error status:", error.response?.status);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteService = async (id) => {
//     if (window.confirm("Are you sure you want to delete this service?")) {
//       setLoading(true);
//       setError(null);
//       try {
//         await API.delete(`/api/services/${id}/delete/`);
//         // Refetch the nested structure after deleting
//         const servicesResponse = await API.get("/api/services/");
//         setCategoriesWithServices(servicesResponse.data);
//         alert("Service deleted successfully!");
//       } catch (error) {
//         setError("Failed to delete service. Please try again.");
//         console.error("Error deleting service:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setCurrentService({ id: null, name: "", category_id: "", newCategory: "" });
//     setAddNewCategory(false);
//     setError(null);
//   };

//   // Check if a category is selected or a new category is added
//   const isCategorySelected = addNewCategory ? currentService.newCategory : currentService.category_id;

//   return (
//     <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f9f9f9" }}>
//       <Sidebar />
//       <Box sx={{ flex: 1, overflowY: "auto", padding: "20px" }}>
//         <Typography variant="h4" sx={{ marginBottom: "20px" }}>
//           Services Management
//         </Typography>

//         {error && (
//           <Alert severity="error" sx={{ marginBottom: "20px" }}>
//             {error}
//           </Alert>
//         )}

//         {loading && (
//           <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
//             <CircularProgress />
//           </Box>
//         )}

//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleAddService}
//           sx={{ marginBottom: "20px" }}
//           disabled={loading}
//         >
//           Add New Service
//         </Button>

//         {!loading && categoriesWithServices.every((category) => category.services.length === 0) ? (
//           <Typography>No services available.</Typography>
//         ) : (
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Service Category</TableCell>
//                   <TableCell>Sub-Service</TableCell>
//                   <TableCell>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {categoriesWithServices.map((category) =>
//                   category.services.map((service) => (
//                     <TableRow key={service.id}>
//                       <TableCell>{category.category || "N/A"}</TableCell>
//                       <TableCell>{service.name}</TableCell>
//                       <TableCell>
//                         <Button
//                           variant="contained"
//                           color="info"
//                           onClick={() => handleEditService(service, category.category)}
//                           sx={{ marginRight: "10px" }}
//                           disabled={loading}
//                         >
//                           Edit
//                         </Button>
//                         <Button
//                           variant="contained"
//                           color="error"
//                           onClick={() => handleDeleteService(service.id)}
//                           disabled={loading}
//                         >
//                           Delete
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}

//         <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
//           <DialogTitle>{isEditing ? "Edit Service" : "Add New Service"}</DialogTitle>
//           <DialogContent>
//             <Box sx={{ mt: 2 }}>
//               {addNewCategory ? (
//                 <TextField
//                   fullWidth
//                   label="New Category Name"
//                   name="newCategory"
//                   value={currentService.newCategory}
//                   onChange={handleInputChange}
//                   sx={{ marginBottom: "20px" }}
//                   disabled={loading}
//                 />
//               ) : (
//                 <FormControl fullWidth sx={{ marginBottom: "20px" }}>
//                   <InputLabel>Category</InputLabel>
//                   <Select
//                     name="category_id"
//                     value={currentService.category_id}
//                     onChange={handleInputChange}
//                     label="Category"
//                     disabled={loading}
//                   >
//                     <MenuItem value="">
//                       <em>Select a category</em>
//                     </MenuItem>
//                     {categories.map((category) => (
//                       <MenuItem key={category.id} value={category.id}>
//                         {category.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               )}

//               <Button
//                 onClick={handleToggleCategoryMode}
//                 sx={{ marginBottom: "20px" }}
//                 disabled={loading}
//               >
//                 {addNewCategory ? "Select Existing Category" : "Add New Category"}
//               </Button>

//               {/* Show Service Name field only if a category is selected or a new category is added */}
//               {isCategorySelected && (
//                 <TextField
//                   fullWidth
//                   label="Service Name"
//                   name="name"
//                   value={currentService.name}
//                   onChange={handleInputChange}
//                   sx={{ marginBottom: "20px" }}
//                   disabled={loading}
//                 />
//               )}
//             </Box>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseDialog} color="secondary" disabled={loading}>
//               Cancel
//             </Button>
//             <Button onClick={handleSaveService} color="primary" disabled={loading || !isCategorySelected}>
//               {loading ? <CircularProgress size={24} /> : "Save"}
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     </Box>
//   );
// };

// export default Services;
import React, { useState, useEffect } from "react";
import API from "../services/api";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();
  const [categoriesWithServices, setCategoriesWithServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState({ 
    id: null, 
    name: "", 
    category_id: "", 
    newCategory: "" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addNewCategory, setAddNewCategory] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleOpenSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const categoriesResponse = await API.get("/api/service-categories/");
        setCategories(categoriesResponse.data);

        const servicesResponse = await API.get("/api/services/");
        setCategoriesWithServices(servicesResponse.data);
      } catch (error) {
        setError("Failed to fetch data. Please try again.");
        handleOpenSnackbar("Failed to fetch data. Please try again.", 'error');
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddService = () => {
    setIsEditing(false);
    setAddNewCategory(false);
    setCurrentService({ id: null, name: "", category_id: "", newCategory: "" });
    setOpenDialog(true);
  };

  const handleEditService = (service, categoryName) => {
    setIsEditing(true);
    setAddNewCategory(false);
    setCurrentService({
      id: service.id,
      name: service.name,
      category_id: categories.find((cat) => cat.name === categoryName)?.id || "",
      newCategory: "",
    });
    setOpenDialog(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentService((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleCategoryMode = () => {
    setAddNewCategory(!addNewCategory);
    setCurrentService((prev) => ({ ...prev, category_id: "", newCategory: "" }));
  };

  const handleSaveService = async () => {
    if (!currentService.name) {
      setError("Please provide a service name.");
      return;
    }

    if (!addNewCategory && !currentService.category_id) {
      setError("Please select a category.");
      return;
    }

    if (addNewCategory && !currentService.newCategory) {
      setError("Please provide a new category name.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let categoryId = currentService.category_id;

      if (addNewCategory) {
        const categoryResponse = await API.post("/api/service-categories/", {
          name: currentService.newCategory,
        });
        categoryId = categoryResponse.data.id;
        setCategories((prev) => [...prev, categoryResponse.data]);
      }

      const payload = {
        name: currentService.name,
        category_id: categoryId,
      };

      if (isEditing) {
        await API.put(`/api/services/${currentService.id}/`, payload);
        const servicesResponse = await API.get("/api/services/");
        setCategoriesWithServices(servicesResponse.data);
        handleOpenSnackbar("Service updated successfully!");
      } else {
        await API.post("/api/services/create/", payload);
        const servicesResponse = await API.get("/api/services/");
        setCategoriesWithServices(servicesResponse.data);
        handleOpenSnackbar("Service added successfully!");
      }
      setOpenDialog(false);
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.name) {
        setError("A service with this name already exists.");
        handleOpenSnackbar("A service with this name already exists.", 'error');
      } else if (error.response?.status === 400 && error.response?.data?.category_id) {
        setError("Invalid category selected. Please try again.");
        handleOpenSnackbar("Invalid category selected. Please try again.", 'error');
      } else {
        setError("Failed to save service. Please try again.");
        handleOpenSnackbar("Failed to save service. Please try again.", 'error');
      }
      console.error("Error saving service:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      setLoading(true);
      setError(null);
      try {
        await API.delete(`/api/services/${id}/delete/`);
        const servicesResponse = await API.get("/api/services/");
        setCategoriesWithServices(servicesResponse.data);
        handleOpenSnackbar("Service deleted successfully!");
      } catch (error) {
        setError("Failed to delete service. Please try again.");
        handleOpenSnackbar("Failed to delete service. Please try again.", 'error');
        console.error("Error deleting service:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentService({ id: null, name: "", category_id: "", newCategory: "" });
    setAddNewCategory(false);
    setError(null);
  };

  const isCategorySelected = addNewCategory ? currentService.newCategory : currentService.category_id;

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f9f9f9" }}>
      <Sidebar />
      <Box sx={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        <Typography variant="h4" sx={{ marginBottom: "20px" }}>
          Services Management
        </Typography>

        {error && (
          <Alert severity="error" sx={{ marginBottom: "20px" }}>
            {error}
          </Alert>
        )}

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <CircularProgress />
          </Box>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddService}
          sx={{ marginBottom: "20px" }}
          disabled={loading}
        >
          Add New Service
        </Button>

        {!loading && categoriesWithServices.every((category) => category.services.length === 0) ? (
          <Typography>No services available.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Service Category</TableCell>
                  <TableCell>Sub-Service</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoriesWithServices.map((category) =>
                  category.services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{category.category || "N/A"}</TableCell>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="info"
                          onClick={() => handleEditService(service, category.category)}
                          sx={{ marginRight: "10px" }}
                          disabled={loading}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteService(service.id)}
                          disabled={loading}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{isEditing ? "Edit Service" : "Add New Service"}</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              {addNewCategory ? (
                <TextField
                  fullWidth
                  label="New Category Name"
                  name="newCategory"
                  value={currentService.newCategory}
                  onChange={handleInputChange}
                  sx={{ marginBottom: "20px" }}
                  disabled={loading}
                />
              ) : (
                <FormControl fullWidth sx={{ marginBottom: "20px" }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category_id"
                    value={currentService.category_id}
                    onChange={handleInputChange}
                    label="Category"
                    disabled={loading}
                  >
                    <MenuItem value="">
                      <em>Select a category</em>
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <Button
                onClick={handleToggleCategoryMode}
                sx={{ marginBottom: "20px" }}
                disabled={loading}
              >
                {addNewCategory ? "Select Existing Category" : "Add New Category"}
              </Button>

              {isCategorySelected && (
                <TextField
                  fullWidth
                  label="Service Name"
                  name="name"
                  value={currentService.name}
                  onChange={handleInputChange}
                  sx={{ marginBottom: "20px" }}
                  disabled={loading}
                />
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary" disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSaveService} color="primary" disabled={loading || !isCategorySelected}>
              {loading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Services;