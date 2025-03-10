import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Chip,
  Avatar,
  Link,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CategoryIcon from "@mui/icons-material/Category";
import BuildIcon from "@mui/icons-material/Build";

const InquiriesList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  const isTokenExpired = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return Date.now() >= decoded.exp * 1000;
    } catch (err) {
      return true;
    }
  };

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      let token = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      if (!token) {
        setError("Please log in to view inquiries.");
        navigate("/login");
        return;
      }

      if (isTokenExpired(token) && refreshToken) {
        const refreshResponse = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
          refresh: refreshToken,
        });
        token = refreshResponse.data.access;
        localStorage.setItem("access_token", token);
      }

      const response = await axios.get("http://127.0.0.1:8000/api/company-inquiries/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response:", response.data); // Debug log
      setInquiries(response.data);
    } catch (err) {
      console.error("Error fetching inquiries:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
      } else {
        setError("Failed to load inquiries. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const renderSubServiceDetails = (inquiry) => {
    switch (inquiry.sub_service) {
      case "Comprehensive Building Planning & Design":
        return (
          <CardContent>
            <Typography variant="h6" sx={{ mt: 2, color: theme.palette.primary.main, fontWeight: "bold" }}>
              Building Information
            </Typography>
            {(inquiry.type_of_building || inquiry.building_purpose || inquiry.num_floors || inquiry.land_area ||
              inquiry.architectural_style || inquiry.architectural_style_other || inquiry.budget_estimate ||
              inquiry.special_requirements) ? (
              <Box sx={{ mt: 1 }}>
                {inquiry.type_of_building && (
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <BuildIcon sx={{ mr: 1, color: theme.palette.text.secondary }} fontSize="small" />
                    <strong>Type of Building:</strong> {inquiry.type_of_building}
                  </Typography>
                )}
                {inquiry.building_purpose && (
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <BuildIcon sx={{ mr: 1, color: theme.palette.text.secondary }} fontSize="small" />
                    <strong>Building Purpose:</strong> {inquiry.building_purpose}
                  </Typography>
                )}
                {inquiry.num_floors && (
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <BuildIcon sx={{ mr: 1, color: theme.palette.text.secondary }} fontSize="small" />
                    <strong>Number of Floors:</strong> {inquiry.num_floors}
                  </Typography>
                )}
                {inquiry.land_area && (
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <BuildIcon sx={{ mr: 1, color: theme.palette.text.secondary }} fontSize="small" />
                    <strong>Land Area:</strong> {inquiry.land_area}
                  </Typography>
                )}
                {inquiry.architectural_style && (
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <BuildIcon sx={{ mr: 1, color: theme.palette.text.secondary }} fontSize="small" />
                    <strong>Architectural Style:</strong> {inquiry.architectural_style}
                  </Typography>
                )}
                {inquiry.architectural_style_other && (
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <BuildIcon sx={{ mr: 1, color: theme.palette.text.secondary }} fontSize="small" />
                    <strong>Other Architectural Style:</strong> {inquiry.architectural_style_other}
                  </Typography>
                )}
                {inquiry.budget_estimate && (
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <BuildIcon sx={{ mr: 1, color: theme.palette.text.secondary }} fontSize="small" />
                    <strong>Budget Estimate:</strong> {inquiry.budget_estimate}
                  </Typography>
                )}
                {inquiry.special_requirements && (
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <BuildIcon sx={{ mr: 1, color: theme.palette.text.secondary }} fontSize="small" />
                    <strong>Special Requirements:</strong> {inquiry.special_requirements}
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No additional details provided.
              </Typography>
            )}
          </CardContent>
        );

      case "Structural & Geotechnical Consultation":
        return (
          <CardContent>
            <Typography variant="h6" sx={{ mt: 2, color: theme.palette.primary.main, fontWeight: "bold" }}>
              Uploaded Documents
            </Typography>
            {(inquiry.site_plan || inquiry.architectural_plan || inquiry.soil_test_report || inquiry.foundation_design) ? (
              <Box sx={{ mt: 1 }}>
                {inquiry.site_plan && (
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <strong>Site Plan:</strong>{" "}
                    <Link href={`http://127.0.0.1:8000${inquiry.site_plan}`} target="_blank" rel="noopener noreferrer" sx={{ ml: 1 }}>
                      Download
                    </Link>
                  </Typography>
                )}
                {inquiry.architectural_plan && (
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <strong>Architectural Plan:</strong>{" "}
                    <Link href={`http://127.0.0.1:8000${inquiry.architectural_plan}`} target="_blank" rel="noopener noreferrer" sx={{ ml: 1 }}>
                      Download
                    </Link>
                  </Typography>
                )}
                {inquiry.soil_test_report && (
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <strong>Soil Test Report:</strong>{" "}
                    <Link href={`http://127.0.0.1:8000${inquiry.soil_test_report}`} target="_blank" rel="noopener noreferrer" sx={{ ml: 1 }}>
                      Download
                    </Link>
                  </Typography>
                )}
                {inquiry.foundation_design && (
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <strong>Foundation Design:</strong>{" "}
                    <Link href={`http://127.0.0.1:8000${inquiry.foundation_design}`} target="_blank" rel="noopener noreferrer" sx={{ ml: 1 }}>
                      Download
                    </Link>
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No documents uploaded.
              </Typography>
            )}
          </CardContent>
        );

      case "MEP System Design (Mechanical, Electrical & Plumbing)":
        return (
          <CardContent>
            <Typography variant="h6" sx={{ mt: 2, color: theme.palette.primary.main, fontWeight: "bold" }}>
              Uploaded Documents
            </Typography>
            {(inquiry.electrical_plan || inquiry.plumbing_plan || inquiry.hvac_plan) ? (
              <Box sx={{ mt: 1 }}>
                {inquiry.electrical_plan && (
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <strong>Electrical Plan:</strong>{" "}
                    <Link href={`http://127.0.0.1:8000${inquiry.electrical_plan}`} target="_blank" rel="noopener noreferrer" sx={{ ml: 1 }}>
                      Download
                    </Link>
                  </Typography>
                )}
                {inquiry.plumbing_plan && (
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <strong>Plumbing Plan:</strong>{" "}
                    <Link href={`http://127.0.0.1:8000${inquiry.plumbing_plan}`} target="_blank" rel="noopener noreferrer" sx={{ ml: 1 }}>
                      Download
                    </Link>
                  </Typography>
                )}
                {inquiry.hvac_plan && (
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <strong>HVAC Plan:</strong>{" "}
                    <Link href={`http://127.0.0.1:8000${inquiry.hvac_plan}`} target="_blank" rel="noopener noreferrer" sx={{ ml: 1 }}>
                      Download
                    </Link>
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No documents uploaded.
              </Typography>
            )}
          </CardContent>
        );

      case "Construction Management & Cost Estimation":
        return (
          <CardContent>
            <Typography variant="h6" sx={{ mt: 2, color: theme.palette.primary.main, fontWeight: "bold" }}>
              Uploaded Documents
            </Typography>
            {(inquiry.construction_permit || inquiry.cost_estimation) ? (
              <Box sx={{ mt: 1 }}>
                {inquiry.construction_permit && (
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <strong>Construction Permit:</strong>{" "}
                    <Link href={`http://127.0.0.1:8000${inquiry.construction_permit}`} target="_blank" rel="noopener noreferrer" sx={{ ml: 1 }}>
                      Download
                    </Link>
                  </Typography>
                )}
                {inquiry.cost_estimation && (
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <strong>Cost Estimation:</strong>{" "}
                    <Link href={`http://127.0.0.1:8000${inquiry.cost_estimation}`} target="_blank" rel="noopener noreferrer" sx={{ ml: 1 }}>
                      Download
                    </Link>
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No documents uploaded.
              </Typography>
            )}
          </CardContent>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3, mt: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: theme.palette.primary.main, fontWeight: "bold", mb: 3 }}
        >
          Client Inquiries
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ p: 2, backgroundColor: "#ffebee", borderRadius: 1 }}>
            {error}
          </Typography>
        ) : inquiries.length === 0 ? (
          <Typography variant="body1" sx={{ p: 2, color: theme.palette.text.secondary }}>
            No inquiries submitted yet.
          </Typography>
        ) : (
          <List>
            {inquiries.map((inquiry, index) => (
              <Card
                key={inquiry.id}
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)" },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      Name: {inquiry.full_name}
                    </Typography>
                  </Box>
                  <Box sx={{ ml: 6 }}>
                    <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                      <LocationOnIcon sx={{ mr: 1, color: theme.palette.text.secondary }} fontSize="small" />
                      <strong>Location:</strong> {inquiry.location}
                    </Typography>
                    <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                      <EmailIcon sx={{ mr: 1, color: theme.palette.text.secondary }} fontSize="small" />
                      <strong>Email:</strong> {inquiry.email}
                    </Typography>
                    <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                      <PhoneIcon sx={{ mr: 1, color: theme.palette.text.secondary }} fontSize="small" />
                      <strong>Phone:</strong> {inquiry.phone_number}
                    </Typography>
                    <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                      <CategoryIcon sx={{ mr: 1, color: theme.palette.text.secondary }} fontSize="small" />
                      <strong>Category:</strong> {inquiry.category}
                    </Typography>
                    <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                      <BuildIcon sx={{ mr: 1, color: theme.palette.text.secondary }} fontSize="small" />
                      <strong>Sub-Service:</strong> {inquiry.sub_service}
                    </Typography>
                  </Box>
                  {renderSubServiceDetails(inquiry)}
                  <Typography variant="body2" sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                    <strong>Status:</strong>{" "}
                    <Chip
                      label={inquiry.status}
                      color={
                        inquiry.status === "Pending"
                          ? "warning"
                          : inquiry.status === "Scheduled"
                          ? "info"
                          : "success"
                      }
                      sx={{ ml: 1 }}
                    />
                    <Typography variant="caption" sx={{ ml: 1, color: "#666" }}>
                      {inquiry.status === "Pending"
                        ? "(Inquiry submitted, awaiting review/appointment scheduling)"
                        : inquiry.status === "Scheduled" && inquiry.appointment && inquiry.appointment.length > 0
                        ? `(Scheduled for ${new Date(inquiry.appointment[0].appointment_date).toLocaleString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })})`
                        : inquiry.status === "Completed"
                        ? "(Completed)"
                        : ""}
                    </Typography>
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                    <strong>Created At:</strong>{" "}
                    {new Date(inquiry.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default InquiriesList;