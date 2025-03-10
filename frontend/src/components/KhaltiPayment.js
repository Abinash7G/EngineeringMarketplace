import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';


const KhaltiPayment = () => {
  const [loading, setLoading] = useState(false);
     const location = useLocation();
    const{amount, email, phone, name} = location.state || {NaN};

  const initiatePayment = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/api/initiate-khalti-payment/", {
        amount, // Amount in paisa
        name: name,
        email: email,
        phone: phone,
      });
      console.log(amount, email, phone, name)
      console.log(response)

      if (response.data.payment_url) {
        window.location.href = response.data.payment_url; // Redirect user to Khalti payment page
      } else {
        alert("Error initiating payment");
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Khalti Payment Integration</h2>
      <p>Amount: {amount / 100} NPR</p>
      <button onClick={initiatePayment} disabled={loading}>
        {loading ? "Processing..." : "Pay with Khalti"}
      </button>
    </div>
  );
};

export default KhaltiPayment;
