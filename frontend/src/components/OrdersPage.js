import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await API.get("/api/orders/");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Box sx={{ padding: "20px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">Your Orders</Typography>
        <Button onClick={() => navigate("/")} variant="outlined">Back to Shopping</Button>
      </Box>
      {orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        orders.map((order) => (
          <Paper key={order.id} sx={{ padding: "16px", mb: 2 }}>
            <Typography variant="h6">Order #{order.id}</Typography>
            <Typography>Type: {order.order_type}</Typography>
            <Typography>Total Amount: Rs. {order.total_amount}</Typography>
            <Typography>Status: {order.status}</Typography>
            <Typography>Created At: {new Date(order.created_at).toLocaleString()}</Typography>
            {order.order_type === "buying" && order.billing_details && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle1">Billing Details:</Typography>
                <Typography>Name: {order.billing_details.fullName}</Typography>
                <Typography>Email: {order.billing_details.email}</Typography>
                <Typography>Contact: {order.billing_details.contactNumber}</Typography>
                <Typography>Delivery: {order.billing_details.deliveryLocation}</Typography>
              </Box>
            )}
            {order.order_type === "renting" && order.renting_details && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle1">Renting Details:</Typography>
                <Typography>Name: {order.renting_details.name}</Typography>
                <Typography>Contact: {order.renting_details.contactNumber}</Typography>
                <Typography>Survey Type: {order.renting_details.surveyType}</Typography>
                <Typography>Renting Days: {order.renting_details.rentingDays}</Typography>
                <Typography>Date Needed: {order.renting_details.dateNeeded}</Typography>
              </Box>
            )}
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle1">Items:</Typography>
              {order.items.map((item, index) => (
                <Typography key={index}>- {item.product_name} (Qty: {item.quantity}, Price: Rs. {item.price})</Typography>
              ))}
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default OrdersPage;