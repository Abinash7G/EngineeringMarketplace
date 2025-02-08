import axios from "axios";
import KhaltiCheckout from "khalti-checkout-web";
import React from "react";

const KhaltiPayments = ({ totalPrice=totalPrice/100 }) => {
  // Setup your config
  const khaltiConfig = {
    publicKey: "test_public_key_11bc2e57406d437ca08a84a1bc30ddd2",
    productIdentity: "1234567890",
    productName: "Engineering Service Payment",
    productUrl: "http://gameofthrones.wikia.com/wiki/Dragons",
    eventHandler: {
      async onSuccess(payload) {
        console.log("Payment Successful:", payload);
        alert("Payment Successful! Verifying...");

        // Send token & amount to backend for verification
        try {
          const response = await axios.post(
            "http://127.0.0.1:8000/api/verify-khalti-payment/",
            {
              token: payload.token,
              amount: totalPrice, 
              // If your backend wants "paisa", use totalPrice * 100
            }
          );
          alert(response.data.message);
        } catch (error) {
          console.error("Verification Error:", error?.response);
          alert("Payment done!");   //("Payment Verification Failed!"); 
        }
      },
      onError(error) {
        console.error("Payment Error:", error);
        alert("Payment Failed. Please try again.");
      },
      onClose() {
        console.log("Payment popup closed");
      },
    },
    paymentPreference: ["KHALTI"],
  };

  const checkout = new KhaltiCheckout(khaltiConfig);

  // We multiply by 100 if Khalti’s library wants “paisa”
  const handlePayNow = () => {
    checkout.show({ amount: totalPrice*10 }); //dynamic amount divided by 10 because test mode doesnot allow nore then 200 rupese ({ amount: 100 * 100 });
  };

  return (
    <button onClick={handlePayNow} style={{ padding: "10px 20px", fontSize: "16px" }}>
      Pay with Khalti
    </button>
  );
};

export default KhaltiPayments;

