import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";

const CompanyUploadForm = () => {
  // State to hold company details
  const [company, setCompany] = useState({
    companyName: "",
    email: "",
    phoneNumber: "",
    address: "",
    logo: "", // Base64 string for logo
    aboutUs: "",
    services: [],
    projects: [],
    team: [],
  });

  // State for form inputs
  const [service, setService] = useState({ category: "", subServices: [] });
  const [project, setProject] = useState({ name: "", description: "", year: "", image: "" }); // Base64 string for project image
  const [teamMember, setTeamMember] = useState({ name: "", role: "", avatar: "" }); // Base64 string for team member avatar

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Company Details Submitted:", company);
    // Here, you can send the data to a backend API or store it in a database
  };

  // Add a new service
  const addService = () => {
    setCompany((prev) => ({
      ...prev,
      services: [...prev.services, { id: prev.services.length + 1, ...service }],
    }));
    setService({ category: "", subServices: [] }); // Reset service form
  };

  // Add a new project
  const addProject = () => {
    setCompany((prev) => ({
      ...prev,
      projects: [...prev.projects, { id: prev.projects.length + 1, ...project }],
    }));
    setProject({ name: "", description: "", year: "", image: "" }); // Reset project form
  };

  // Add a new team member
  const addTeamMember = () => {
    if (!teamMember.name || !teamMember.role || !teamMember.avatar) {
      alert("Please fill in all fields for the team member.");
      return;
    }
    setCompany((prev) => ({
      ...prev,
      team: [...prev.team, { id: prev.team.length + 1, ...teamMember }],
    }));
    setTeamMember({ name: "", role: "", avatar: "" }); // Reset team member form
  };

  // Handle image upload for logo, project image, and team member avatar
  const handleImageUpload = (event, setImageState) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageState(reader.result); // Set the Base64 string
      };
      reader.readAsDataURL(file); // Convert the image to Base64
    }
  };

  return (
    <Container sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
        Upload Company Details
      </Typography>

      {/* Company Details Form */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          Company Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company Name"
              value={company.companyName}
              onChange={(e) => setCompany({ ...company, companyName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={company.email}
              onChange={(e) => setCompany({ ...company, email: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={company.phoneNumber}
              onChange={(e) => setCompany({ ...company, phoneNumber: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Address"
              value={company.address}
              onChange={(e) => setCompany({ ...company, address: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Upload Logo
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, (image) => setCompany({ ...company, logo: image }))}
            />
            {company.logo && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">Preview:</Typography>
                <img src={company.logo} alt="Logo Preview" style={{ width: 100, height: 100, borderRadius: "50%" }} />
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="About Us"
              value={company.aboutUs}
              onChange={(e) => setCompany({ ...company, aboutUs: e.target.value })}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Services Form */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          Add Services
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Service Category"
              value={service.category}
              onChange={(e) => setService({ ...service, category: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Sub-Services (comma-separated)"
              value={service.subServices.join(",")}
              onChange={(e) =>
                setService({ ...service, subServices: e.target.value.split(",") })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={addService}>
              Add Service
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Projects Form */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          Add Projects
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Project Name"
              value={project.name}
              onChange={(e) => setProject({ ...project, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Project Description"
              value={project.description}
              onChange={(e) => setProject({ ...project, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Year"
              value={project.year}
              onChange={(e) => setProject({ ...project, year: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Upload Project Image
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, (image) => setProject({ ...project, image }))}
            />
            {project.image && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">Preview:</Typography>
                <img src={project.image} alt="Project Preview" style={{ width: 100, height: 100 }} />
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={addProject}>
              Add Project
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Team Members Form */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          Add Team Members
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              value={teamMember.name}
              onChange={(e) => setTeamMember({ ...teamMember, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Role"
              value={teamMember.role}
              onChange={(e) => setTeamMember({ ...teamMember, role: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Upload Avatar
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, (image) => setTeamMember({ ...teamMember, avatar: image }))}
            />
            {teamMember.avatar && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">Preview:</Typography>
                <img src={teamMember.avatar} alt="Avatar Preview" style={{ width: 100, height: 100, borderRadius: "50%" }} />
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={addTeamMember}>
              Add Team Member
            </Button>
          </Grid>
        </Grid>

        {/* Display Added Team Members */}
        {company.team.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Team Members
            </Typography>
            <List>
              {company.team.map((member) => (
                <React.Fragment key={member.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar src={member.avatar} alt={member.name} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={member.name}
                      secondary={`Role: ${member.role}`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}
      </Paper>

      {/* Submit Button */}
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button variant="contained" size="large" onClick={handleSubmit}>
          Submit Company Details
        </Button>
      </Box>
    </Container>
  );
};

export default CompanyUploadForm;