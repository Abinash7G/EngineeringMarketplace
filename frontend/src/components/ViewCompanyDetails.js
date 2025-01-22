import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const { id } = useParams(); // Get company ID from the route
  const navigate = useNavigate();
  const [companyDetails, setCompanyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch company details
    API.get(`/company-registration/${id}/`)
      .then((response) => {
        setCompanyDetails(response.data); // Set company details
        setLoading(false); // Stop loading
      })
      .catch((err) => {
        console.error("Error fetching company details:", err.response || err.message);
        setError("Failed to fetch company details. Please try again.");
        setLoading(false);
      });
  }, [id]);

  const handleApprove = () => {
    API.post(`/approve-company/${id}/`)
      .then(() => {
        alert("Company approved successfully!");
        navigate("/admin-dashboard");
      })
      .catch((err) => {
        console.error("Error approving company:", err.response || err.message);
        alert("Failed to approve the company.");
      });
  };

  const handleReject = () => {
    API.post(`/reject-company/${id}/`)
      .then(() => {
        alert("Company rejected successfully!");
        navigate("/admin-dashboard");
      })
      .catch((err) => {
        console.error("Error rejecting company:", err.response || err.message);
        alert("Failed to reject the company.");
      });
  };

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

  return (
    <Box sx={{ padding: "40px" }}>
      {/* Company Details Card */}
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
            <Typography variant="body1">
              {companyDetails.company_name}
            </Typography>
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

          <Grid item xs={12}>
            <Typography variant="h6">
              <b>Services Provided:</b>
            </Typography>
            <Typography variant="body1">
              {companyDetails.services_provided.length > 0
                ? companyDetails.services_provided
                    .map((service) => service.name)
                    .join(", ")
                : "No services provided"}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ margin: "30px 0" }} />

        {/* Action Buttons */}
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
  );
};

export default ViewCompanyDetails;
