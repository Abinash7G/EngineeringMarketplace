import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Alert,
  Container,
  CircularProgress,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Chip,
  CardHeader,
  CardContent,
  Avatar,
  Grid,
  Badge,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Visibility,
  TrackChanges,
  ShoppingCart,
  EventAvailable,
  LocalShipping,
  Payment,
  CheckCircle,
  Cancel,
  AccessTime,
  Person,
  Email,
  Phone,
  LocationOn,
  Business,
  AttachMoney,
  Receipt,
  ExpandMore,
  CalendarToday,
  Today,
  Event,
  Schedule,
  FilterList,
} from "@mui/icons-material";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const CompanyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [companyId, setCompanyId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all_except_delivered_returned"); // Default: exclude "Delivered" and "Returned"
  const [filterOptions, setFilterOptions] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();

  const buyingStatusOptions = ["Paid", "Processing", "Delivered", "Cancelled"];
  const rentingStatusOptions = ["Booked", "Picked Up", "Returned", "Cancelled"];

  useEffect(() => {
    const fetchCompanyId = async () => {
      try {
        const profileResponse = await API.get("/api/user-profile/");
        setCompanyId(profileResponse.data.company_id);
      } catch (error) {
        console.error("Error fetching company ID:", error);
        setError("Failed to fetch company information. Please try again.");
      }
    };

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setError("Please log in to view orders.");
          setLoading(false);
          return;
        }

        // Build query parameters based on filter
        const params = new URLSearchParams();
        if (filterStatus) {
          params.append("filter_status", filterStatus);
        }

        const response = await API.get(`/api/company/orders/?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched orders:", response.data);
        setOrders(response.data);

        // Determine available order types to populate filter options
        const hasBuying = response.data.some(order => order.order_type === "buying" || order.order_type === "mixed");
        const hasRenting = response.data.some(order => order.order_type === "renting" || order.order_type === "mixed");

        // Build filter options dynamically
        const options = ["all_except_delivered_returned"];
        if (hasBuying) {
          options.push(...buyingStatusOptions.map(status => `Buying: ${status}`));
        }
        if (hasRenting) {
          options.push(...rentingStatusOptions.map(status => `Renting: ${status}`));
        }
        setFilterOptions(options);

        setError(null);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(
          error.response?.data?.error || "Failed to fetch orders. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyId().then(() => fetchOrders());
  }, [filterStatus]);

  const handleFilterChange = (value) => {
    // Extract the status value (remove "Buying: " or "Renting: " prefix)
    if (value.startsWith("Buying: ")) {
      setFilterStatus(value.replace("Buying: ", ""));
    } else if (value.startsWith("Renting: ")) {
      setFilterStatus(value.replace("Renting: ", ""));
    } else {
      setFilterStatus(value);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "returned":
        return <CheckCircle fontSize="small" />;
      case "paid":
      case "booked":
        return <Payment fontSize="small" />;
      case "cancelled":
        return <Cancel fontSize="small" />;
      case "picked up":
      case "processing":
        return <AccessTime fontSize="small" />;
      default:
        return <AccessTime fontSize="small" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "returned":
        return "success";
      case "paid":
      case "booked":
        return "warning";
      case "cancelled":
        return "error";
      case "picked up":
      case "processing":
        return "info";
      default:
        return "default";
    }
  };

  const handleStatusChange = async (orderId, field, newStatus) => {
    try {
      const token = localStorage.getItem("access_token");
      const payload =
        field === "buying_status"
          ? { buying_status: newStatus }
          : { renting_status: newStatus };
      await API.patch(`/api/orders/${orderId}/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prevOrders) =>
        prevOrders.filter((order) => {
          if (order.id === orderId) {
            // If status changes to "Delivered" or "Returned", remove the order if filters exclude them
            if (field === "buying_status" && newStatus === "Delivered" && filterStatus === "all_except_delivered_returned") {
              return false;
            }
            if (field === "renting_status" && newStatus === "Returned" && filterStatus === "all_except_delivered_returned") {
              return false;
            }
            // If the new status doesn't match the current filter, remove the order
            if (field === "buying_status" && filterStatus && filterStatus !== "all_except_delivered_returned" && filterStatus !== newStatus) {
              return false;
            }
            if (field === "renting_status" && filterStatus && filterStatus !== "all_except_delivered_returned" && filterStatus !== newStatus) {
              return false;
            }
          }
          return true;
        })
      );
      setSnackbarMessage("Status updated successfully");
      setSnackbarOpen(true);
      setTimeout(() => setSnackbarOpen(false), 2000);
    } catch (error) {
      console.error("Error updating status:", error);
      setSnackbarMessage(
        error.response?.data?.error || "Failed to update status. Please try again."
      );
      setSnackbarOpen(true);
    }
  };

  const handleViewInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await API.get(`/orders/${orderId}/invoice/`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const viewUrl = window.URL.createObjectURL(blob);
      window.open(viewUrl, "_blank");
      setTimeout(() => {
        window.URL.revokeObjectURL(viewUrl);
      }, 10000);
    } catch (error) {
      console.error("Failed to open invoice:", error);
      setSnackbarMessage(
        error.response?.data?.error || "Failed to open invoice. Please try again."
      );
      setSnackbarOpen(true);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateReturnDate = (dateNeeded, rentingDays) => {
    const date = new Date(dateNeeded);
    date.setDate(date.getDate() + parseInt(rentingDays));
    return date.toLocaleDateString();
  };

  const renderBillingDetails = (order) => {
    if (!order.billing_details) return null;

    return (
      <Accordion defaultExpanded sx={{ mb: 3, boxShadow: "none", border: `1px solid ${theme.palette.divider}` }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight="bold">
            <Person sx={{ verticalAlign: "middle", mr: 1 }} />
            Customer Details
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                <Person fontSize="small" sx={{ mr: 1, verticalAlign: "middle" }} />
                Name
              </Typography>
              <Typography variant="body1">{order.billing_details.fullName}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                <Email fontSize="small" sx={{ mr: 1, verticalAlign: "middle" }} />
                Email
              </Typography>
              <Typography variant="body1">{order.billing_details.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                <Phone fontSize="small" sx={{ mr: 1, verticalAlign: "middle" }} />
                Contact
              </Typography>
              <Typography variant="body1">{order.billing_details.contactNumber}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                <LocationOn fontSize="small" sx={{ mr: 1, verticalAlign: "middle" }} />
                Delivery Location
              </Typography>
              <Typography variant="body1">{order.billing_details.deliveryLocation}</Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  };

  const renderBuyingItems = (order) => {
    if (!order.buying_items || order.buying_items.length === 0) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
          <ShoppingCart sx={{ verticalAlign: "middle", mr: 1 }} />
          Purchased Items
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.grey[100] }}>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Product</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  Unit Price
                </TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.buying_items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    <Typography fontWeight="medium">{item.product_name}</Typography>
                  </TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    Rs. {item.price}
                  </TableCell>
                  <TableCell align="right">Rs. {item.quantity * item.price}</TableCell>
                  <TableCell sx={{ display: { xs: "table-cell", sm: "none" } }}>
                    <Typography fontWeight="medium">{item.product_name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Qty: {item.quantity} | Price: Rs. {item.price} | Total: Rs. {item.quantity * item.price}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const renderRentingDetails = (order) => {
    if (!order.renting_details) return null;

    return (
      <Accordion defaultExpanded sx={{ mb: 3, boxShadow: "none", border: `1px solid ${theme.palette.divider}` }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight="bold">
            <EventAvailable sx={{ verticalAlign: "middle", mr: 1 }} />
            Renting Details
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                <Person fontSize="small" sx={{ mr: 1, verticalAlign: "middle" }} />
                Customer Name
              </Typography>
              <Typography variant="body1">{order.renting_details.name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                <Phone fontSize="small" sx={{ mr: 1, verticalAlign: "middle" }} />
                Contact Number
              </Typography>
              <Typography variant="body1">{order.renting_details.contactNumber}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                <CalendarToday fontSize="small" sx={{ mr: 1, verticalAlign: "middle" }} />
                Survey Type
              </Typography>
              <Typography variant="body1">{order.renting_details.surveyType}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                <Today fontSize="small" sx={{ mr: 1, verticalAlign: "middle" }} />
                Date Needed
              </Typography>
              <Typography variant="body1">
                {new Date(order.renting_details.dateNeeded).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                <Schedule fontSize="small" sx={{ mr: 1, verticalAlign: "middle" }} />
                Renting Days
              </Typography>
              <Typography variant="body1">{order.renting_details.rentingDays} days</Typography>
            </Grid>
          </Grid>

          {order.renting_status && (
            <Box sx={{ mt: 2, p: 2, bgcolor: theme.palette.grey[100], borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {order.renting_status === "Booked" ? (
                  <>
                    <CheckCircle color="warning" sx={{ verticalAlign: "middle", mr: 1 }} />
                    The client needs to pick up the item.
                  </>
                ) : order.renting_status === "Picked Up" ? (
                  <>
                    <LocalShipping color="info" sx={{ verticalAlign: "middle", mr: 1 }} />
                    The client has {order.renting_details.rentingDays} days to use the item. Expected return date:{" "}
                    {calculateReturnDate(order.renting_details.dateNeeded, order.renting_details.rentingDays)}
                  </>
                ) : (
                  <>
                    <CheckCircle color="success" sx={{ verticalAlign: "middle", mr: 1 }} />
                    The item has been returned.
                  </>
                )}
              </Typography>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    );
  };

  const renderRentingItems = (order) => {
    if (!order.renting_items || order.renting_items.length === 0) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
          <LocalShipping sx={{ verticalAlign: "middle", mr: 1 }} />
          Rented Equipment
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.grey[100] }}>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Product</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  Daily Rate
                </TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Company</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.renting_items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    <Typography fontWeight="medium">{item.product_name}</Typography>
                    {item.serial_number && (
                      <Typography variant="caption" color="text.secondary">
                        Serial: {item.serial_number}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    Rs. {item.price}
                  </TableCell>
                  <TableCell align="right">
                    Rs. {item.quantity * item.price * order.renting_details.rentingDays}
                  </TableCell>
                  <TableCell sx={{ display: { xs: "table-cell", sm: "none" } }}>
                    <Typography fontWeight="medium">{item.product_name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Qty: {item.quantity} | Daily Rate: Rs. {item.price} | Total: Rs.{" "}
                      {item.quantity * item.price * order.renting_details.rentingDays}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const renderCompanyAmounts = (order) => {
    if (!order.company_amounts || !companyId) return null;

    const companyAmount = order.company_amounts[companyId];
    if (!companyAmount) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
          <Business sx={{ verticalAlign: "middle", mr: 1 }} />
          Your Earnings
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Company ID {companyId}
              </Typography>
              <Typography variant="h6" color="primary">
                Rs. {companyAmount}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderPaymentDetails = (order) => {
    if (!order.payment_data) return null;

    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
          <Payment sx={{ verticalAlign: "middle", mr: 1 }} />
          Payment Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Transaction ID
            </Typography>
            <Typography variant="body1">{order.payment_data.transaction_id}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Payment Method
            </Typography>
            <Chip label={order.payment_data.method} color="info" size="small" variant="outlined" />
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderStatusUpdate = (order) => {
    if (order.order_type === "renting" || order.order_type === "mixed") {
      return (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            <TrackChanges sx={{ verticalAlign: "middle", mr: 1 }} />
            Rental Status
          </Typography>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} sm="auto">
              <Badge>
                <Chip
                  label={order.renting_status}
                  color={getStatusColor(order.renting_status)}
                  variant="outlined"
                  size="medium"
                />
              </Badge>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Update Rental Status</InputLabel>
                <Select
                  value={order.renting_status}
                  label="Update Rental Status"
                  onChange={(e) => handleStatusChange(order.id, "renting_status", e.target.value)}
                >
                  <MenuItem value="Booked">
                    <Box display="flex" alignItems="center">
                      <AccessTime color="warning" sx={{ mr: 1 }} />
                      Booked
                    </Box>
                  </MenuItem>
                  <MenuItem value="Picked Up">
                    <Box display="flex" alignItems="center">
                      <LocalShipping color="info" sx={{ mr: 1 }} />
                      Picked Up
                    </Box>
                  </MenuItem>
                  <MenuItem value="Returned">
                    <Box display="flex" alignItems="center">
                      <CheckCircle color="success" sx={{ mr: 1 }} />
                      Returned
                    </Box>
                  </MenuItem>
                  <MenuItem value="Cancelled">
                    <Box display="flex" alignItems="center">
                      <Cancel color="error" sx={{ mr: 1 }} />
                      Cancelled
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      );
    } else if (order.buying_status) {
      return (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            <TrackChanges sx={{ verticalAlign: "middle", mr: 1 }} />
            Order Status
          </Typography>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} sm="auto">
              <Badge>
                <Chip
                  label={order.buying_status}
                  color={getStatusColor(order.buying_status)}
                  variant="outlined"
                  size="medium"
                />
              </Badge>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Update Order Status</InputLabel>
                <Select
                  value={order.buying_status}
                  label="Update Order Status"
                  onChange={(e) => handleStatusChange(order.id, "buying_status", e.target.value)}
                >
                  <MenuItem value="Paid">
                    <Box display="flex" alignItems="center">
                      <Payment color="warning" sx={{ mr: 1 }} />
                      Paid
                    </Box>
                  </MenuItem>
                  <MenuItem value="Processing">
                    <Box display="flex" alignItems="center">
                      <AccessTime color="info" sx={{ mr: 1 }} />
                      Processing
                    </Box>
                  </MenuItem>
                  <MenuItem value="Delivered">
                    <Box display="flex" alignItems="center">
                      <LocalShipping color="success" sx={{ mr: 1 }} />
                      Delivered
                    </Box>
                  </MenuItem>
                  <MenuItem value="Cancelled">
                    <Box display="flex" alignItems="center">
                      <Cancel color="error" sx={{ mr: 1 }} />
                      Cancelled
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      );
    }
    return null;
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
          }}
        >
          <Receipt sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }} />
          Order Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
          View and manage all customer orders for your company
        </Typography>
      </Box>

      {/* Single Filter Section */}
      <Box sx={{ mb: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }} size="small">
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={filterStatus === "all_except_delivered_returned" ? "all_except_delivered_returned" : 
                  buyingStatusOptions.includes(filterStatus) ? `Buying: ${filterStatus}` : 
                  rentingStatusOptions.includes(filterStatus) ? `Renting: ${filterStatus}` : ""}
            label="Filter by Status"
            onChange={(e) => handleFilterChange(e.target.value)}
            startAdornment={<FilterList sx={{ mr: 1 }} />}
          >
            <MenuItem value="all_except_delivered_returned">All</MenuItem>
            {filterOptions.slice(1).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>
            No orders found
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, fontSize: { xs: "0.9rem", sm: "1rem" } }}>
            No orders match the selected filter. Try adjusting the filter to see more orders.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card elevation={3} sx={{ borderRadius: 2 }}>
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor:
                          order.order_type === "buying"
                            ? theme.palette.primary.main
                            : theme.palette.secondary.main,
                      }}
                    >
                      {order.order_type === "buying" ? <ShoppingCart /> : <EventAvailable />}
                    </Avatar>
                  }
                  action={
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        color="primary"
                        title="View Invoice"
                        onClick={() => handleViewInvoice(order.id)}
                        size="small"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        color="info"
                        title="Track Order"
                        onClick={() =>
                          setSnackbarMessage("Tracking not implemented yet") || setSnackbarOpen(true)
                        }
                        size="small"
                      >
                        <TrackChanges />
                      </IconButton>
                    </Box>
                  }
                  title={`Order #${order.id}`}
                  subheader={`Created: ${formatDate(order.created_at)}`}
                  titleTypographyProps={{ variant: "h6", fontWeight: 600, fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
                  subheaderTypographyProps={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                />
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                          Booking ID
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                          {order.booking_id}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                          Order Type
                        </Typography>
                        <Chip
                          label={order.order_type}
                          size="small"
                          color={order.order_type === "buying" ? "primary" : "secondary"}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                          Total Amount
                        </Typography>
                        <Typography variant="body1" fontWeight="bold" sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                          Rs. {order.total_amount}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  {renderStatusUpdate(order)}

                  {order.order_type !== "renting" && renderBillingDetails(order)}
                  {order.order_type !== "renting" && renderBuyingItems(order)}

                  {(order.order_type === "renting" || order.order_type === "mixed") && renderRentingDetails(order)}
                  {(order.order_type === "renting" || order.order_type === "mixed") && renderRentingItems(order)}

                  {renderCompanyAmounts(order)}
                  {renderPaymentDetails(order)}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </Container>
  );
};

export default CompanyOrdersPage;