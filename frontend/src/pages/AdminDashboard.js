import React, { useState, useEffect } from "react";  
import API from "../services/api";
import { FaUsers, FaTools, FaChartBar, FaBuilding } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Chart from "../components/Chart";
import { useNavigate } from "react-router-dom";
import ViewCompanyDetails from "../components/ViewCompanyDetails";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
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
  DialogActions,
} from "@mui/material";

const AdminDashboard = () => {
  const navigate = useNavigate();
  // State variables for companies and safety training companies.
  const [companies, setCompanies] = useState([]); // Unapproved companies
  const [safetyCompanies, setSafetyCompanies] = useState([]); // Approved companies with Safety Training
  const [selectedCompany, setSelectedCompany] = useState(null); // Details for dialog
  const [openDialog, setOpenDialog] = useState(false); // Dialog open state

  // Fetch all companies when the component mounts.
  useEffect(() => {
    API.get("/company-registration-list/")
      .then((response) => {
        const allCompanies = response.data;

        // Filter out unapproved companies.
        const unapprovedCompanies = allCompanies.filter(
          (company) => !company.is_approved && !company.is_rejected
        );

        // Filter approved companies that include Safety Training module (assumed id = 5).
        const filteredSafetyCompanies = allCompanies.filter(
          (company) =>
            company.is_approved && company.services_provided.includes(5)
        );

        setCompanies(unapprovedCompanies);
        setSafetyCompanies(filteredSafetyCompanies);
      })
      .catch((error) => console.error("Error fetching companies:", error));
  }, []);

  // Close the details dialog.
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCompany(null);
  };

  // Approve a company.
  const approveCompany = (id) => {
    API.post(`/approve-company/${id}/`)
      .then(() => {
        // Remove the company from the unapproved list.
        setCompanies(companies.filter((company) => company.id !== id));
        alert(`Company with ID: ${id} approved successfully!`);
      })
      .catch((error) => console.error("Error approving company:", error));
  };

  // Reject a company.
  const rejectCompany = (id) => {
    API.post(`/reject-company/${id}/`)
      .then(() => {
        // Remove the company from the unapproved list.
        setCompanies(companies.filter((company) => company.id !== id));
        alert(`Company with ID: ${id} rejected successfully!`);
      })
      .catch((error) => console.error("Error rejecting company:", error));
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: "20px" }}>
          Admin Dashboard
        </Typography>

        {/* Overview Cards */}
        <Grid container spacing={3} sx={{ marginBottom: "20px" }}>
          {[
            { title: "Total Users", value: "1200", icon: <FaUsers /> },
            { title: "Active Services", value: "350", icon: <FaTools /> },
            { title: "Total Companies", value: "200", icon: <FaBuilding /> },
            { title: "Total Revenue", value: "$45,000", icon: <FaChartBar /> },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {item.icon}
                  <Box>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="h4" color="primary">
                      {item.value}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Analytics Charts */}
        <Box sx={{ marginBottom: "20px" }}>
          <Typography variant="h5">Analytics</Typography>
          <Chart />
        </Box>

        {/* Company Management Table */}
        <Box sx={{ marginBottom: "20px" }}>
          <Typography variant="h5">Company Management</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>{company.id}</TableCell>
                    <TableCell>{company.company_name}</TableCell>
                    <TableCell>{company.company_email}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="info"
                        onClick={() => navigate(`/view-company-details/${company.id}`)}
                        sx={{ marginRight: "10px" }}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => approveCompany(company.id)}
                        sx={{ marginRight: "10px" }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => rejectCompany(company.id)}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Safety Training Requests Table */}
        <Box sx={{ marginBottom: "20px" }}>
          <Typography variant="h5">Safety Training Requests</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Request Training</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {safetyCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>{company.id}</TableCell>
                    <TableCell>{company.company_name}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          alert(`Requested training for ${company.company_name}`)
                        }
                      >
                        Request Training
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Feedback and Disputes Section */}
        <Box sx={{ marginBottom: "20px" }}>
          <Typography variant="h5">Feedback & Disputes</Typography>
          {companies.map((company) => (
            <Box
              key={company.id}
              sx={{
                backgroundColor: "white",
                padding: "10px",
                borderRadius: "5px",
                boxShadow: 1,
                marginBottom: "10px",
              }}
            >
              <Typography variant="h6">{company.company_name}</Typography>
              <Typography variant="body1">No disputes reported.</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Company Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Company Registration Details</DialogTitle>
        <DialogContent>
          {selectedCompany ? (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body1">
                <strong>Name:</strong> {selectedCompany.company_name}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {selectedCompany.company_email}
              </Typography>
              <Typography variant="body1">
                <strong>Location:</strong> {selectedCompany.location}
              </Typography>
              <Typography variant="body1">
                <strong>Registration ID:</strong> {selectedCompany.company_registration_id}
              </Typography>
              {selectedCompany.registration_date && (
                <Typography variant="body1">
                  <strong>Registration Date:</strong> {selectedCompany.registration_date}
                </Typography>
              )}
              {selectedCompany.registration_status && (
                <Typography variant="body1">
                  <strong>Status:</strong> {selectedCompany.registration_status}
                </Typography>
              )}
              <Typography variant="body1">
                <strong>Services Provided:</strong>{" "}
                {selectedCompany.services_provided.join(", ")}
              </Typography>
              {/* Add any additional registration details here */}
            </Box>
          ) : (
            <Typography variant="body1">No details available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
