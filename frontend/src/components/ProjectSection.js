import React, { useState, useEffect } from "react";
import {
  Paper, Typography, Grid, TextField, Button, Box, Modal, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton, CircularProgress, Avatar
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const ProjectSection = ({ token: propToken, companyId: propCompanyId }) => {
  const companyId = propCompanyId || localStorage.getItem("company_id");
  const token = propToken || localStorage.getItem("access_token");

  const [project, setProject] = useState({ name: "", description: "", year: "", image: null });
  const [openModal, setOpenModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch projects
  useEffect(() => {
    if (!companyId || !token) {
      setError("Missing Company ID or Authentication Token. Please log in again.");
      return;
    }

    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/company-info/${companyId}/projects/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Assuming the API returns an array of projects with an 'image' field (URL or path)
        setProjects(response.data.map(project => ({
          ...project,
          image: project.image ? `http://127.0.0.1:8000${project.image}` : null // Adjust the URL based on your backend
        })));
      } catch (error) {
        console.error("Error fetching projects:", error.response?.data || error.message);
        setError(`Failed to fetch projects: ${error.response?.data?.error || error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [companyId, token]);

  // Open modal for adding/editing
  const handleOpenModal = (project = null) => {
    setSelectedProject(project);
    setProject(project || { name: "", description: "", year: "", image: null });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProject(null);
    setProject({ name: "", description: "", year: "", image: null });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      setProject((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmitProject = async () => {
    if (!project.name || !project.description || project.description.length > 200) {
      alert("Please fill in all fields. Description must not exceed 200 letters.");
      return;
    }

    if (!companyId || !token) {
      setError("Missing Company ID or Authentication Token. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", project.name);
      formData.append("description", project.description);
      formData.append("year", project.year);
      if (project.image instanceof File) formData.append("image", project.image);

      console.log("FormData contents:");
      for (let pair of formData.entries()) console.log(pair[0], pair[1]);

      if (selectedProject) {
        // Update existing project
        const response = await axios.put(`http://127.0.0.1:8000/company-info/${companyId}/projects/${selectedProject.id}/`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`, 
            "Content-Type": "multipart/form-data" 
          },
        });
        // Update projects state with the response data
        setProjects(projects.map(p => p.id === selectedProject.id ? {
          ...response.data,
          image: response.data.image ? `http://127.0.0.1:8000${response.data.image}` : null
        } : p));
      } else {
        // Create new project
        const response = await axios.post(`http://127.0.0.1:8000/company-info/${companyId}/projects/`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`, 
            "Content-Type": "multipart/form-data" 
          },
        });
        setProjects([...projects, {
          ...response.data,
          image: response.data.image ? `http://127.0.0.1:8000${response.data.image}` : null
        }]);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving project:", error.response?.data || error.message);
      setError(`Failed to save project: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!companyId || !token) {
      setError("Missing Company ID or Authentication Token. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:8000/company-info/${companyId}/projects/${projectId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error.response?.data || error.message);
      setError(`Failed to delete project: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Manage Projects</Typography>
        <Button variant="contained" sx={{ backgroundColor: "#007BFF" }} onClick={() => handleOpenModal()}>
          ADD NEW PROJECT
        </Button>
      </Box>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((proj) => (
              <TableRow key={proj.id}>
                <TableCell>{proj.name}</TableCell>
                <TableCell>{proj.description}</TableCell>
                <TableCell>{proj.year}</TableCell>
                <TableCell>
                  {proj.image && <Avatar src={proj.image} alt={proj.name} />}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenModal(proj)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteProject(proj.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MODAL */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper', boxShadow: 24, p: 4, minWidth: 400, borderRadius: 2
        }}>
          <Typography variant="h6" fontWeight="bold">Add/Edit Project</Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Project Name" value={project.name} onChange={(e) => setProject({ ...project, name: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Project Description (Max 200 letters)"
                value={project.description}
                onChange={(e) => {
                  if (e.target.value.length <= 200) setProject({ ...project, description: e.target.value });
                }}
                helperText={`${project.description.length}/200 letters`}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Year (AD/BS)" value={project.year} onChange={(e) => setProject({ ...project, year: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" fontWeight="bold">Upload Project Image</Typography>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {project.image && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">Preview:</Typography>
                  <Avatar
                    src={project.image instanceof File ? URL.createObjectURL(project.image) : project.image}
                    alt="Project Preview"
                    sx={{ width: 100, height: 100 }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button variant="contained" color="error" onClick={handleCloseModal}>CANCEL</Button>
            <Button variant="contained" color="primary" onClick={handleSubmitProject} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : selectedProject ? "UPDATE PROJECT" : "ADD PROJECT"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Paper>
  );
};

export default ProjectSection;