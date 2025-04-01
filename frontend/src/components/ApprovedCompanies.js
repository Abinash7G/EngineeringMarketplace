// ApprovedCompanies.jsx
// If you want the same sidebar layout as your main admin page,
// just wrap the <Sidebar /> and your table in the same layout structure.

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar"; // same Sidebar component
import API from "../services/api";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";

const ApprovedCompanies = () => {
  const [approvedCompanies, setApprovedCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch ALL companies, then filter approved
    API.get("/company-registration-list/")
      .then((response) => {
        const all = response.data;
        const approved = all.filter((c) => c.is_approved);
        setApprovedCompanies(approved);
      })
      .catch((err) => {
        console.error("Error fetching companies:", err);
        setError("Failed to load approved companies.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 5 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Include the same sidebar here */}
      <Sidebar />

      {/* Main content area */}
      <Box sx={{ flex: 1, overflowY: "auto", padding: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Approved Companies
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Company Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                

              </TableRow>
            </TableHead>
            <TableBody>
              {approvedCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>{company.id}</TableCell>
                  <TableCell>{company.company_name}</TableCell>
                  <TableCell>{company.company_email}</TableCell>
                  
                </TableRow>
              ))}
              {approvedCompanies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No approved companies.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ApprovedCompanies;
