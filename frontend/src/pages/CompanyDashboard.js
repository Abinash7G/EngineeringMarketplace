import React from "react";
import { Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import Sidebar from "../components/Sidebar";

const CompanyDashboard = () => {
  const companyName = "TechBuild Co."; // Replace with dynamic data
  const clientRequests = [
    { id: 1, client: "ABC Corp", request: "Blueprint Review", status: "Pending" },
    { id: 2, client: "XYZ Ltd", request: "Material Selection", status: "Completed" },
  ];
  const projectProgress = [
    { id: 1, project: "Office Building", milestone: "50% Completed" },
    { id: 2, project: "Factory Renovation", milestone: "20% Completed" },
  ];
  const services = ["Survey Instrument Rental", "Engineering Consulting", "Building Construction"];

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f4f4" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flex: 1, padding: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Hello, {companyName}!
        </Typography>

        {/* Overview Cards */}
        <Grid container spacing={3} sx={{ marginBottom: "20px" }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Active Services</Typography>
                <Typography variant="h4" color="primary">{services.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Client Requests</Typography>
                <Typography variant="h4" color="primary">{clientRequests.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Projects in Progress</Typography>
                <Typography variant="h4" color="primary">{projectProgress.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Client Request Log */}
        <Typography variant="h5" gutterBottom>Client Request Log</Typography>
        <TableContainer component={Paper} sx={{ marginBottom: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Request</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.client}</TableCell>
                  <TableCell>{request.request}</TableCell>
                  <TableCell>{request.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Project Progress */}
        <Typography variant="h5" gutterBottom>Project Progress</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Milestone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectProgress.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.id}</TableCell>
                  <TableCell>{project.project}</TableCell>
                  <TableCell>{project.milestone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default CompanyDashboard;
