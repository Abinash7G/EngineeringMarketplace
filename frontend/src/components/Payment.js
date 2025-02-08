/*import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button, Typography, Container, Alert, Box } from "@mui/material";

const stripePromise = loadStripe("pk_test_51QnOg8HFXrh998Klft0d4A2QId9hPWxhNlU12COVn2WXlCgzx6BreTWwIE6zNBjINEMd1wANva7HvkWhHKS3XUnp00kQmaYhHn");

const Payment = () => (
    <Elements stripe={stripePromise}>
        <PaymentForm />
    </Elements>
);

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const location = useLocation();

    // Retrieve clientSecret and totalAmount from the location state
    const { clientSecret, totalAmount } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    console.log("clientSecret:", clientSecret);
    console.log("totalAmount:", totalAmount);

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!stripe || !elements) {
            setError("Stripe has not loaded properly. Please try again.");
            return;
        }

        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (error) {
                setError(error.message);
            } else if (paymentIntent.status === "succeeded") {
                setSuccess(true);
                alert("Payment successful!");
                // Redirect or clear cart after payment success
            }
        } catch (err) {
            setError("Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4, p: 4, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h5" align="center" gutterBottom>
                Secure Payment
            </Typography>
            <Typography variant="body2" align="center">
                Total Amount: Rs. {totalAmount || "Not provided"}
            </Typography>
            <Box component="form" onSubmit={handlePayment} sx={{ mt: 3 }}>
                <CardElement />
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 3 }}>
                    {loading ? "Processing..." : "Pay Now"}
                </Button>
            </Box>
            {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 3 }}>Payment successful!</Alert>}
        </Container>
    );
};

export default Payment;
*/