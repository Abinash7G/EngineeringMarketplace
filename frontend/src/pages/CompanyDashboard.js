import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Box,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Build as BuildIcon,
  Inventory as InventoryIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import ServicesManagement from "../components/ServicesManagement";
import MaterialsManagement from "../components/MaterialsManagement";
import Appointments from "../components/Appointments";
import Documents from "../components/Documents";
import ProfileSettings from "../components/ProfileSettings";
import CompanyUploadForm from "../components/CompanyUploadForm";
import InquiriesList from "../components/InquiriesList";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const CompanyDashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch company name and handle inquiries
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const storedCompanyName = sessionStorage.getItem("companyName");
        if (storedCompanyName) {
          setCompanyName(storedCompanyName);
          setLoading(false);
          return; // Skip API call if company name is already stored
        }

        // Retrieve company_id from localStorage and ensure it’s a valid number
        const companyId = localStorage.getItem("company_id");
        if (!companyId) {
          setError("Company ID not found. Please log in again.");
          navigate("/login");
          return;
        }

        // Convert companyId to a number to match the database integer type
        const numericCompanyId = parseInt(companyId, 10);
        if (isNaN(numericCompanyId)) {
          setError("Invalid company ID format. Please log in again.");
          navigate("/login");
          return;
        }

        // Ensure API is configured with authentication if needed
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          API.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        }

        // Make the API request with the numeric company ID
        const response = await API.get(`/company-registration/${numericCompanyId}/`);
        const data = response.data;
        setCompanyName(data.company_name);
        sessionStorage.setItem("companyName", data.company_name);
      } catch (error) {
        console.error("Error fetching company data or inquiries:", error);
        if (error.response) {
          if (error.response.status === 404) {
            setError("Company not found. Please check your company ID or log in again.");
            // Optionally, redirect to a page to re-enter or verify company details
            navigate("/login");
          } else if (error.response.status === 401 || error.response.status === 403) {
            setError("Unauthorized access. Please log in again.");
            navigate("/login");
          } else {
            setError("An error occurred while loading data. Please try again.");
          }
        } else {
          setError("No response from server. Please check your connection and try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [navigate]);

  // Handle menu click
  const handleMenuClick = (newIndex) => {
    setTabIndex(newIndex);
  };

  // Handle form submission (e.g., from InquiriesList or another form component)
  const handleFormSubmit = (formData) => {
    setInquiries(prev => [...prev, formData]); // Add new inquiry to the list
  };

  // Handle logout
  const handleLogout = () => {
    // Remove tokens and company ID from localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("company_id");
    
    // Clear session storage for companyName
    sessionStorage.removeItem("companyName");

    // Optionally clear API authorization header (if using Axios)
    delete API.defaults.headers.common["Authorization"];

    // Navigate to login page
    navigate("/login");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Top Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#2196f3', zIndex: 1201 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">Welcome, {companyName || "Guest"}</Typography>
          <Button 
            color="inherit" 
            sx={{ textTransform: 'uppercase' }} 
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Error Display (if any) */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ m: 2 }} 
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Main Content Wrapper */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Side Navigation */}
        <Box
          sx={{
            width: 240,
            backgroundColor: '#fff',
            borderRight: '1px solid #ddd',
            overflowY: 'auto',
            flexShrink: 0,
          }}
        >
          <List>
            <ListItem
              button
              selected={tabIndex === 0}
              onClick={() => handleMenuClick(0)}
            >
              <ListItemIcon>
                <DashboardIcon color={tabIndex === 0 ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>

            <ListItem
              button
              selected={tabIndex === 1}
              onClick={() => handleMenuClick(1)}
            >
              <ListItemIcon>
                <BuildIcon color={tabIndex === 1 ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Manage Services" />
            </ListItem>

            <ListItem
              button
              selected={tabIndex === 2}
              onClick={() => handleMenuClick(2)}
            >
              <ListItemIcon>
                <InventoryIcon color={tabIndex === 2 ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Manage Materials" />
            </ListItem>

            <ListItem
              button
              selected={tabIndex === 3}
              onClick={() => handleMenuClick(3)}
            >
              <ListItemIcon>
                <CalendarIcon color={tabIndex === 3 ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Appointments" />
            </ListItem>

            <ListItem
              button
              selected={tabIndex === 4}
              onClick={() => handleMenuClick(4)}
            >
              <ListItemIcon>
                <DescriptionIcon color={tabIndex === 4 ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Documents" />
            </ListItem>

            <ListItem
              button
              selected={tabIndex === 5}
              onClick={() => handleMenuClick(5)}
            >
              <ListItemIcon>
                <SettingsIcon color={tabIndex === 5 ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Profile Settings" />
            </ListItem>

            <ListItem
              button
              selected={tabIndex === 6}
              onClick={() => handleMenuClick(6)}
            >
              <ListItemIcon>
                <BusinessIcon color={tabIndex === 6 ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Upload Company Details" />
            </ListItem>

            <ListItem
              button
              selected={tabIndex === 7}
              onClick={() => handleMenuClick(7)}
            >
              <ListItemIcon>
                <AssignmentIcon color={tabIndex === 7 ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Inquiries" />
            </ListItem>
          </List>
        </Box>

        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            backgroundColor: '#f5f5f5',
            p: 2,
            position: 'relative',
          }}
        >
          <Container
            sx={{
              py: 3,
              maxWidth: '100% !important',
            }}
          >
            {tabIndex === 0 && (
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Paper
                      sx={{
                        p: 3,
                        '&:hover': { boxShadow: 3 },
                        transition: 'box-shadow 0.3s',
                      }}
                    >
                      <Typography color="textSecondary">Total Services</Typography>
                      <Typography
                        variant="h4"
                        color="#2196f3"
                        sx={{ mt: 1 }}
                      >
                        10
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper
                      sx={{
                        p: 3,
                        '&:hover': { boxShadow: 3 },
                        transition: 'box-shadow 0.3s',
                      }}
                    >
                      <Typography color="textSecondary">
                        Pending Appointments
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ mt: 1, color: '#e91e63' }}
                      >
                        5
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper
                      sx={{
                        p: 3,
                        '&:hover': { boxShadow: 3 },
                        transition: 'box-shadow 0.3s',
                      }}
                    >
                      <Typography color="textSecondary">
                        Total Revenue
                      </Typography>
                      <Typography variant="h4" sx={{ mt: 1 }}>
                        RS. 50,000
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Box mt={4}>
                  <Typography variant="h6" gutterBottom>
                    Revenue and Appointments Analytics
                  </Typography>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="body2">
                      Analytics data is currently unavailable.
                    </Typography>
                  </Paper>
                </Box>

                <Box mt={4}>
                  <Typography variant="h6" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                          backgroundColor: '#2196f3',
                          textTransform: 'uppercase',
                          '&:hover': { backgroundColor: '#1976d2' },
                        }}
                        onClick={() => handleMenuClick(1)}
                      >
                        + Add New Service
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                          backgroundColor: '#2196f3',
                          textTransform: 'uppercase',
                          '&:hover': { backgroundColor: '#1976d2' },
                        }}
                        onClick={() => handleMenuClick(2)}
                      >
                        + Add New Material
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<CalendarIcon />}
                        sx={{
                          backgroundColor: '#2196f3',
                          textTransform: 'uppercase',
                          '&:hover': { backgroundColor: '#1976d2' },
                        }}
                        onClick={() => handleMenuClick(3)}
                      >
                        □ View Appointments
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<DescriptionIcon />}
                        sx={{
                          backgroundColor: '#2196f3',
                          textTransform: 'uppercase',
                          '&:hover': { backgroundColor: '#1976d2' },
                        }}
                        onClick={() => handleMenuClick(4)}
                      >
                        □ Generate Document
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                <Box mt={4}>
                  <Typography variant="h6" gutterBottom>
                    Notifications
                  </Typography>
                  <Paper sx={{ p: 2 }}>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <CalendarIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Upcoming Appointment: Site Inspection on 12th Feb, 2025"
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          <WarningIcon color="warning" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Low Stock Alert: Cement stock below threshold."
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Recent Service Added: Residential Construction Service."
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Box>
              </Box>
            )}

            {tabIndex === 1 && <ServicesManagement />}
            {tabIndex === 2 && <MaterialsManagement />}
            {tabIndex === 3 && <Appointments />}
            {tabIndex === 4 && <Documents />}
            {tabIndex === 5 && <ProfileSettings />}
            {tabIndex === 6 && <CompanyUploadForm onSubmit={handleFormSubmit} />}
            {tabIndex === 7 && <InquiriesList inquiries={inquiries.length > 0 ? inquiries : undefined} />}
          </Container>
        </Box>

        {tabIndex === 0 && (
          <Box
            sx={{
              width: 300,
              backgroundColor: '#f0f0f0',
              borderLeft: '1px solid #ddd',
              p: 2,
              position: 'sticky',
              right: 0,
              top: 64,
              bottom: 0,
              overflowY: 'auto',
              zIndex: 1000,
              height: 'calc(100vh - 64px)',
              boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CompanyDashboard;