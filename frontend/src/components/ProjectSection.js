import React from "react";
import { Paper, Typography, Grid, TextField, Button, Box, List, ListItem, ListItemText, Divider, Avatar } from "@mui/material";
import axios from "axios";

const ProjectSection = ({ company, setCompany, project, setProject, handleImageUpload }) => {
  const addProject = () => {
    if (!project.name || !project.description || project.description.length > 200) {
      alert("Please fill in all fields for the project. Description must not exceed 200 letters.");
      return;
    }
    setCompany((prev) => ({
      ...prev,
      projects: [...prev.projects, { ...project, id: prev.projects.length + 1 }],
    }));
    setProject({ name: "", description: "", year: "", image: "" });
  };

  const deleteProject = async (projectId) => {
    const companyInfoId = localStorage.getItem("company_info_id");
    if (!companyInfoId) {
      setCompany((prev) => ({
        ...prev,
        projects: prev.projects.filter((proj) => proj.id !== projectId),
      }));
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(
        `http://127.0.0.1:8000/companyInfo/${companyInfoId}/projects/${projectId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompany((prev) => ({
        ...prev,
        projects: prev.projects.filter((proj) => proj.id !== projectId),
      }));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4, border: "1px solid #e0e0e0", borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>Add Projects</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Project Name" value={project.name} onChange={(e) => setProject({ ...project, name: e.target.value })} variant="outlined" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Project Description (Max 200 letters)" value={project.description} onChange={(e) => { if (e.target.value.length <= 200) setProject({ ...project, description: e.target.value }); }} variant="outlined" helperText={`${project.description.length}/200 letters`} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Year (AD/BS)" value={project.year} onChange={(e) => setProject({ ...project, year: e.target.value })} variant="outlined" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>Upload Project Image</Typography>
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (image) => setProject({ ...project, image }))} style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "4px", width: "100%" }} />
          {project.image && <Box sx={{ mt: 2 }}><Typography variant="body2">Preview:</Typography><img src={project.image} alt="Project Preview" style={{ width: 100, height: 100 }} /></Box>}
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={addProject} sx={{ backgroundColor: "#007BFF", color: "#fff" }}>Add Project</Button>
        </Grid>
        {company.projects.length > 0 && (
          <Box sx={{ mt: 4, width: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>Added Projects</Typography>
            <List>
              {company.projects.map((proj) => (
                <React.Fragment key={proj.id}>
                  <ListItem>
                    <ListItemText primary={proj.name} secondary={`Description: ${proj.description}, Year: ${proj.year}`} />
                    {proj.image && <Avatar src={proj.image} sx={{ ml: 2 }} alt={proj.name} />}
                    <Button color="error" onClick={() => deleteProject(proj.id)}>Delete</Button>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}
      </Grid>
    </Paper>
  );
};

export default ProjectSection;