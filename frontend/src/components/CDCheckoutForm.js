import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import KhaltiPayments from "./KhaltiButton";

const CDCheckoutForm = ({ buyingItems, rentingItems, cartTotal, onProceed }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [verifiedDetails, setVerifiedDetails] = useState({
    fullName: "",
    contactNumber: "",
    address: "",
  });
  const [showKhalti, setShowKhalti] = useState(false);

  // Buying info
  const [buyingForm, setBuyingForm] = useState({
    contactNumber: "",
    deliveryLocation: "",
  });

  // Renting info (only renting-specific fields)
  const [rentingForm, setRentingForm] = useState({
    surveyType: "",
    rentingDays: 1,
    dateNeeded: "",
  });

  // Calculated prices
  const [totalPrice, setTotalPrice] = useState(cartTotal);
  const [rentingPrice, setRentingPrice] = useState(0);

  useEffect(() => {
    // Calculate initial renting price for default renting days
    if (rentingItems.length > 0) {
      const defaultRentingPrice = rentingItems.reduce(
        (total, item) => total + item.price * rentingForm.rentingDays,
        0
      );
      setRentingPrice(defaultRentingPrice);
      setTotalPrice(cartTotal + defaultRentingPrice);
    }

    const fetchVerificationData = async () => {
      try {
        const response = await API.get("/api/rent-verification/user/");
        setVerificationStatus(response.data.status);
        // Pre-fill verified details
        setVerifiedDetails({
          fullName: response.data.full_name || "",
          contactNumber: response.data.phone || "",
          address: response.data.address || "",
        });
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setVerificationStatus("not_found");
        } else {
          console.error("Error fetching verification status:", error);
        }
      }
    };

    fetchVerificationData();
  }, [cartTotal, rentingItems, rentingForm.rentingDays]);

  const handleRentingDaysChange = (e) => {
    const days = parseInt(e.target.value, 10) || 1; // Default to 1 if invalid
    setRentingForm({ ...rentingForm, rentingDays: days });

    const newRentingPrice = rentingItems.reduce(
      (total, item) => total + item.price * days,
      0
    );
    setRentingPrice(newRentingPrice);
    setTotalPrice(cartTotal + newRentingPrice);
  };

  const steps = rentingItems.length > 0 ? ["Verification Check", "Details", "Payment"] : ["Details", "Payment"];

  const handleNext = () => {
    console.log("Renting Form State:", rentingForm); // Debugging log
    if (activeStep === 0 && rentingItems.length > 0) {
      if (verificationStatus !== "verified") {
        alert("You need to verify your profile to rent items.");
        navigate("/rent-verification");
        return;
      }
    }
    if (activeStep === steps.length - 2) {
      // Validate form before proceeding to payment
      if (buyingItems.length > 0 && (!buyingForm.contactNumber || !buyingForm.deliveryLocation)) {
        alert("Please fill all buying details");
        return;
      }
      if (
        rentingItems.length > 0 &&
        (!rentingForm.surveyType.trim() || // Check for non-empty string
          rentingForm.rentingDays <= 0 || // Ensure renting days is positive
          !rentingForm.dateNeeded) // Check for non-empty date
      ) {
        alert("Please fill all renting details");
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handlePaymentSuccess = async () => {
    // Create order after successful payment
    try {
      if (buyingItems.length > 0) {
        await API.post("/api/orders/create/", {
          order_type: "buying",
          items: buyingItems.map((item) => ({
            product_id: item.product_id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total_amount: cartTotal,
          company_id: buyingItems[0].company_id || 1,
          user_id: localStorage.getItem("user_id"),
        });
      }
      if (rentingItems.length > 0) {
        await API.post("/api/orders/create/", {
          order_type: "renting",
          items: rentingItems.map((item) => ({
            product_id: item.product_id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total_amount: rentingPrice,
          company_id: rentingItems[0].company_id || 1,
          user_id: localStorage.getItem("user_id"),
          renting_details: {
            name: verifiedDetails.fullName,
            contactNumber: verifiedDetails.contactNumber,
            address: verifiedDetails.address,
            surveyType: rentingForm.surveyType,
            rentingDays: rentingForm.rentingDays,
            dateNeeded: rentingForm.dateNeeded,
          },
        });
      }
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  const renderStepContent = (step) => {
    if (rentingItems.length > 0 && step === 0) {
      return (
        <Box>
          <Typography variant="h6">Verification Check</Typography>
          {verificationStatus === "verified" ? (
            <Alert severity="success">Your profile is verified!</Alert>
          ) : (
            <Alert severity="warning">
              You need to verify your profile to rent items.{" "}
              <Button onClick={() => navigate("/rent-verification")} color="warning">
                Verify Now
              </Button>
            </Alert>
          )}
        </Box>
      );
    }
    if ((rentingItems.length > 0 && step === 1) || (buyingItems.length > 0 && step === 0)) {
      return (
        <Box>
          {buyingItems.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Buying Details
              </Typography>
              <TextField
                label="Contact Number"
                name="contactNumber"
                value={buyingForm.contactNumber}
                onChange={(e) =>
                  setBuyingForm({ ...buyingForm, [e.target.name]: e.target.value })
                }
                margin="dense"
                required
                size="small"
                sx={{ width: "100%" }}
              />
              <TextField
                label="Delivery Location"
                name="deliveryLocation"
                value={buyingForm.deliveryLocation}
                onChange={(e) =>
                  setBuyingForm({ ...buyingForm, [e.target.name]: e.target.value })
                }
                margin="dense"
                required
                size="small"
                sx={{ width: "100%" }}
              />
            </Box>
          )}

          {rentingItems.length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Renting Details
              </Typography>
              <TextField
                label="Name"
                value={verifiedDetails.fullName}
                margin="dense"
                size="small"
                sx={{ width: "100%" }}
                disabled
              />
              <TextField
                label="Contact Number"
                value={verifiedDetails.contactNumber}
                margin="dense"
                size="small"
                sx={{ width: "100%" }}
                disabled
              />
              <TextField
                label="Address"
                value={verifiedDetails.address}
                margin="dense"
                size="small"
                sx={{ width: "100%" }}
                disabled
              />
              <TextField
                label="Survey Type / Purpose"
                name="surveyType"
                value={rentingForm.surveyType}
                onChange={(e) =>
                  setRentingForm({ ...rentingForm, [e.target.name]: e.target.value })
                }
                margin="dense"
                required
                size="small"
                sx={{ width: "100%" }}
              />
              <TextField
                label="Renting Days"
                name="rentingDays"
                type="number"
                value={rentingForm.rentingDays}
                onChange={handleRentingDaysChange}
                margin="dense"
                required
                size="small"
                sx={{ width: "100%" }}
                inputProps={{ min: 1 }}
              />
              <TextField
                label="Date Needed"
                name="dateNeeded"
                type="date"
                value={rentingForm.dateNeeded}
                onChange={(e) =>
                  setRentingForm({ ...rentingForm, [e.target.name]: e.target.value })
                }
                margin="dense"
                required
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{ width: "100%" }}
              />
            </Box>
          )}
        </Box>
      );
    }
    if (step === steps.length - 1) {
      return (
        <Box>
          <Typography variant="h6">Payment</Typography>
          <Typography variant="h6" sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: "4px" }}>
            Total Renting Price: Rs. {rentingPrice}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1, p: 2, bgcolor: "#f5f5f5", borderRadius: "4px" }}>
            Grand Total Price: Rs. {totalPrice}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <KhaltiPayments totalPrice={totalPrice} onSuccess={handlePaymentSuccess} />
          </Box>
        </Box>
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        height: "100vh",
        padding: "20px",
        overflowY: "auto",
        paddingTop: "10px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px", width: "100%" }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h5"
          sx={{ flex: 1, textAlign: "center", fontWeight: 500, marginLeft: "-40px" }}
        >
          Checkout Form
        </Typography>
      </Box>

      <Paper
        sx={{
          padding: "16px",
          borderRadius: "8px",
          boxShadow: 3,
          width: "90%",
          maxWidth: "500px",
          textAlign: "center",
        }}
      >
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
          >
            {activeStep === steps.length - 2 ? "Proceed to Payment" : "Next"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CDCheckoutForm;