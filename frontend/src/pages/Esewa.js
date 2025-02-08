import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Card, CardContent, Typography, Box } from "@mui/material";

const Esewa = () => {
  // Generate Unique Transaction UUID
  const generateTransactionID = () => Math.floor(Math.random() * 1000000000).toString();

  // State for dynamic input
  const [amount, setAmount] = useState("");
  const [taxAmount, setTaxAmount] = useState("10"); // Default tax
  const [serviceCharge, setServiceCharge] = useState("0");
  const [deliveryCharge, setDeliveryCharge] = useState("0");
  const [transactionUUID, setTransactionUUID] = useState(generateTransactionID());
  const [signature, setSignature] = useState(""); // Placeholder for dynamic signature

  // Calculate Total Amount
  const totalAmount = parseFloat(amount || 0) + parseFloat(taxAmount || 0);

  // Fetch values from environment variables
  const productCode = process.env.REACT_APP_PRODUCT_CODE || "EPAYTEST";
  const successURL = process.env.REACT_APP_SUCCESS_URL || "https://esewa.com.np";
  const failureURL = process.env.REACT_APP_FAILURE_URL || "https://google.com";

  // Function to generate dynamic signature (Needs implementation based on eSewa’s requirements)
  const generateSignature = () => {
    // Placeholder: Implement signature generation with backend security
    return "DYNAMIC_SIGNATURE_PLACEHOLDER";
  };

  // Update signature whenever transaction details change
  useEffect(() => {
    setSignature(generateSignature());
  }, [amount, transactionUUID]);

  return (
    <Container maxWidth="sm">
      <Card sx={{ boxShadow: 3, borderRadius: 2, p: 3, mt: 4 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            eSewa Payment
          </Typography>

          <form action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
            <Box display="flex" flexDirection="column" gap={2}>
              
              <TextField
                label="Amount"
                name="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Tax Amount"
                name="tax_amount"
                type="number"
                value={taxAmount}
                onChange={(e) => setTaxAmount(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Total Amount"
                name="total_amount"
                value={totalAmount}
                required
                fullWidth
                disabled
              />
              <TextField
                label="Transaction UUID"
                name="transaction_uuid"
                value={transactionUUID}
                required
                fullWidth
                disabled
              />
              <TextField
                label="Product Code"
                name="product_code"
                value={productCode}
                required
                fullWidth
                disabled
              />
              <TextField
                label="Service Charge"
                name="product_service_charge"
                value={serviceCharge}
                required
                fullWidth
                disabled
              />
              <TextField
                label="Delivery Charge"
                name="product_delivery_charge"
                value={deliveryCharge}
                required
                fullWidth
                disabled
              />
              <TextField
                label="Success URL"
                name="success_url"
                value={successURL}
                required
                fullWidth
                disabled
              />
              <TextField
                label="Failure URL"
                name="failure_url"
                value={failureURL}
                required
                fullWidth
                disabled
              />
              <TextField
                label="Signed Field Names"
                name="signed_field_names"
                value="total_amount,transaction_uuid,product_code"
                required
                fullWidth
                disabled
              />
              <TextField
                label="Signature"
                name="signature"
                value={signature}
                required
                fullWidth
                disabled
              />
              
              <Button
                type="submit"
                variant="contained"
                color="success"
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize: "1rem",
                  "&:hover": { backgroundColor: "#1b5e20" },
                }}
              >
                Pay with eSewa
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Esewa;
