// // src/components/CDCheckoutForm.jsx
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Paper,
//   IconButton,
//   Stepper,
//   Step,
//   StepLabel,
//   Alert,
//   FormHelperText,
//   Checkbox,
//   FormControlLabel,
// } from "@mui/material";
// import { ArrowBack } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";
// import KhaltiPayments from "./KhaltiButton";

// const CDCheckoutForm = ({ buyingItems, rentingItems, cartTotal }) => {
//   const navigate = useNavigate();
//   const [activeStep, setActiveStep] = useState(0);
//   const [verificationStatus, setVerificationStatus] = useState(null);
//   const [userDetails, setUserDetails] = useState({
//     fullName: "",
//     contactNumber: "",
//     email: "",
//   });

//   const [formData, setFormData] = useState({
//     deliveryLocation: "",
//     surveyType: "",
//     rentingDays: 1,
//     dateNeeded: "",
//     payNow: false,
//   });
//   const [errors, setErrors] = useState({
//     deliveryLocation: false,
//     rentingDays: false,
//     dateNeeded: false,
//   });

//   const [totalPrice, setTotalPrice] = useState(cartTotal);
//   const [rentingPrice, setRentingPrice] = useState(0);

//   useEffect(() => {
//     if (rentingItems.length > 0) {
//       const defaultRentingPrice = rentingItems.reduce(
//         (total, item) => total + item.price * formData.rentingDays,
//         0
//       );
//       setRentingPrice(defaultRentingPrice);
//       setTotalPrice(cartTotal + defaultRentingPrice);
//     }

//     const fetchData = async () => {
//       try {
//         const profileResponse = await API.get("/api/user-profile/");
//         setUserDetails({
//           fullName: `${profileResponse.data.first_name} ${profileResponse.data.last_name}`.trim() || "",
//           contactNumber: profileResponse.data.phone_number || "",
//           email: profileResponse.data.email || "",
//         });

//         if (rentingItems.length > 0) {
//           const verificationResponse = await API.get("/api/rent-verification/user/");
//           setVerificationStatus(verificationResponse.data.status);
//         } else {
//           setVerificationStatus("not_required");
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         if (error.response && error.response.status === 404) {
//           setVerificationStatus("not_found");
//         } else {
//           setVerificationStatus("error");
//         }
//       }
//     };

//     fetchData();
//   }, [cartTotal, rentingItems, formData.rentingDays]);

//   const handleRentingDaysChange = (e) => {
//     const days = parseInt(e.target.value, 10) || 1;
//     setFormData({ ...formData, rentingDays: days });
//     setErrors({ ...errors, rentingDays: days <= 0 });
//     const newRentingPrice = rentingItems.reduce(
//       (total, item) => total + item.price * days,
//       0
//     );
//     setRentingPrice(newRentingPrice);
//     setTotalPrice(cartTotal + newRentingPrice);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleCheckboxChange = (e) => {
//     setFormData({ ...formData, payNow: e.target.checked });
//   };

//   const steps = rentingItems.length > 0 ? ["Verification Check", "Details", "Payment"] : ["Details", "Payment"];

//   const handleNext = () => {
//     if (activeStep === 0 && rentingItems.length > 0) {
//       if (verificationStatus !== "verified") {
//         alert("You need to verify your profile to rent items.");
//         navigate("/rent-verification");
//         return;
//       }
//     }
//     if (activeStep === steps.length - 2) {
//       const validationErrors = {
//         deliveryLocation: buyingItems.length > 0 && !formData.deliveryLocation.trim(),
//         rentingDays: rentingItems.length > 0 && formData.rentingDays <= 0,
//         dateNeeded: rentingItems.length > 0 && !formData.dateNeeded,
//       };
//       setErrors(validationErrors);

//       const hasErrors = Object.values(validationErrors).some((error) => error);
//       if (hasErrors) {
//         const errorMessages = [];
//         if (validationErrors.deliveryLocation) errorMessages.push("Delivery Location");
//         if (validationErrors.rentingDays) errorMessages.push("Renting Days");
//         if (validationErrors.dateNeeded) errorMessages.push("Date Needed");
//         alert(`Please fill the following required fields: ${errorMessages.join(", ")}`);
//         return;
//       }
//     }
//     setActiveStep((prev) => prev + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prev) => prev - 1);
//   };

//   const handlePaymentSuccess = async (paymentData) => {
//     try {
//       const payload = {
//         user_id: localStorage.getItem("user_id"),
//         buying_items: buyingItems.map((item) => ({
//           product_id: item.product_id,
//           name: item.name,
//           quantity: item.quantity,
//           price: item.price,
//           company_id: item.company_id || 1,
//         })),
//         renting_items: rentingItems.map((item) => ({
//           product_id: item.product_id,
//           name: item.name,
//           quantity: item.quantity,
//           price: item.price,
//           company_id: item.company_id || 1,
//         })),
//         billing_details: buyingItems.length > 0 ? {
//           fullName: userDetails.fullName,
//           email: userDetails.email,
//           contactNumber: userDetails.contactNumber,
//           deliveryLocation: formData.deliveryLocation,
//         } : null,
//         renting_details: rentingItems.length > 0 ? {
//           name: userDetails.fullName,
//           contactNumber: userDetails.contactNumber,
//           surveyType: formData.surveyType,
//           rentingDays: formData.rentingDays,
//           dateNeeded: formData.dateNeeded,
//         } : null,
//         payment_data: paymentData,
//       };

//       await API.post("/api/orders/create/", payload);
//       alert("Order placed successfully! Check your orders.");
//       navigate("/orders");
//     } catch (error) {
//       console.error("Error creating order:", error);
//       alert("Failed to create order. Please try again.");
//     }
//   };

//   const renderStepContent = (step) => {
//     if (rentingItems.length > 0 && step === 0) {
//       return (
//         <Box>
//           <Typography variant="h6">Verification Check</Typography>
//           {verificationStatus === "verified" ? (
//             <Alert severity="success">Your profile is verified!</Alert>
//           ) : verificationStatus === "not_found" ? (
//             <Alert severity="warning">
//               Verify your profile to rent items.{" "}
//               <Button onClick={() => navigate("/rent-verification")} color="warning">
//                 Verify Now
//               </Button>
//             </Alert>
//           ) : verificationStatus === "error" ? (
//             <Alert severity="error">Error checking status. Try again.</Alert>
//           ) : (
//             <Alert severity="info">Checking status...</Alert>
//           )}
//         </Box>
//       );
//     }
//     if ((rentingItems.length > 0 && step === 1) || (buyingItems.length > 0 && step === 0)) {
//       return (
//         <Box>
//           <Box sx={{ mb: 2 }}>
//             <Typography variant="h6" sx={{ mb: 1 }}>User Details</Typography>
//             <TextField label="Full Name" value={userDetails.fullName} margin="dense" size="small" sx={{ width: "100%" }} disabled />
//             <TextField label="Contact Number" value={userDetails.contactNumber} margin="dense" size="small" sx={{ width: "100%" }} disabled />
//             <TextField label="Email" value={userDetails.email} margin="dense" size="small" sx={{ width: "100%" }} disabled />
//           </Box>

//           {buyingItems.length > 0 && (
//             <Box sx={{ mb: 2 }}>
//               <Typography variant="h6" sx={{ mb: 1 }}>Delivery Details</Typography>
//               <TextField
//                 label="Delivery Location"
//                 name="deliveryLocation"
//                 value={formData.deliveryLocation}
//                 onChange={handleInputChange}
//                 margin="dense"
//                 required
//                 size="small"
//                 sx={{ width: "100%" }}
//                 error={errors.deliveryLocation}
//                 helperText={errors.deliveryLocation && "Required"}
//               />
//             </Box>
//           )}

//           {rentingItems.length > 0 && (
//             <Box>
//               <Typography variant="h6" sx={{ mb: 1 }}>Renting Details</Typography>
//               <TextField
//                 label="Survey Type / Purpose"
//                 name="surveyType"
//                 value={formData.surveyType}
//                 onChange={handleInputChange}
//                 margin="dense"
//                 size="small"
//                 sx={{ width: "100%" }}
//                 helperText="Optional"
//               />
//               <TextField
//                 label="Renting Days"
//                 name="rentingDays"
//                 type="number"
//                 value={formData.rentingDays}
//                 onChange={handleRentingDaysChange}
//                 margin="dense"
//                 required
//                 size="small"
//                 sx={{ width: "100%" }}
//                 inputProps={{ min: 1 }}
//                 error={errors.rentingDays}
//                 helperText={errors.rentingDays && "Must be at least 1"}
//               />
//               <TextField
//                 label="Date Needed"
//                 name="dateNeeded"
//                 type="date"
//                 value={formData.dateNeeded}
//                 onChange={handleInputChange}
//                 margin="dense"
//                 required
//                 size="small"
//                 InputLabelProps={{ shrink: true }}
//                 sx={{ width: "100%" }}
//                 error={errors.dateNeeded}
//                 helperText={errors.dateNeeded && "Required"}
//               />
//               <FormControlLabel
//                 control={<Checkbox checked={formData.payNow} onChange={handleCheckboxChange} name="payNow" />}
//                 label="Pay now and update details later"
//               />
//             </Box>
//           )}
//         </Box>
//       );
//     }
//     if (step === steps.length - 1) {
//       return (
//         <Box>
//           <Typography variant="h6">Payment</Typography>
//           <Typography variant="h6" sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: "4px" }}>
//             Total Renting Price: Rs. {rentingPrice}
//           </Typography>
//           <Typography variant="h6" sx={{ mt: 1, p: 2, bgcolor: "#f5f5f5", borderRadius: "4px" }}>
//             Grand Total Price: Rs. {totalPrice}
//           </Typography>
//           <Box sx={{ mt: 2 }}>
//             <KhaltiPayments totalPrice={totalPrice} onSuccess={handlePaymentSuccess} />
//           </Box>
//         </Box>
//       );
//     }
//   };

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", height: "100vh", padding: "20px", overflowY: "auto", paddingTop: "10px" }}>
//       <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px", width: "100%" }}>
//         <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
//         <Typography variant="h5" sx={{ flex: 1, textAlign: "center", fontWeight: 500, marginLeft: "-40px" }}>Checkout Form</Typography>
//       </Box>

//       <Paper sx={{ padding: "16px", borderRadius: "8px", boxShadow: 3, width: "90%", maxWidth: "500px", textAlign: "center" }}>
//         <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
//           {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
//         </Stepper>

//         {renderStepContent(activeStep)}

//         <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
//           <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>Back</Button>
//           <Button variant="contained" color="primary" onClick={handleNext} disabled={activeStep === steps.length - 1}>
//             {activeStep === steps.length - 2 ? "Proceed to Payment" : "Next"}
//           </Button>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default CDCheckoutForm;

// src/components/CDCheckoutForm.jsx


// src/components/CDCheckoutForm.jsx// src/components/CDCheckoutForm.jsx


// src/components/CDCheckoutForm.jsx

// src/components/CDCheckoutForm.jsx
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
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import CryptoJS from "crypto-js";
import ReCAPTCHA from "react-google-recaptcha";
import { v4 as uuidv4 } from "uuid";
import KhaltiPayments from "./KhaltiButton"; // Ensure path is correct

const CDCheckoutForm = ({ buyingItems, rentingItems, cartTotal }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    contactNumber: "",
    email: "",
  });

  const [formData, setFormData] = useState({
    deliveryLocation: "",
    surveyType: "",
    rentingDays: 1,
    dateNeeded: "",
    payNow: false,
  });
  const [errors, setErrors] = useState({
    deliveryLocation: false,
    rentingDays: false,
    dateNeeded: false,
  });

  const [totalPrice, setTotalPrice] = useState(cartTotal || 0);
  const [rentingPrice, setRentingPrice] = useState(0);
  const [transactionUuid, setTransactionUuid] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("esewa");

  useEffect(() => {
    if (rentingItems.length > 0) {
      const defaultRentingPrice = rentingItems.reduce(
        (total, item) => total + (parseFloat(item.price) || 0) * formData.rentingDays,
        0
      );
      setRentingPrice(defaultRentingPrice);
      setTotalPrice((cartTotal || 0) + defaultRentingPrice);
    } else {
      setTotalPrice(cartTotal || 0);
    }

    const fetchData = async () => {
      try {
        const profileResponse = await API.get("/api/user-profile/");
        setUserDetails({
          fullName: `${profileResponse.data.first_name} ${profileResponse.data.last_name}`.trim() || "",
          contactNumber: profileResponse.data.phone_number || "",
          email: profileResponse.data.email || "",
        });

        if (rentingItems.length > 0) {
          const verificationResponse = await API.get("/api/rent-verification/user/");
          setVerificationStatus(verificationResponse.data.status);
        } else {
          setVerificationStatus("not_required");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response && error.response.status === 404) {
          setVerificationStatus("not_found");
        } else {
          setVerificationStatus("error");
        }
      }
    };

    const generateBookingId = () => {
      return `BID-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    };
    setBookingId(generateBookingId());

    fetchData();
  }, [cartTotal, rentingItems, formData.rentingDays]);

  const handleRentingDaysChange = (e) => {
    const days = parseInt(e.target.value, 10) || 1;
    setFormData({ ...formData, rentingDays: days });
    setErrors({ ...errors, rentingDays: days <= 0 });
    const newRentingPrice = rentingItems.reduce(
      (total, item) => total + (parseFloat(item.price) || 0) * days,
      0
    );
    setRentingPrice(newRentingPrice);
    setTotalPrice((cartTotal || 0) + newRentingPrice);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, payNow: e.target.checked });
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
    console.log("reCAPTCHA Token Captured:", token);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
    setRecaptchaToken(""); // Reset reCAPTCHA token when switching methods
  };

  const steps = rentingItems.length > 0 ? ["Verification Check", "Details", "Payment"] : ["Details", "Payment"];

  const handleNext = () => {
    if (activeStep === 0 && rentingItems.length > 0) {
      if (verificationStatus !== "verified") {
        alert("You need to verify your profile to rent items.");
        navigate("/rent-verification");
        return;
      }
    }
    if (activeStep === steps.length - 2) {
      const validationErrors = {
        deliveryLocation: buyingItems.length > 0 && !formData.deliveryLocation.trim(),
        rentingDays: rentingItems.length > 0 && formData.rentingDays <= 0,
        dateNeeded: rentingItems.length > 0 && !formData.dateNeeded,
      };
      setErrors(validationErrors);

      const hasErrors = Object.values(validationErrors).some((error) => error);
      if (hasErrors) {
        const errorMessages = [];
        if (validationErrors.deliveryLocation) errorMessages.push("Delivery Location");
        if (validationErrors.rentingDays) errorMessages.push("Renting Days");
        if (validationErrors.dateNeeded) errorMessages.push("Date Needed");
        alert(`Please fill the following required fields: ${errorMessages.join(", ")}`);
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleCreateOrder = async () => {
    try {
      if (!buyingItems.length && !rentingItems.length) {
        throw new Error("At least one buying or renting item is required");
      }

      const payload = {
        user_id: localStorage.getItem("user_id"),
        buying_items: buyingItems.map((item) => ({
          product_id: item.product_id,
          name: item.name,
          quantity: parseInt(item.quantity, 10),
          price: parseFloat(item.price),
          company_id: item.company || item.company_id || 1,
        })),
        renting_items: rentingItems.map((item) => ({
          product_id: item.product_id,
          name: item.name,
          quantity: parseInt(item.quantity, 10),
          price: parseFloat(item.price),
          company_id: item.company || item.company_id || 1,
        })),
        billing_details: buyingItems.length > 0 ? {
          fullName: userDetails.fullName || "",
          email: userDetails.email || "",
          contactNumber: userDetails.contactNumber || "",
          deliveryLocation: formData.deliveryLocation || "",
        } : null,
        renting_details: rentingItems.length > 0 ? {
          name: userDetails.fullName || "",
          contactNumber: userDetails.contactNumber || "",
          surveyType: formData.surveyType || "",
          rentingDays: parseInt(formData.rentingDays, 10) || 1,
          dateNeeded: formData.dateNeeded || "",
        } : null,
        bookingId: bookingId,
        transaction_uuid: uuidv4(),
      };

      console.log("Sending payload to create order:", payload);
      const response = await API.post("/api/orders/create/", payload);
      console.log("Order Creation Response:", response.data);
      setTransactionUuid(response.data.transaction_uuid);
      return response.data.transaction_uuid;
    } catch (error) {
      console.error("Error creating order:", error.response ? error.response.data : error.message);
      alert(`Failed to create order: ${error.response ? error.response.data.error : error.message}`);
      throw error;
    }
  };

  const handleEsewaPayment = async () => {
    try {
      if (!recaptchaToken) {
        throw new Error("Please complete the reCAPTCHA challenge.");
      }

      setTransactionUuid("");
      const transaction_uuid = await handleCreateOrder();
      if (!transaction_uuid) {
        throw new Error("Transaction UUID is missing");
      }

      const productCode = process.env.REACT_APP_ESEWA_PRODUCT_CODE || "EPAYTEST";
      const formattedTotalPrice = Number(totalPrice).toFixed(2);

      const dataString = `total_amount=${formattedTotalPrice},transaction_uuid=${transaction_uuid},product_code=${productCode}`;
      console.log("Debug Data String:", dataString);

      const esewaFormData = {
        amount: formattedTotalPrice,
        tax_amount: "0.00",
        total_amount: formattedTotalPrice,
        transaction_uuid: transaction_uuid,
        product_code: productCode,
        product_service_charge: "0.00",
        product_delivery_charge: "0.00",
        success_url: process.env.REACT_APP_SUCCESS_URL || "http://localhost:3000/success",
        failure_url: process.env.REACT_APP_FAILURE_URL || "http://localhost:3000/failure",
        signed_field_names: "total_amount,transaction_uuid,product_code",
        "g-recaptcha-response": recaptchaToken,
        bookingId: bookingId,
        signature: "",
      };

      const secretKey = process.env.REACT_APP_ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
      const hash = CryptoJS.HmacSHA256(dataString, secretKey);
      esewaFormData.signature = CryptoJS.enc.Base64.stringify(hash);

      console.log("Esewa Form Data:", esewaFormData);

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
      form.target = "_blank";

      Object.entries(esewaFormData).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch (error) {
      console.error("Error initiating eSewa payment:", error.message);
      alert("Failed to initiate payment. Please complete reCAPTCHA or check the console for details.");
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      const payload = {
        user_id: localStorage.getItem("user_id"),
        buying_items: buyingItems.map((item) => ({
          product_id: item.product_id,
          name: item.name,
          quantity: parseInt(item.quantity, 10),
          price: parseFloat(item.price),
          company_id: item.company || item.company_id || 1,
        })),
        renting_items: rentingItems.map((item) => ({
          product_id: item.product_id,
          name: item.name,
          quantity: parseInt(item.quantity, 10),
          price: parseFloat(item.price),
          company_id: item.company || item.company_id || 1,
        })),
        billing_details: buyingItems.length > 0 ? {
          fullName: userDetails.fullName || "",
          email: userDetails.email || "",
          contactNumber: userDetails.contactNumber || "",
          deliveryLocation: formData.deliveryLocation || "",
        } : null,
        renting_details: rentingItems.length > 0 ? {
          name: userDetails.fullName || "",
          contactNumber: userDetails.contactNumber || "",
          surveyType: formData.surveyType || "",
          rentingDays: parseInt(formData.rentingDays, 10) || 1,
          dateNeeded: formData.dateNeeded || "",
        } : null,
        payment_data: paymentData,
        bookingId: bookingId,
      };

      await API.post("/api/orders/create/", payload);
      alert("Order placed successfully! Check your orders.");
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
          ) : verificationStatus === "not_found" ? (
            <Alert severity="warning">
              Verify your profile to rent items.{" "}
              <Button onClick={() => navigate("/rent-verification")} color="warning">
                Verify Now
              </Button>
            </Alert>
          ) : verificationStatus === "error" ? (
            <Alert severity="error">Error checking status. Try again.</Alert>
          ) : (
            <Alert severity="info">Checking status...</Alert>
          )}
        </Box>
      );
    }
    if ((rentingItems.length > 0 && step === 1) || (buyingItems.length > 0 && step === 0)) {
      return (
        <Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>User Details</Typography>
            <TextField label="Full Name" value={userDetails.fullName} margin="dense" size="small" sx={{ width: "100%" }} disabled />
            <TextField label="Contact Number" value={userDetails.contactNumber} margin="dense" size="small" sx={{ width: "100%" }} disabled />
            <TextField label="Email" value={userDetails.email} margin="dense" size="small" sx={{ width: "100%" }} disabled />
          </Box>

          {buyingItems.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Delivery Details</Typography>
              <TextField
                label="Delivery Location"
                name="deliveryLocation"
                value={formData.deliveryLocation}
                onChange={handleInputChange}
                margin="dense"
                required
                size="small"
                sx={{ width: "100%" }}
                error={errors.deliveryLocation}
                helperText={errors.deliveryLocation && "Required"}
              />
            </Box>
          )}

          {rentingItems.length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>Renting Details</Typography>
              <TextField
                label="Survey Type / Purpose"
                name="surveyType"
                value={formData.surveyType}
                onChange={handleInputChange}
                margin="dense"
                size="small"
                sx={{ width: "100%" }}
                helperText="Optional"
              />
              <TextField
                label="Renting Days"
                name="rentingDays"
                type="number"
                value={formData.rentingDays}
                onChange={handleRentingDaysChange}
                margin="dense"
                required
                size="small"
                sx={{ width: "100%" }}
                inputProps={{ min: 1 }}
                error={errors.rentingDays}
                helperText={errors.rentingDays && "Must be at least 1"}
              />
              <TextField
                label="Date Needed"
                name="dateNeeded"
                type="date"
                value={formData.dateNeeded}
                onChange={handleInputChange}
                margin="dense"
                required
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{ width: "100%" }}
                error={errors.dateNeeded}
                helperText={errors.dateNeeded && "Required"}
              />
              <FormControlLabel
                control={<Checkbox checked={formData.payNow} onChange={handleCheckboxChange} name="payNow" />}
                label="Pay now and update details later"
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
          <Box sx={{ mt: 2, mb: 2 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Select Payment Method</FormLabel>
              <RadioGroup
                row
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
                name="payment-method"
              >
                <FormControlLabel value="esewa" control={<Radio />} label="Pay with eSewa" />
                <FormControlLabel value="khalti" control={<Radio />} label="Pay with Khalti" />
              </RadioGroup>
            </FormControl>
          </Box>
          {paymentMethod === "esewa" ? (
            <>
              <Box sx={{ mt: 2, mb: 2 }}>
                <ReCAPTCHA
                  sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                  onChange={handleRecaptchaChange}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEsewaPayment}
                  disabled={!recaptchaToken}
                >
                  Pay with eSewa
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ mt: 2 }}>
              <KhaltiPayments
                totalPrice={totalPrice}
                onSuccess={(paymentData) => handlePaymentSuccess({ ...paymentData, method: "khalti" })}
              />
            </Box>
          )}
        </Box>
      );
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", height: "100vh", padding: "20px", overflowY: "auto", paddingTop: "10px" }}>
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px", width: "100%" }}>
        <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
        <Typography variant="h5" sx={{ flex: 1, textAlign: "center", fontWeight: 500, marginLeft: "-40px" }}>Checkout Form</Typography>
      </Box>

      <Paper sx={{ padding: "16px", borderRadius: "8px", boxShadow: 3, width: "90%", maxWidth: "500px", textAlign: "center" }}>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
        </Stepper>

        {renderStepContent(activeStep)}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>Back</Button>
          <Button variant="contained" color="primary" onClick={handleNext} disabled={activeStep === steps.length - 1}>
            {activeStep === steps.length - 2 ? "Proceed to Payment" : "Next"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CDCheckoutForm;