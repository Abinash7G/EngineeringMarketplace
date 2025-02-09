import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Box,
  Paper,
} from "@mui/material";
import ServicesManagement from "../components/ServicesManagement";
import MaterialsManagement from "../components/MaterialsManagement";
import Appointments from "../components/Appointments";
import Documents from "../components/Documents";
import ProfileSettings from "../components/ProfileSettings";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
const CompanyDashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [companyName, setCompanyName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const storedCompanyName = sessionStorage.getItem("companyName");
        if (storedCompanyName) {
          setCompanyName(storedCompanyName);
        } else {
          const companyId = localStorage.getItem("company_id"); // Retrieve company ID
          if (!companyId) {
            console.error("Company ID not found. Redirecting to login.");
            navigate("/login"); // Redirect to login if company ID is missing
            return;
          }
          const response = await API.get(`/api/company-registration/${companyId}/`); // Fetch details
          const data = response.data;
          setCompanyName(data.company_name); // Assuming backend returns `company_name`
          sessionStorage.setItem("companyName", data.company_name); // Cache in sessionStorage
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };
    loadInitialData();
  }, [navigate]);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };
  const handleLogout = () => {
    // Perform logout logic (e.g., clear auth tokens, session storage, etc.)
    console.log("User logged out");

    // Navigate to the login or home page
    navigate("/");
  };


  return (
    <div>
      {/* Top Navigation Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome, {companyName}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
          </Toolbar>
      </AppBar>

      {/* Main Container */}
      <Container sx={{ mt: 4 }}>
        {/* Tabs Navigation */}
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Dashboard" />
          <Tab label="Manage Services" />
          <Tab label="Manage Materials" />
          <Tab label="Appointments" />
          <Tab label="Documents" />
          <Tab label="Profile Settings" />
        </Tabs>

        {/* Content */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {/* Dashboard Tab */}
          {tabIndex === 0 && (
            <Grid item xs={12}>
              {/* Overview Metrics */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Total Services</Typography>
                      <Typography variant="h4" color="primary">
                        10
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Pending Appointments</Typography>
                      <Typography variant="h4" color="secondary">
                        5
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Total Revenue</Typography>
                      <Typography variant="h4" color="success">
                        $50,000
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Static Analytics Section */}
              <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                  Revenue and Appointments Analytics
                </Typography>
                <Typography variant="body1">
                  Analytics data is currently unavailable.
                </Typography>
              </Box>

              {/* Quick Actions */}
              <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button fullWidth variant="contained" color="primary">
                      Add New Service
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button fullWidth variant="contained" color="primary">
                      Add New Material
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button fullWidth variant="contained" color="primary">
                      View Appointments
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button fullWidth variant="contained" color="primary">
                      Generate Document
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {/* Notifications Section */}
              <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                  Notifications
                </Typography>
                <Paper elevation={3} style={{ padding: "16px" }}>
                  <Typography variant="body1">
                    📅 Upcoming Appointment: Site Inspection on 12th Feb, 2025
                  </Typography>
                  <Typography variant="body1">
                    📦 Low Stock Alert: Cement stock below threshold.
                  </Typography>
                  <Typography variant="body1">
                    ✅ Recent Service Added: Residential Construction Service.
                  </Typography>
                </Paper>
              </Box>
            </Grid>
          )}

          {/* Other Tabs */}
          {tabIndex === 1 && <ServicesManagement />}
          {tabIndex === 2 && <MaterialsManagement />}
          {tabIndex === 3 && <Appointments />}
          {tabIndex === 4 && <Documents />}
          {tabIndex === 5 && <ProfileSettings />}
        </Grid>
      </Container>
    </div>
  );
};

export default CompanyDashboard;
