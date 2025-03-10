import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ProjectsSection from "./ProjectSection";
import TeamMembersSection from "./TeamMembersSection";

const CompanyUploadForm = () => {
  const [company, setCompany] = useState({
    companyName: "",
    email: "",
    phoneNumber: "",
    address: "",
    logo: null,
    aboutUs: "",
    projects: [],
    team: [],
  });
  const [companyServices, setCompanyServices] = useState([]); // State for services
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  const checkAuthentication = () => {
    const accessToken = localStorage.getItem("access_token");
    const companyId = localStorage.getItem("company_id");
    return accessToken && companyId;
  };

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (error) {
      return true;
    }
  };

  const handleAuthError = () => {
    setError("Unauthorized access. Please log in again.");
    localStorage.clear();
    window.location.href = "/login";
  };

  const fetchCompanyData = async (token) => {
    setLoading(true);
    try {
      const companyId = localStorage.getItem("company_id");
      if (!companyId) throw new Error("No company ID found.");

      const response = await axios.get(`http://127.0.0.1:8000/company-info/${companyId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const companyData = response.data;
        setCompany({
          companyName: companyData.company_name || "",
          email: companyData.company_email || "",
          phoneNumber: companyData.phone_number || "",
          address: companyData.address || "",
          logo: companyData.logo ? `http://127.0.0.1:8000${companyData.logo}` : null, // Adjust URL based on backend
          aboutUs: companyData.about_us || "",
          projects: companyData.projects || [],
          team: companyData.team || [],
        });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        handleAuthError();
      } else {
        setError("Failed to fetch company details. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyServices = async (token) => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/company-services/basic/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Company Services Response (Basic):", response.data);

      const filteredServices = response.data.map((service, index) => ({
        id: index + 1,
        category: service.category || "Unknown",
        sub_service: service.sub_service || "Unknown",
      }));
      setCompanyServices(filteredServices);
    } catch (error) {
      if (error.response?.status === 401) {
        handleAuthError();
      } else {
        setError("Failed to fetch services. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!checkAuthentication()) {
        handleAuthError();
        return;
      }

      let accessToken = localStorage.getItem("access_token");
      if (isTokenExpired(accessToken)) {
        try {
          const refreshToken = localStorage.getItem("refresh_token");
          if (!refreshToken) throw new Error("No refresh token available.");

          const refreshResponse = await axios.post("http://127.0.0.1:8000/api/token/refresh/", { refresh: refreshToken });
          accessToken = refreshResponse.data.access;
          localStorage.setItem("access_token", accessToken);
        } catch (refreshError) {
          handleAuthError();
          return;
        }
      }

      await Promise.all([fetchCompanyData(accessToken), fetchCompanyServices(accessToken)]);
    };

    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    if (!checkAuthentication()) {
      handleAuthError();
      return;
    }
    setTabIndex(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const companyId = localStorage.getItem("company_id");

      const formData = new FormData();
      formData.append("company_name", company.companyName); // Read-only, but included for completeness
      formData.append("company_email", company.email); // Read-only
      formData.append("phone_number", company.phoneNumber); // Editable
      formData.append("address", company.address); // Read-only
      if (company.logo instanceof File) formData.append("logo", company.logo); // Editable
      formData.append("about_us", company.aboutUs); // Editable
      formData.append("projects", JSON.stringify(company.projects));
      formData.append("team", JSON.stringify(company.team));

      const response = await axios.put(`http://127.0.0.1:8000/company-info/${companyId}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert("Company details updated successfully!");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        handleAuthError();
      } else {
        setError("Failed to update company details. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCompany({ ...company, logo: file });
    }
  };

  return (
    <Container sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
        Upload Company Details
      </Typography>

      <Paper elevation={3} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor="primary" textColor="primary" centered>
          <Tab label="Company Info" />
          <Tab label="Projects" />
          <Tab label="Team Members" />
        </Tabs>
      </Paper>

      {tabIndex === 0 && (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>Company Information</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Company Name" value={company.companyName} disabled variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email" value={company.email} disabled variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone Number" value={company.phoneNumber} onChange={(e) => setCompany({ ...company, phoneNumber: e.target.value })} variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Address" value={company.address} disabled variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>Upload Logo</Typography>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {company.logo && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">Preview:</Typography>
                  <img
                    src={typeof company.logo === "string" ? company.logo : URL.createObjectURL(company.logo)}
                    alt="Logo Preview"
                    style={{ width: 100, height: 100, borderRadius: "50%" }}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={4} label="About Us" value={company.aboutUs} onChange={(e) => setCompany({ ...company, aboutUs: e.target.value })} variant="outlined" />
            </Grid>
          </Grid>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              sx={{ backgroundColor: "#007BFF", color: "#fff" }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Save Details"}
            </Button>
            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          </Box>

          {/* Services Section */}
          <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4, border: "1px solid #e0e0e0", borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
              Services
            </Typography>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2, width: "100%" }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error" sx={{ mt: 2, width: "100%" }}>
                {error}
              </Typography>
            ) : companyServices.length > 0 ? (
              <Grid container spacing={3}>
                {Array.from(new Set(companyServices.map((s) => s.category))).map((category, index) => {
                  const categoryServices = companyServices.filter((s) => s.category === category);
                  return (
                    <Grid item xs={12} sm={6} key={category}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          border: "1px solid #e0e0e0",
                          borderRadius: 2,
                          backgroundColor: "#fff",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 2,
                            fontWeight: "bold",
                            color: "#1E90FF", // Blue header
                            borderBottom: "2px solid #FFA500", // Orange underline
                            pb: 1,
                          }}
                        >
                          {category}
                        </Typography>
                        <List dense>
                          {categoryServices.map((service) => (
                            <ListItem key={service.id} sx={{ pl: 2, py: 0.5 }}>
                              <ListItemText
                                primary={
                                  <Typography variant="body2" sx={{ color: "#333" }}>
                                    • {service.sub_service}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Typography sx={{ mt: 2 }}>No services added yet.</Typography>
            )}
          </Paper>
        </Paper>
      )}

      {tabIndex === 1 && <ProjectsSection company={company} setCompany={setCompany} />}
      {tabIndex === 2 && <TeamMembersSection company={company} setCompany={setCompany} />}
    </Container>
  );
};

export default CompanyUploadForm;