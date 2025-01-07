import React, { useState } from "react";
import { FaUsers, FaTools, FaChartBar, FaBuilding } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Chart from "../components/Chart";
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
} from "@mui/material";

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "ABC Construction",
      email: "contact@abcconstruction.com",
      role: "Construction Company",
      subscription: "Monthly",
      safetyTraining: true,
      feedback: "Excellent service but needs faster response time.",
    },
    {
      id: 2,
      name: "XYZ Supplies",
      email: "sales@xyzsupplies.com",
      role: "Material Supplier",
      subscription: "Quarterly",
      safetyTraining: false,
      feedback: "Reliable but room for improvement in material quality.",
    },
  ]);

  const approveCompany = (id) => {
    alert(`Approved company with ID: ${id}`);
    setCompanies(companies.filter((company) => company.id !== id));
  };

  const rejectCompany = (id) => {
    alert(`Rejected company with ID: ${id}`);
    setCompanies(companies.filter((company) => company.id !== id));
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flex: 1, padding: "20px" }}>
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

        {/* Company Management */}
        <Box sx={{ marginBottom: "20px" }}>
          <Typography variant="h5" sx={{ marginBottom: "10px" }}>
            Company Management
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Subscription</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>{company.id}</TableCell>
                    <TableCell>{company.name}</TableCell>
                    <TableCell>{company.email}</TableCell>
                    <TableCell>{company.role}</TableCell>
                    <TableCell>{company.subscription}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{ marginRight: "5px" }}
                        onClick={() => approveCompany(company.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{ marginRight: "5px" }}
                        onClick={() => rejectCompany(company.id)}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="contained"
                        color="info"
                        size="small"
                        onClick={() => alert(`Viewing details for ${company.name}`)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Safety Training */}
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
                {companies
                  .filter((company) => company.safetyTraining)
                  .map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>{company.id}</TableCell>
                      <TableCell>{company.name}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => alert(`Requested training for ${company.name}`)}
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

        {/* Feedback and Disputes */}
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
              <Typography variant="h6">{company.name}</Typography>
              <Typography variant="body1">{company.feedback}</Typography>
              <Button
                variant="contained"
                color="warning"
                sx={{ marginTop: "10px" }}
                onClick={() => alert(`Resolved issue for ${company.name}`)}
              >
                Resolve Dispute
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
