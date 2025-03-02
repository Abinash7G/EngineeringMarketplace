import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Paper,
  ListItemText,
  ListItem,
  List,
  CircularProgress,
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
    logo: "",
    aboutUs: "",
    services: [],
    projects: [],
    team: [],
  });

  const [project, setProject] = useState({
    name: "",
    description: "",
    year: " ",
    image: "",
  });
  const [teamMember, setTeamMember] = useState({ name: "", role: "", avatar: "" });
  const [companyServices, setCompanyServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  // Handle authentication errors
  const handleAuthError = async (err, isInitialFetch = false) => {
    if (err?.response?.status === 401 || !err) {
      setError("Unauthorized access. Please log in again.");
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const refreshResponse = await axios.post("http://127.0.0.1:8000/api/token/refresh/", { refresh: refreshToken });
          const newAccessToken = refreshResponse.data.access;
          if (newAccessToken) {
            localStorage.setItem("access_token", newAccessToken);
            if (isInitialFetch) {
              const token = newAccessToken;
              const companyId = localStorage.getItem("company_id");
              await fetchCompanyDataAndServices(token, companyId);
            }
            setError(null);
          } else {
            throw new Error("Invalid access token received");
          }
        } catch (refreshErr) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      } else {
        setError("No refresh token available. Please log in again.");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    } else {
      setError("Failed to fetch company data or services. Please try again.");
    }
  };

  // Fetch company data and services
  const fetchCompanyDataAndServices = async (token, companyId) => {
    try {
      setLoading(true);
      const companyResponse = await axios.get(
        `http://127.0.0.1:8000/company-registration/${companyId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (companyResponse.status === 200) {
        const companyData = companyResponse.data;
        setCompany({
          companyName: companyData.company_name || "",
          email: companyData.company_email || "",
          phoneNumber: "",
          address: companyData.location || "",
          logo: "",
          aboutUs: "",
          services: [],
          projects: [],
          team: [],
        });
      }

      const servicesResponse = await axios.get("http://127.0.0.1:8000/api/company-services/basic/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Company Services Response (Basic):", servicesResponse.data);

      const filteredServices = servicesResponse.data.map((service, index) => ({
        id: index + 1,
        category: service.category || "Unknown",
        sub_service: service.sub_service || "Unknown",
      }));
      setCompanyServices(filteredServices);
    } catch (error) {
      console.error("Error fetching data:", error.response ? error.response.data : error.message);
      await handleAuthError(error, true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let accessToken = localStorage.getItem("access_token");
        const companyId = localStorage.getItem("company_id");

        console.log("Fetching data - Access Token:", accessToken, "Company ID:", companyId);

        if (!accessToken || !companyId) {
          setError("No valid authentication token or company ID found. Please log in again.");
          return;
        }

        if (isTokenExpired(accessToken)) {
          console.log("Token expired, refreshing...");
          await handleAuthError(null, true);
          accessToken = localStorage.getItem("access_token");
          if (!accessToken) {
            setError("No valid authentication token found after refresh. Please log in again.");
            return;
          }
        }

        await fetchCompanyDataAndServices(accessToken, companyId);
      } catch (error) {
        await handleAuthError(error, true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const companyId = localStorage.getItem("company_id");

      const formData = new FormData();
      formData.append("company_name", company.companyName);
      formData.append("email", company.email);
      formData.append("phone_number", company.phoneNumber);
      formData.append("address", company.address);
      if (company.logo) formData.append("logo", company.logo);
      formData.append("about_us", company.aboutUs);
      formData.append("services", JSON.stringify(company.services));
      formData.append("projects", JSON.stringify(company.projects));
      formData.append("team", JSON.stringify(company.team));

      const response = await axios.put(
        `http://127.0.0.1:8000/companyInfo/${companyId}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setError(null);
        alert("Company details saved successfully!");
      }
    } catch (error) {
      console.error("Error saving data:", error.response ? error.response.data : error.message);
      setError("Failed to save company details. Please try again.");
    } finally {
      setLoading(false);
    }
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

      {/* Company Information Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, border: "1px solid #e0e0e0", borderRadius: 2 }}>
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
              variant="outlined"
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={company.email}
              onChange={(e) => setCompany({ ...company, email: e.target.value })}
              variant="outlined"
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={company.phoneNumber}
              onChange={(e) => setCompany({ ...company, phoneNumber: e.target.value })}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Address"
              value={company.address}
              onChange={(e) => setCompany({ ...company, address: e.target.value })}
              variant="outlined"
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
              Upload Logo
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, (image) => setCompany({ ...company, logo: image }))}
              style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "4px", width: "100%" }}
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
              label="About Us (Max 500 letters)"
              value={company.aboutUs}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  setCompany({ ...company, aboutUs: e.target.value });
                }
              }}
              variant="outlined"
              helperText={`${company.aboutUs.length}/500 letters`}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Services Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, border: "1px solid #e0e0e0", borderRadius: 2 }}>
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
                        color: "#1E90FF",
                        borderBottom: "2px solid #FFA500",
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

      {/* Projects Section */}
      <ProjectsSection
        company={company}
        setCompany={setCompany}
        project={project}
        setProject={setProject}
        handleImageUpload={handleImageUpload}
      />

      {/* Team Members Section */}
      <TeamMembersSection
        company={company}
        setCompany={setCompany}
        teamMember={teamMember}
        setTeamMember={setTeamMember}
        handleImageUpload={handleImageUpload}
      />

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button variant="contained" size="large" onClick={handleSubmit} sx={{ backgroundColor: "#007BFF", color: "#fff" }} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Save Details"}
        </Button>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      </Box>
    </Container>
  );
};

export default CompanyUploadForm;