import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const transactionId = params.get("transaction_id");
      const paymentStatus = params.get("status");

      if (transactionId && paymentStatus === "Completed") {
        try {
          const response = await axios.get(`http://localhost:8000/api/payment-success-callback/?transaction_id=${transactionId}`);
          setStatus(response.data.message);
        } catch (error) {
          console.error("Error verifying payment:", error);
          setStatus("Payment verification failed");
        }
      } else {
        setStatus("Payment failed or canceled");
      }
    };

    verifyPayment();
  }, [params]);

  return (
    <div>
      <h2>Payment Status</h2>
      <p>{status ? status : "Verifying payment..."}</p>
    </div>
  );
};

export default PaymentSuccess;
