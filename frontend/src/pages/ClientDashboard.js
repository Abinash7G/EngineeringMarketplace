import React from "react";
import { Box, Typography } from "@mui/material";

const ClientDashboard = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Hello, Welcome to the Page!
      </Typography>
      <Typography variant="body1">
        We're glad to have you here. Explore the available options and manage your account easily.
      </Typography>
    </Box>
  );
};

export default ClientDashboard;
