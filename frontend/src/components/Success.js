// src/components/Success.jsx
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const transaction_uuid = params.get("refId"); // eSewa returns transaction_uuid as refId
      const total_amount = params.get("amount"); // Amount returned by eSewa

      if (transaction_uuid && total_amount) {
        try {
          await API.post("/api/verify-esewa-payment/", {
            transaction_uuid,
            total_amount,
          });
          alert("Payment verified successfully!");
          navigate("/orders");
        } catch (error) {
          console.error("Payment verification failed:", error);
          alert("Failed to verify payment. Please contact support.");
          navigate("/failure");
        }
      }
    };

    verifyPayment();
  }, [location, navigate]);

  return (
    <div className="container text-center">
      <h1>Payment Successful!</h1>
      <p>Thank you for your payment. Redirecting to your orders...</p>
    </div>
  );
};

export default Success;