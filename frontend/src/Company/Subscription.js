import React, { useState } from "react";
import { Box, Typography, Button, Grid, Paper, Alert } from "@mui/material";
import API from "../services/api";

const Subscription = ({ companyId, onLogout }) => {
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    { name: "Monthly", price: "RS. 500", duration: "30 days" },
    { name: "Quarterly", price: "RS. 1200", duration: "90 days" },
    { name: "Yearly", price: "RS. 4500", duration: "365 days" },
  ];

  const handleSubscribe = async (plan) => {
    try {
      const response = await API.post(`/subscribe/${companyId}/`, {
        plan: plan.name.toLowerCase(),
      });
      if (response.status === 200) {
        window.location.reload(); // Refresh to update subscription status
      }
    } catch (err) {
      setError("Failed to subscribe. Please try again.");
      console.error("Subscription error:", err);
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 900,
        mx: "auto",
        mt: 4,
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{
          fontWeight: "bold",
          color: "#333",
          mb: 4,
        }}
      >
        Choose Your Subscription Plan
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} justifyContent="center">
        {plans.map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan.name}>
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                border: selectedPlan === plan.name ? "2px solid #2196f3" : "2px solid #ddd",
                borderRadius: 2,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                },
                backgroundColor: "#fff",
              }}
              onClick={() => setSelectedPlan(plan.name)}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#555",
                  mb: 2,
                }}
              >
                {plan.name}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: "#2196f3",
                  fontWeight: "bold",
                  mb: 1,
                }}
              >
                {plan.price}
              </Typography>
              <Typography
                sx={{
                  color: "#777",
                  mb: 3,
                }}
              >
                {plan.duration}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#2196f3",
                  "&:hover": { backgroundColor: "#1976d2" },
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  px: 4,
                  py: 1,
                  borderRadius: 1,
                }}
                onClick={() => handleSubscribe(plan)}
              >
                Subscribe
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 5, textAlign: "center" }}>
        <Button
          variant="outlined"
          sx={{
            borderColor: "#e91e63",
            color: "#e91e63",
            textTransform: "uppercase",
            fontWeight: "bold",
            "&:hover": {
              borderColor: "#d81b60",
              color: "#d81b60",
              backgroundColor: "rgba(233, 30, 99, 0.04)",
            },
          }}
          onClick={onLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Subscription;