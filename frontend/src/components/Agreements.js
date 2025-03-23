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
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { Visibility, UploadFile } from "@mui/icons-material";
import axios from "axios";

const Agreements = ({ userType }) => {
  const [agreements, setAgreements] = useState([]);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [signedFile, setSignedFile] = useState(null);
  const [loading, setLoading] = useState(true); // Added for loading state

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const endpoint = userType === "company" ? "/company-agreements/" : "/client-agreements/";
        const response = await axios.get(`http://127.0.0.1:8000${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAgreements(response.data);
      } catch (err) {
        console.error("Failed to fetch agreements", err);
        alert("Failed to load agreements. Please try again.");
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };
    fetchAgreements();
  }, [userType]);

  const handleOpenUploadDialog = (agreement) => {
    setSelectedAgreement(agreement);
    setOpenUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
    setSelectedAgreement(null);
    setSignedFile(null);
  };

  const handleFileChange = (e) => {
    setSignedFile(e.target.files[0]);
  };

  const handleUploadSignedAgreement = async () => {
    if (!signedFile) {
      alert("Please select a file to upload.");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("signed_document", signedFile);
      formData.append("status", "Signed");

      await axios.patch(
        `http://127.0.0.1:8000/api/agreements/${selectedAgreement.id}/update/`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      const endpoint = userType === "company" ? "/company-agreements/" : "/client-agreements/";
      const response = await axios.get(`http://127.0.0.1:8000${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgreements(response.data);
      handleCloseUploadDialog();
      alert("Signed agreement uploaded successfully!");
    } catch (err) {
      console.error("Failed to upload signed agreement", err);
      alert("Failed to upload signed agreement.");
    }
  };

  const handleViewAgreement = (documentUrl) => {
    if (documentUrl) {
      window.open(documentUrl, "_blank");
    } else {
      alert("No document available to view.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Agreements
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: "block", mx: "auto" }} />
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table aria-label="agreements table">
            <TableHead sx={{ bgcolor: "primary.main" }}>
              <TableRow>
                {["Client Name", "Service", "Status", "Created At", "Original Agreement", "Signed Agreement", "Actions"].map(
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
                  <TableCell colSpan={7} align="center">
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
                      <IconButton
                        color="primary"
                        onClick={() => handleViewAgreement(agreement.document)}
                        title="View original agreement"
                      >
                        <Visibility />
                      </IconButton>
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
                    <TableCell>
                      {(userType === "company" || userType === "client") && (
                        <IconButton
                          color="secondary"
                          onClick={() => handleOpenUploadDialog(agreement)}
                          title="Upload signed agreement"
                        >
                          <UploadFile />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog}>
        <DialogTitle>Upload Signed Agreement</DialogTitle>
        <DialogContent>
          <input type="file" onChange={handleFileChange} accept="application/pdf" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUploadSignedAgreement} color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Agreements;