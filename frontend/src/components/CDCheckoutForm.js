import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  FormLabel,
  IconButton,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  fetchUserProfile
} from "../services/api";

import KhaltiPayments from "./KhaltiButton"; // <-- Import the separate Khalti component
const CDCheckoutForm = ({ buyingItems, rentingItems, cartTotal, onProceed }) => {
  const navigate = useNavigate();
// Buying info
  const [buyingForm, setBuyingForm] = useState({
    contactNumber: "",
    deliveryLocation: "",
  });

  const [userdata, setUserData] = useState({})

  // Renting info
  const [rentingForm, setRentingForm] = useState({
    name: "",
    contactNumber: "",
    address: "",
    surveyType: "",
    rentingDays: 1, // Default to 0 day
    dateNeeded: "",
    idFile: null,
  });
// Calculated prices
  const [totalPrice, setTotalPrice] = useState(cartTotal);
  const [rentingPrice, setRentingPrice] = useState(0);
 // Logged-in user (if needed)
 

 // Whether to show the Khalti button after form is validated
 const [showKhalti, setShowKhalti] = useState(false);


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

     const loadInitialData = async () => {
          try {
    
            // Load user data
            const userData = await fetchUserProfile();
            setUserData(userData);
          } catch (error) {
            console.error("Error loading initial data:", error);
          }
        };
    
      loadInitialData();
    
  }, [cartTotal, rentingItems, rentingForm.rentingDays]);

  const handleRentingDaysChange = (e) => {
    const days = parseInt(e.target.value, 10) || 0;
    setRentingForm({ ...rentingForm, rentingDays: days });

    // Recalculate renting price based on days
    const newRentingPrice = rentingItems.reduce(
      (total, item) => total + item.price * days,
      0
    );
    setRentingPrice(newRentingPrice);
    setTotalPrice(cartTotal + newRentingPrice);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowKhalti(false); // reset
  
    if (buyingItems.length > 0 && (!buyingForm.contactNumber || !buyingForm.deliveryLocation)) {
      alert("Please fill all buying details");
      return;
    }
  
    if (
      rentingItems.length > 0 &&
      (!rentingForm.name ||
        !rentingForm.contactNumber ||
        !rentingForm.address ||
        !rentingForm.surveyType ||
        !rentingForm.rentingDays ||
        !rentingForm.dateNeeded ||
        !rentingForm.idFile)
    ) {
      alert("Please fill all renting details");
      return;
    }
  
    // Commenting out backend call for now
    /*
    try {
      const payload = {
        customerName: rentingForm.name,
        contactNumber: rentingForm.contactNumber,
        deliveryLocation: rentingForm.address || buyingForm.deliveryLocation,
        totalAmount: totalPrice,
      };
  
      console.log("Payload:", payload); // Debugging log
  
      // Send data to backend to create PaymentIntent
      const response = await API.post('/api/payment-intent/', {
        totalAmount: totalPrice, // Grand total from the form
      });
  
      const clientSecret = response.data.clientSecret;
  
    } catch (error) {
      console.error("Error creating PaymentIntent:", error);
      alert("Unable to process payment. Please try again.");
    }
    */
  
    // Navigate directly to Esewa payment page
        
    // navigate("/khalti",{
    //   state: { 
    //     amount: totalPrice*100,
    //     name: userdata.username,
    //     email: userdata.email,
    //     phone: "987652356265",
    //     buyingForm,
    //     rentingForm,
    //     buyingItems,
    //     rentingItems
    // }

    // });
    setShowKhalti(true);
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
      {/* Back Button */}
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

      {/* Form Container */}
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
        {/* Buying Details */}
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

        {/* Renting Details */}
        {rentingItems.length > 0 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Renting Details
            </Typography>
            <TextField
              label="Name"
              name="name"
              value={rentingForm.name}
              onChange={(e) =>
                setRentingForm({ ...rentingForm, [e.target.name]: e.target.value })
              }
              margin="dense"
              required
              size="small"
              sx={{ width: "100%" }}
            />
            <TextField
              label="Contact Number"
              name="contactNumber"
              value={rentingForm.contactNumber}
              onChange={(e) =>
                setRentingForm({ ...rentingForm, [e.target.name]: e.target.value })
              }
              margin="dense"
              required
              size="small"
              sx={{ width: "100%" }}
            />
            <TextField
              label="Address"
              name="address"
              value={rentingForm.address}
              onChange={(e) =>
                setRentingForm({ ...rentingForm, [e.target.name]: e.target.value })
              }
              margin="dense"
              required
              size="small"
              sx={{ width: "100%" }}
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
            <FormControl margin="dense" sx={{ width: "100%", textAlign: "left" }}>
              <FormLabel>Upload National ID / Driving License</FormLabel>
              <input
                type="file"
                onChange={(e) =>
                  setRentingForm({ ...rentingForm, idFile: e.target.files[0] })
                }
                required
                style={{ marginTop: "8px" }}
              />
            </FormControl>
          </Box>
        )}

        {/* Pricing Section */}
        <Typography
          variant="h6"
          sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: "4px" }}
        >
          Total Renting Price: Rs. {rentingPrice}
        </Typography>
        <Typography
          variant="h6"
          sx={{ mt: 1, p: 2, bgcolor: "#f5f5f5", borderRadius: "4px" }}
        >
          Grand Total Price: Rs. {totalPrice}
        </Typography>

        {/* Proceed to Payment Button */}
        {!showKhalti ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            sx={{ mt: 2 }}
          >
            Pay with Khalti
          </Button>
        ) : (
          // Once validated, show the KhaltiPayments component
          <Box sx={{ mt: 2 }}>
            <KhaltiPayments totalPrice={totalPrice} />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default CDCheckoutForm;
