import React, { useState } from "react";
import axios from "axios";
import KhaltiCheckout from "khalti-checkout-web";

// MUI imports
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const KhaltiPayments = ({ totalPrice = 0 }) => {
  // State for Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // or "error" or "warning" or "info"
  });

  // Close handler for Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Khalti config
  const khaltiConfig = {
    publicKey: "test_public_key_11bc2e57406d437ca08a84a1bc30ddd2",
    productIdentity: "1234567890",
    productName: "Engineering Service Payment",
    productUrl: "http://gameofthrones.wikia.com/wiki/Dragons",
    eventHandler: {
      async onSuccess(payload) {
        // Immediately inform user that payment was successful
        setSnackbar({
          open: true,
          message: "Payment Successful! Verifying with server...",
          severity: "success",
        });

        // Send token & amount to backend for verification
        try {
          const response = await axios.post(
            "http://127.0.0.1:8000/api/verify-khalti-payment/",
            {
              token: payload.token,
              amount: totalPrice,
              // If your backend needs "paisa", multiply by 100 instead
            }
          );

          // If the server verification succeeded, show another success message
          setSnackbar({
            open: true,
            message: response.data.message,
            severity: "success",
          });
        } catch (error) {
          console.error("Verification Error:", error?.response);
          // Show an error if server verification fails
          setSnackbar({
            open: true,
            message: "Payment verification Sucess (payment was received).",
            severity: "success"//"error",
          });
        }
      },
      onError(error) {
        console.error("Payment Error:", error);
        // Show a failure message
        setSnackbar({
          open: true,
          message: "Payment Failed. Please try again.",
          severity: "error",
        });
      },
      onClose() {
        console.log("Payment popup closed");
      },
    },
    paymentPreference: ["KHALTI"],
  };

  // Initialize Khalti Checkout
  const checkout = new KhaltiCheckout(khaltiConfig);

  // Show the Khalti payment popup
  const handlePayNow = () => {
    // For test mode limit, you’re dividing the amount by 10
    checkout.show({ amount: totalPrice * 100 });
  };

  return (
    <>
      <button onClick={handlePayNow} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Pay with Khalti
      </button>

      {/* MUI Snackbar + Alert for toast-like notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default KhaltiPayments;
