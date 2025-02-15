import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";

const RentVerificationAdmin = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    id: null,
    status: "",
  });

  // Fetch verification requests
  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  const fetchVerificationRequests = () => {
    axios
      .get("http://localhost:8000/api/rent-verification/list/?status=pending")
      .then((response) => {
        console.log("API Response:", response.data);
        setVerifications(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setErrorMessage("Failed to load verification requests.");
        setLoading(false);
      });
  };

  const handleStatusChange = (id, status) => {
    setConfirmDialog({ open: true, id, status });
  };

  const confirmStatusChange = () => {
    axios
      .put(`http://localhost:8000/api/rent-verification/${confirmDialog.id}/`, {
        status: confirmDialog.status,
      })
      .then((response) => {
        setVerifications((prevVerifications) =>
          prevVerifications.map((item) =>
            item.id === confirmDialog.id ? { ...item, status: response.data.status } : item
          )
        );
        setSuccessMessage(
          `Request ${confirmDialog.status === "verified" ? "approved ✅" : "rejected ❌"} successfully.`
        );
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        setErrorMessage("Failed to update verification status.");
      })
      .finally(() => {
        setConfirmDialog({ open: false, id: null, status: "" });
      });
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          padding: "20px",
          backgroundColor: "#f8f9fa",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" gutterBottom style={{ marginBottom: "10px" }}>
          Rent Verification Requests
        </Typography>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        {loading ? (
          <CircularProgress style={{ margin: "auto" }} />
        ) : verifications.length === 0 ? (
          <Typography variant="h6" align="center" color="textSecondary">
            No Pending Verifications
          </Typography>
        ) : (
          <TableContainer component={Paper} style={{ marginTop: "0px", width: "100%" }}>
            <Table>
              <TableHead style={{ backgroundColor: "#e0e0e0" }}>
                <TableRow>
                  <TableCell><b>Name</b></TableCell>
                  <TableCell><b>Email</b></TableCell>
                  <TableCell><b>Phone</b></TableCell>
                  <TableCell><b>Address</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Images</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {verifications.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.full_name || "N/A"}</TableCell>
                    <TableCell>{item.email || "N/A"}</TableCell>
                    <TableCell>{item.phone || "N/A"}</TableCell>
                    <TableCell>{item.address || "N/A"}</TableCell>
                    <TableCell>
                      {item.status === "pending" ? (
                        <ErrorOutlineIcon color="warning" />
                      ) : item.status === "verified" ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <CloseIcon color="error" />
                      )}
                    </TableCell>
                    <TableCell>
                      {item.images && item.images.length > 0 ? (
                        item.images.map((img, index) => (
                          <IconButton key={index} onClick={() => handleImageClick(img.image)}>
                            <VisibilityIcon />
                          </IconButton>
                        ))
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No Images
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.status === "pending" && (
                        <>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleStatusChange(item.id, "verified")}
                            sx={{ marginRight: 1 }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleStatusChange(item.id, "rejected")}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </main>

      {/* Dialog for image preview */}
      <Dialog open={!!selectedImage} onClose={() => setSelectedImage(null)}>
        <DialogTitle>Image Preview</DialogTitle>
        <DialogContent>
          {selectedImage && <img src={selectedImage} alt="Preview" style={{ width: "100%" }} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedImage(null)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, id: null, status: "" })}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          Are you sure you want to {confirmDialog.status === "verified" ? "approve" : "reject"} this request?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, id: null, status: "" })} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmStatusChange} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RentVerificationAdmin;
