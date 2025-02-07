import React from "react";
import { Typography, Container, Button } from "@mui/material";

const Documents = () => {
  return (
    <Container>
      <Typography variant="h4">Documents</Typography>
      <Button variant="contained" color="primary">
        Generate New Document
      </Button>
    </Container>
  );
};

export default Documents;
