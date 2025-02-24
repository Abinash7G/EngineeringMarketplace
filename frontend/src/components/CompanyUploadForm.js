import React, { useState, useEffect } from "react";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";

const CompanyUploadForm = () => {
  const [company, setCompany] = useState({
    companyName: "",
    email: "",
    phoneNumber: "",
    address: "",
    logo: "",
    aboutUs: "",
    services: [],
    projects: [],
    team: [],
  });

  const [service, setService] = useState({ category: "", subServices: [] });
  const [project, setProject] = useState({ name: "", description: "", year: "", image: "" });
  const [teamMember, setTeamMember] = useState({ name: "", role: "", avatar: "" });
  const [categories, setCategories] = useState([]);
  const [subServices, setSubServices] = useState([]);

  // Fetch company data on component mount
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        //  Retrieve correct access token
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("No token found. User is not authenticated.");
          return;
        }

        //  Retrieve the logged-in user's `company_id`
        const companyId = localStorage.getItem("company_id"); 
        if (!companyId) {
          console.error("No company_id found in localStorage.");
          return;
        }

        //  Fetch the correct company details using the ID
        const response = await axios.get(
          `http://127.0.0.1:8000/api/company-registration/${companyId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const companyData = response.data;
          setCompany({
            companyName: companyData.company_name, // Use correct API field
            email: companyData.company_email,
            phoneNumber: companyData.phone_number || "N/A",
            address: companyData.location, // Assuming 'location' is the address
          });
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchCompanyData();
  }, []);


  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/services/")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setService({ ...service, category: selectedCategory });

    const selectedCategoryData = categories.find((cat) => cat.category === selectedCategory);
    if (selectedCategoryData) {
      setSubServices(selectedCategoryData.services);
    } else {
      setSubServices([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Company Details Submitted:", company);
  };

  const addService = () => {
    setCompany((prev) => ({
      ...prev,
      services: [...prev.services, { id: prev.services.length + 1, ...service }],
    }));
    setService({ category: "", subServices: [] });
    setSubServices([]);
  };

  const addProject = () => {
    setCompany((prev) => ({
      ...prev,
      projects: [...prev.projects, { id: prev.projects.length + 1, ...project }],
    }));
    setProject({ name: "", description: "", year: "", image: "" });
  };

  const addTeamMember = () => {
    if (!teamMember.name || !teamMember.role || !teamMember.avatar) {
      alert("Please fill in all fields for the team member.");
      return;
    }
    setCompany((prev) => ({
      ...prev,
      team: [...prev.team, { id: prev.team.length + 1, ...teamMember }],
    }));
    setTeamMember({ name: "", role: "", avatar: "" });
  };

  const handleImageUpload = (event, setImageState) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageState(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
        Upload Company Details
      </Typography>

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

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          Add Services
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Service Category</InputLabel>
              <Select
                value={service.category}
                onChange={handleCategoryChange}
                label="Service Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category.category} value={category.category}>
                    {category.category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Sub-Services</InputLabel>
              <Select
                multiple
                value={service.subServices}
                onChange={(e) => setService({ ...service, subServices: e.target.value })}
                label="Sub-Services"
              >
                {subServices.map((subService) => (
                  <MenuItem key={subService.id} value={subService.name}>
                    {subService.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={addService}>
              Add Service
            </Button>
          </Grid>
        </Grid>
      </Paper>

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

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button variant="contained" size="large" onClick={handleSubmit}>
          Save Details
        </Button>
      </Box>
    </Container>
  );
};

export default CompanyUploadForm;