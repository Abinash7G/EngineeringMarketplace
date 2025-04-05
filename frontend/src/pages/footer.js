import React from "react";
import { Box, Container, Button, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "#333", color: "white", padding: "20px" }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mb: 2 }}>
          <Button href="/terms" sx={{ color: "white", textTransform: "none" }}>
            Terms and Conditions
          </Button>
          <Button href="/about" sx={{ color: "white", textTransform: "none" }}>
            About Us
          </Button>
        </Box>
        <Typography variant="body2" sx={{ textAlign: "center" }}>
          © {new Date().getFullYear()} Engineering Construction Marketplace. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;