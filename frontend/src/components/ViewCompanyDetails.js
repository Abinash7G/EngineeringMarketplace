import React, { useEffect, useState } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Divider,
  Grid,
  Avatar,
} from "@mui/material";
import { CheckCircleOutline, CancelOutlined } from "@mui/icons-material";

const ViewCompanyDetails = () => {
  const { id } = useParams();            // Get company ID from the route (e.g., /view-company-details/8)
  const navigate = useNavigate();
  const [companyDetails, setCompanyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the full details of a single company
    API.get(`/company-registration/${id}/`)
      .then((response) => {
        setCompanyDetails(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching company details:", err.response || err.message);
        setError("Failed to fetch company details. Please try again.");
        setLoading(false);
      });
  }, [id]);

  // Approve button handler
  const handleApprove = () => {
    API.post(`/approve-company/${id}/`)
      .then(() => {
        alert("Company approved successfully!");
        // After approving, go back to the admin dashboard
        navigate("/admin-dashboard");
      })
      .catch((err) => {
        console.error("Error approving company:", err.response || err.message);
        alert("Failed to approve the company.");
      });
  };

  // Reject button handler
  const handleReject = () => {
    API.post(`/reject-company/${id}/`)
      .then(() => {
        alert("Company rejected successfully!");
        // After rejecting, go back to the admin dashboard
        navigate("/admin-dashboard");
      })
      .catch((err) => {
        console.error("Error rejecting company:", err.response || err.message);
        alert("Failed to reject the company.");
      });
  };

  // While data is loading
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If there's an error (e.g. company not found)
  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }
  
  // Render the company details page
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar /> {/* Ensure Sidebar is included in the return statement */}

      <Box sx={{ padding: "40px", width: "100%" }}>
        <Paper
          sx={{
            padding: "30px",
            boxShadow: 3,
            borderRadius: 3,
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <Typography
              variant="h4"
              sx={{ color: "#1976d2", fontWeight: "bold" }}
            >
              Company Details
            </Typography>
            <Avatar
              sx={{
                bgcolor: "#1976d2",
                width: 50,
                height: 50,
                fontSize: "1.5rem",
                textTransform: "uppercase",
              }}
            >
              {companyDetails.company_name.charAt(0)}
            </Avatar>
          </Box>
          <Divider sx={{ marginBottom: "20px" }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">
                <b>Company Name:</b>
              </Typography>
              <Typography variant="body1">{companyDetails.company_name}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h6">
                <b>Email:</b>
              </Typography>
              <Typography variant="body1">{companyDetails.company_email}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h6">
                <b>Location:</b>
              </Typography>
              <Typography variant="body1">{companyDetails.location}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h6">
                <b>Registration ID:</b>
              </Typography>
              <Typography variant="body1">
                {companyDetails.company_registration_id}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ margin: "30px 0" }} />

          {/* Approve / Reject Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            <Button
              variant="contained"
              color="success"
              size="large"
              startIcon={<CheckCircleOutline />}
              onClick={handleApprove}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              size="large"
              startIcon={<CancelOutlined />}
              onClick={handleReject}
            >
              Reject
            </Button>
          </Box>
        </Paper>

        {/* Back to Dashboard Button */}
        <Box sx={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/admin")}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ViewCompanyDetails;
