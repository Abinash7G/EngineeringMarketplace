import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import axios from "axios";

const CDAgreements = () => {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          alert("Please log in to view agreements.");
          return;
        }

        const response = await axios.get(`http://127.0.0.1:8000/client-agreements/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAgreements(response.data);
      } catch (err) {
        console.error("Failed to fetch agreements", err);
        alert("Failed to load agreements. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgreements();
  }, []);

  const handleViewAgreement = async (documentUrl) => {
    if (!documentUrl) {
      alert("No document available to view");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Please login to view documents");
        return;
      }

      // Fetch PDF with authentication
      const response = await axios.get(documentUrl, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      // Create Blob with proper MIME type
      const blob = new Blob([response.data], { type: "application/pdf" });
      const viewUrl = window.URL.createObjectURL(blob);

      // Open the PDF in a new tab
      window.open(viewUrl, "_blank");

      // Cleanup the temporary URL after a delay to free memory
      setTimeout(() => {
        window.URL.revokeObjectURL(viewUrl);
      }, 10000); // Revoke after 10 seconds
    } catch (error) {
      console.error("Failed to open document:", error);
      if (error.response && error.response.status === 404) {
        alert("Document not found on the server. Please contact support.");
      } else {
        alert("Failed to open document. Please try again.");
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Client Agreements
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: "block", mx: "auto" }} />
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table aria-label="client agreements table">
            <TableHead sx={{ bgcolor: "primary.main" }}>
              <TableRow>
                {["Client Name", "Service", "Status", "Created At", "Original Agreement", "Signed Agreement"].map(
                  (header) => (
                    <TableCell key={header} sx={{ color: "white", fontWeight: "bold" }}>
                      {header}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {agreements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No agreements found
                  </TableCell>
                </TableRow>
              ) : (
                agreements.map((agreement) => (
                  <TableRow key={agreement.id} hover>
                    <TableCell>{agreement.inquiry?.full_name || "N/A"}</TableCell>
                    <TableCell>{agreement.service?.name || "N/A"}</TableCell>
                    <TableCell
                      sx={{
                        color: agreement.status === "Signed" ? "green" : "inherit",
                        fontWeight: agreement.status === "Signed" ? "bold" : "normal",
                      }}
                    >
                      {agreement.status}
                    </TableCell>
                    <TableCell>
                      {new Date(agreement.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      {agreement.document ? (
                        <IconButton
                          color="primary"
                          onClick={() => handleViewAgreement(agreement.document)}
                          title="View original agreement"
                        >
                          <Visibility />
                        </IconButton>
                      ) : (
                        "Not available"
                      )}
                    </TableCell>
                    <TableCell>
                      {agreement.signed_document ? (
                        <IconButton
                          color="success"
                          onClick={() => handleViewAgreement(agreement.signed_document)}
                          title="View signed agreement"
                        >
                          <Visibility />
                        </IconButton>
                      ) : (
                        "Not uploaded"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default CDAgreements;