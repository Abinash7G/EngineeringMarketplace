import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { 
  Container, 
  Typography, 
  Box, 
  Button,
  CircularProgress 
} from "@mui/material";

const EmailConfirmation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let isMounted = true;
  
    const confirmEmail = async () => {
      try {
        const response = await API.get(`/api/confirm-email/${token}/`);
        if (isMounted) {
          setMessage(response.data.message || "Email successfully confirmed!");
          setStatus(response.data.status || "verified");
        }
      } catch (error) {
        if (isMounted) {
          const errorMessage =
            error.response?.data?.error || "Invalid or expired token.";
          setMessage(errorMessage);
          setStatus("error");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
  
    confirmEmail();
  
    return () => {
      isMounted = false; // Prevent state updates on unmounted components
    };
  }, [token]);
  

  const handleLoginClick = () => {
    navigate('/login');
  };

  if (isLoading) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px'
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const isSuccess = status === 'verified' || status === 'already_verified';

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 4,
          p: 3,
          textAlign: "center",
          backgroundColor: isSuccess ? "#e8f5e9" : "#ffebee",
          borderRadius: 2,
          boxShadow: 1
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          color={isSuccess ? "success" : "error"}
          gutterBottom
        >
          {isSuccess ? "Email Verification" : "Verification Failed"}
        </Typography>
        <Typography 
          color={isSuccess ? "success" : "error"} 
          gutterBottom
          sx={{ mb: 2 }}
        >
          {message}
        </Typography>
        {isSuccess && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleLoginClick}
            sx={{ mt: 2 }}
          >
            Go to Login
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default EmailConfirmation;
