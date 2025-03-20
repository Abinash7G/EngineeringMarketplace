// import React, { useState, useEffect } from "react";
// import CryptoJS from "crypto-js";
// import ReCAPTCHA from "react-google-recaptcha";
// import { v4 as uuidv4 } from "uuid"; // Import UUID library for unique transaction IDs

// const EsewaPayment = ({ totalAmount }) => {
//   const [formData, setFormData] = useState({
//     amount: totalAmount ? Number(totalAmount).toFixed(2) : "100.00",
//     tax_amount: "0.00",
//     total_amount: totalAmount ? Number(totalAmount).toFixed(2) : "100.00",
//     transaction_uuid: "",
//     product_code: process.env.REACT_APP_ESEWA_PRODUCT_CODE || "EPAYTEST",
//     product_service_charge: "0.00",
//     product_delivery_charge: "0.00",
//     success_url: process.env.REACT_APP_SUCCESS_URL || "http://localhost:3000/success",
//     failure_url: process.env.REACT_APP_FAILURE_URL || "http://localhost:3000/failure",
//     signed_field_names: "total_amount,transaction_uuid,product_code",
//     signature: "",
//     "g-recaptcha-response": "",
//   });

//   const [recaptchaToken, setRecaptchaToken] = useState("");

//   useEffect(() => {
//     // Generate a unique transaction_uuid using UUID
//     const transactionUuid = `TXN-${uuidv4()}`;
//     setFormData((prev) => ({
//       ...prev,
//       transaction_uuid: transactionUuid,
//       amount: totalAmount ? Number(totalAmount).toFixed(2) : "100.00",
//       total_amount: totalAmount ? Number(totalAmount).toFixed(2) : "100.00",
//       "g-recaptcha-response": recaptchaToken,
//     }));
//   }, [totalAmount, recaptchaToken]);

//   useEffect(() => {
//     generateSignature();
//   }, [formData.total_amount, formData.transaction_uuid, formData.product_code]);

//   const generateSignature = () => {
//     const secretKey = process.env.REACT_APP_ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
//     const dataString = `total_amount=${formData.total_amount},transaction_uuid=${formData.transaction_uuid},product_code=${formData.product_code}`;
//     const hash = CryptoJS.HmacSHA256(dataString, secretKey);
//     const signature = CryptoJS.enc.Base64.stringify(hash);
//     setFormData((prev) => ({ ...prev, signature }));
//     console.log("Data String:", dataString);
//     console.log("Generated Signature:", signature);
//   };

//   const handleRecaptchaChange = (token) => {
//     setRecaptchaToken(token);
//     setFormData((prev) => ({ ...prev, "g-recaptcha-response": token }));
//     console.log("reCAPTCHA Token Captured:", token);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!recaptchaToken) {
//       alert("Please complete the reCAPTCHA challenge.");
//       return;
//     }

//     // Generate a new transaction_uuid for each submission to avoid duplicates
//     const newTransactionUuid = `TXN-${uuidv4()}`;
//     setFormData((prev) => ({
//       ...prev,
//       transaction_uuid: newTransactionUuid,
//     }));

//     console.log("Submitting to Endpoint:", "https://rc-epay.esewa.com.np/api/epay/main/v2/form");
//     console.log("Form Data:", { ...formData, transaction_uuid: newTransactionUuid });

//     const form = document.createElement("form");
//     form.method = "POST";
//     form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
//     form.target = "_blank";

//     const updatedFormData = { ...formData, transaction_uuid: newTransactionUuid };
//     Object.entries(updatedFormData).forEach(([key, value]) => {
//       const input = document.createElement("input");
//       input.type = "hidden";
//       input.name = key;
//       input.value = value;
//       form.appendChild(input);
//     });

//     document.body.appendChild(form);
//     form.submit();
//     document.body.removeChild(form);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (name === "total_amount" || name === "transaction_uuid" || name === "product_code") {
//       generateSignature();
//     }
//   };

//   return (
//     <div className="container">
//       <h1 className="text-center mb-4">eSewa Payment Form</h1>
//       <form onSubmit={handleSubmit}>
//         <table style={{ width: "70%" }} align="center">
//           <tr>
//             <td><strong>Parameter</strong></td>
//             <td><strong>Value</strong></td>
//           </tr>
//           <tr>
//             <td>Amount:</td>
//             <td>
//               <input
//                 type="text"
//                 id="amount"
//                 name="amount"
//                 value={formData.amount}
//                 onChange={handleChange}
//                 className="form"
//                 required
//               />
//             </td>
//           </tr>
//           <tr>
//             <td>Tax Amount:</td>
//             <td>
//               <input
//                 type="text"
//                 id="tax_amount"
//                 name="tax_amount"
//                 value={formData.tax_amount}
//                 onChange={handleChange}
//                 className="form"
//                 required
//               />
//             </td>
//           </tr>
//           <tr>
//             <td>Total Amount:</td>
//             <td>
//               <input
//                 type="text"
//                 id="total_amount"
//                 name="total_amount"
//                 value={formData.total_amount}
//                 onChange={handleChange}
//                 className="form"
//                 required
//               />
//             </td>
//           </tr>
//           <tr>
//             <td>Transaction UUID:</td>
//             <td>
//               <input
//                 type="text"
//                 id="transaction_uuid"
//                 name="transaction_uuid"
//                 value={formData.transaction_uuid}
//                 onChange={handleChange}
//                 className="form"
//                 required
//               />
//             </td>
//           </tr>
//           <tr>
//             <td>Product Code:</td>
//             <td>
//               <input
//                 type="text"
//                 id="product_code"
//                 name="product_code"
//                 value={formData.product_code}
//                 onChange={handleChange}
//                 className="form"
//                 required
//               />
//             </td>
//           </tr>
//           <tr>
//             <td>Product Service Charge:</td>
//             <td>
//               <input
//                 type="text"
//                 id="product_service_charge"
//                 name="product_service_charge"
//                 value={formData.product_service_charge}
//                 onChange={handleChange}
//                 className="form"
//                 required
//               />
//             </td>
//           </tr>
//           <tr>
//             <td>Product Delivery Charge:</td>
//             <td>
//               <input
//                 type="text"
//                 id="product_delivery_charge"
//                 name="product_delivery_charge"
//                 value={formData.product_delivery_charge}
//                 onChange={handleChange}
//                 className="form"
//                 required
//               />
//             </td>
//           </tr>
//           <tr>
//             <td>Success URL:</td>
//             <td>
//               <input
//                 type="text"
//                 id="success_url"
//                 name="success_url"
//                 value={formData.success_url}
//                 onChange={handleChange}
//                 className="form"
//                 required
//               />
//             </td>
//           </tr>
//           <tr>
//             <td>Failure URL:</td>
//             <td>
//               <input
//                 type="text"
//                 id="failure_url"
//                 name="failure_url"
//                 value={formData.failure_url}
//                 onChange={handleChange}
//                 className="form"
//                 required
//               />
//             </td>
//           </tr>
//           <tr>
//             <td>Signed Field Names:</td>
//             <td>
//               <input
//                 type="text"
//                 id="signed_field_names"
//                 name="signed_field_names"
//                 value={formData.signed_field_names}
//                 onChange={handleChange}
//                 className="form"
//                 required
//               />
//             </td>
//           </tr>
//           <tr>
//             <td>Signature:</td>
//             <td>
//               <input
//                 type="text"
//                 id="signature"
//                 name="signature"
//                 value={formData.signature}
//                 className="form"
//                 readOnly
//               />
//             </td>
//           </tr>
//           <tr>
//             <td>reCAPTCHA:</td>
//             <td>
//               <ReCAPTCHA
//                 sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
//                 onChange={handleRecaptchaChange}
//               />
//             </td>
//           </tr>
//         </table>
//         <br />
//         <br />
//         <table style={{ width: "50%" }} align="center">
//           <tr>
//             <th>
//               <button type="submit" className="button" disabled={!recaptchaToken}>
//                 Pay with eSewa
//               </button>
//             </th>
//           </tr>
//         </table>
//       </form>
//       <style>
//         {`
//           .form {
//             padding: 8px 25px;
//             font-size: 15px;
//           }
//           .button {
//             padding: 12px 25px;
//             font-size: 24px;
//             text-align: center;
//             cursor: pointer;
//             outline: none;
//             color: #fff;
//             background-color: #4CAF50;
//             border: none;
//             border-radius: 15px;
//             box-shadow: 0 9px #999;
//           }
//           .button:hover {
//             background-color: #3e8e41;
//           }
//           .button:active {
//             background-color: #0000;
//             box-shadow: 0 5px #666;
//             transform: translateY(4px);
//           }
//           .button:disabled {
//             background-color: #cccccc;
//             cursor: not-allowed;
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default EsewaPayment;



import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import ReCAPTCHA from "react-google-recaptcha";
import { v4 as uuidv4 } from "uuid"; // Import UUID library for unique transaction IDs

const EsewaPayment = ({ totalAmount }) => {
  const [formData, setFormData] = useState({
    amount: totalAmount ? Number(totalAmount).toFixed(2) : "100.00",
    tax_amount: "0.00",
    total_amount: totalAmount ? Number(totalAmount).toFixed(2) : "100.00",
    transaction_uuid: "",
    product_code: process.env.REACT_APP_ESEWA_PRODUCT_CODE || "EPAYTEST",
    product_service_charge: "0.00",
    product_delivery_charge: "0.00",
    success_url: process.env.REACT_APP_SUCCESS_URL || "http://localhost:3000/success",
    failure_url: process.env.REACT_APP_FAILURE_URL || "http://localhost:3000/failure",
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: "",
    "g-recaptcha-response": "",
    bookingId: "", // Add bookingId field
  });

  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Generate a unique transaction_uuid using UUID
    const transactionUuid = `TXN-${uuidv4()}`;
    // Generate a unique bookingId (base64 encoded)
    const bookingId = btoa(transactionUuid);
    
    setFormData((prev) => ({
      ...prev,
      transaction_uuid: transactionUuid,
      bookingId: bookingId,
      amount: totalAmount ? Number(totalAmount).toFixed(2) : "100.00",
      total_amount: totalAmount ? Number(totalAmount).toFixed(2) : "100.00",
      "g-recaptcha-response": recaptchaToken,
    }));
  }, [totalAmount, recaptchaToken]);

  useEffect(() => {
    generateSignature();
  }, [formData.total_amount, formData.transaction_uuid, formData.product_code]);

  const generateSignature = () => {
    const secretKey = process.env.REACT_APP_ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
    const dataString = `total_amount=${formData.total_amount},transaction_uuid=${formData.transaction_uuid},product_code=${formData.product_code}`;
    const hash = CryptoJS.HmacSHA256(dataString, secretKey);
    const signature = CryptoJS.enc.Base64.stringify(hash);
    setFormData((prev) => ({ ...prev, signature }));
    console.log("Data String:", dataString);
    console.log("Generated Signature:", signature);
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
    setFormData((prev) => ({ ...prev, "g-recaptcha-response": token }));
    console.log("reCAPTCHA Token Captured:", token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!recaptchaToken) {
      alert("Please complete the reCAPTCHA challenge.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Generate a new transaction_uuid for each submission to avoid duplicates
      const newTransactionUuid = `TXN-${uuidv4()}`;
      // Generate a new bookingId for each submission
      const newBookingId = btoa(newTransactionUuid);
      
      const updatedFormData = {
        ...formData,
        transaction_uuid: newTransactionUuid,
        bookingId: newBookingId,
      };

      console.log("Form Data:", updatedFormData);
      console.log("Login URL:", `https://rc-epay.esewa.com.np/api/epay/login?bookingId=${encodeURIComponent(newBookingId)}`);

      // First, attempt to pre-login with bookingId
      const loginResponse = await fetch(`https://rc-epay.esewa.com.np/api/epay/login?bookingId=${encodeURIComponent(newBookingId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0',
          'Origin': window.location.origin,
        },
        body: JSON.stringify({
          amount: updatedFormData.total_amount,
          productCode: updatedFormData.product_code,
          transactionUuid: newTransactionUuid,
        }),
        credentials: 'include', // Include cookies if needed by eSewa
      });
      
      console.log("Login Response Status:", loginResponse.status);
      
      if (!loginResponse.ok) {
        const errorText = await loginResponse.text();
        console.error("Login Error:", errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          alert("Error initiating payment: " + (errorData.message || "Unknown error"));
        } catch {
          alert("Error initiating payment. Please try again later.");
        }
        
        setIsSubmitting(false);
        return;
      }
      
      // If login was successful, proceed with the form submission
      console.log("Login successful, proceeding to form submission");
      
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
      form.target = "_blank";

      Object.entries(updatedFormData).forEach(([key, value]) => {
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
      console.error("Payment Error:", error);
      alert("Error processing payment: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "total_amount" || name === "transaction_uuid" || name === "product_code") {
      generateSignature();
    }
  };

  return (
    <div className="container">
      <h1 className="text-center mb-4">eSewa Payment Form</h1>
      <form onSubmit={handleSubmit}>
        <table style={{ width: "70%" }} align="center">
          <tbody>
            <tr>
              <td><strong>Parameter</strong></td>
              <td><strong>Value</strong></td>
            </tr>
            <tr>
              <td>Amount:</td>
              <td>
                <input
                  type="text"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="form"
                  required
                />
              </td>
            </tr>
            <tr>
              <td>Tax Amount:</td>
              <td>
                <input
                  type="text"
                  id="tax_amount"
                  name="tax_amount"
                  value={formData.tax_amount}
                  onChange={handleChange}
                  className="form"
                  required
                />
              </td>
            </tr>
            <tr>
              <td>Total Amount:</td>
              <td>
                <input
                  type="text"
                  id="total_amount"
                  name="total_amount"
                  value={formData.total_amount}
                  onChange={handleChange}
                  className="form"
                  required
                />
              </td>
            </tr>
            <tr>
              <td>Transaction UUID:</td>
              <td>
                <input
                  type="text"
                  id="transaction_uuid"
                  name="transaction_uuid"
                  value={formData.transaction_uuid}
                  onChange={handleChange}
                  className="form"
                  required
                />
              </td>
            </tr>
            <tr>
              <td>Booking ID:</td>
              <td>
                <input
                  type="text"
                  id="bookingId"
                  name="bookingId"
                  value={formData.bookingId}
                  onChange={handleChange}
                  className="form"
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td>Product Code:</td>
              <td>
                <input
                  type="text"
                  id="product_code"
                  name="product_code"
                  value={formData.product_code}
                  onChange={handleChange}
                  className="form"
                  required
                />
              </td>
            </tr>
            <tr>
              <td>Product Service Charge:</td>
              <td>
                <input
                  type="text"
                  id="product_service_charge"
                  name="product_service_charge"
                  value={formData.product_service_charge}
                  onChange={handleChange}
                  className="form"
                  required
                />
              </td>
            </tr>
            <tr>
              <td>Product Delivery Charge:</td>
              <td>
                <input
                  type="text"
                  id="product_delivery_charge"
                  name="product_delivery_charge"
                  value={formData.product_delivery_charge}
                  onChange={handleChange}
                  className="form"
                  required
                />
              </td>
            </tr>
            <tr>
              <td>Success URL:</td>
              <td>
                <input
                  type="text"
                  id="success_url"
                  name="success_url"
                  value={formData.success_url}
                  onChange={handleChange}
                  className="form"
                  required
                />
              </td>
            </tr>
            <tr>
              <td>Failure URL:</td>
              <td>
                <input
                  type="text"
                  id="failure_url"
                  name="failure_url"
                  value={formData.failure_url}
                  onChange={handleChange}
                  className="form"
                  required
                />
              </td>
            </tr>
            <tr>
              <td>Signed Field Names:</td>
              <td>
                <input
                  type="text"
                  id="signed_field_names"
                  name="signed_field_names"
                  value={formData.signed_field_names}
                  onChange={handleChange}
                  className="form"
                  required
                />
              </td>
            </tr>
            <tr>
              <td>Signature:</td>
              <td>
                <input
                  type="text"
                  id="signature"
                  name="signature"
                  value={formData.signature}
                  className="form"
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td>reCAPTCHA:</td>
              <td>
                <ReCAPTCHA
                  sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                  onChange={handleRecaptchaChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <br />
        <table style={{ width: "50%" }} align="center">
          <tbody>
            <tr>
              <th>
                <button 
                  type="submit" 
                  className="button" 
                  disabled={!recaptchaToken || isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Pay with eSewa'}
                </button>
              </th>
            </tr>
          </tbody>
        </table>
      </form>
      <style>
        {`
          .form {
            padding: 8px 25px;
            font-size: 15px;
          }
          .button {
            padding: 12px 25px;
            font-size: 24px;
            text-align: center;
            cursor: pointer;
            outline: none;
            color: #fff;
            background-color: #4CAF50;
            border: none;
            border-radius: 15px;
            box-shadow: 0 9px #999;
          }
          .button:hover {
            background-color: #3e8e41;
          }
          .button:active {
            background-color: #0000;
            box-shadow: 0 5px #666;
            transform: translateY(4px);
          }
          .button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
          }
        `}
      </style>
    </div>
  );
};

export default EsewaPayment;