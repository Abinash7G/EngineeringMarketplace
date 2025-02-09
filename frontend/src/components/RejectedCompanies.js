import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar"; // Import your existing Sidebar
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

const RejectedCompanies = () => {
  const [rejectedCompanies, setRejectedCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch ALL companies, then filter by is_rejected
    API.get("/company-registration-list/")
      .then((response) => {
        const allCompanies = response.data;
        const rejected = allCompanies.filter((c) => c.is_rejected);
        setRejectedCompanies(rejected);
      })
      .catch((err) => {
        console.error("Error fetching companies:", err);
        setError("Failed to load rejected companies.");
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
      {/* Include the Sidebar on the left */}
      <Sidebar />

      {/* Main content area on the right */}
      <Box sx={{ flex: 1, overflowY: "auto", padding: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Rejected Companies
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
              {rejectedCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>{company.id}</TableCell>
                  <TableCell>{company.company_name}</TableCell>
                  <TableCell>{company.company_email}</TableCell>
                </TableRow>
              ))}

              {rejectedCompanies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No rejected companies found.
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

export default RejectedCompanies;
