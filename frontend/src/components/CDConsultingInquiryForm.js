import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ClientNavbar from "./ClientNavbar";
import InfoIcon from "@mui/icons-material/Info";

const isTokenExpired = (token) => {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= decoded.exp * 1000;
  } catch (err) {
    return true;
  }
};

const handleAuthError = (navigate) => {
  console.log("Authentication error occurred. Redirecting to login...");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_id");
  navigate("/login");
};

const CDConsultingInquiryForm = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    fullName: "",
    location: "",
    email: "",
    phoneNumber: "",
    category: "",
    subService: "",
    typeOfBuilding: "",
    buildingPurpose: "",
    num_floors: null,  // Changed to null instead of ""
    landArea: "",
    architecturalStyle: "",
    architecturalStyleOther: "",
    budgetEstimate: "",
    specialRequirements: "",
    sitePlan: null,
    architecturalPlan: null,
    soilTestReport: null,
    foundationDesign: null,
    electricalPlan: null,
    plumbingPlan: null,
    hvacPlan: null,
    constructionPermit: null,
    costEstimation: null,
  });

  const [companyServices, setCompanyServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [wishlist] = useState([]);
  const [cartItems] = useState([]);
  const handleNavigateToProfile = () => {
    navigate("/client/profile");
  };

  const fetchCompanyServices = async () => {
    setLoading(true);
    try {
      let token = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      if (!token) {
        setCompanyServices([]);
        setLoading(false);
        handleAuthError(navigate);
        return;
      }

      if (isTokenExpired(token) && refreshToken) {
        try {
          const refreshResponse = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
            refresh: refreshToken,
          });
          token = refreshResponse.data.access;
          localStorage.setItem("access_token", token);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          setCompanyServices([]);
          setLoading(false);
          handleAuthError(navigate);
          return;
        }
      }

      const response = await axios.get(`http://127.0.0.1:8000/api/company-services/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredServices = response.data.map((service, index) => ({
        id: index + 1,
        category: service.category || "Unknown",
        sub_service: service.sub_service || "Unknown",
      }));
      setCompanyServices(filteredServices);
    } catch (error) {
      console.error("Error fetching company services:", error);
      if (error.response?.status === 401) {
        handleAuthError(navigate);
      }
      setCompanyServices([]);
      setError("Failed to load company services. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyServices();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value || "" });
  };

  const handleFileUpload = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setError("User not logged in. Please log in to submit an inquiry.");
      setLoading(false);
      navigate("/login");
      return;
    }

    // Client-side validation based on sub-service
    if (formData.subService === "Comprehensive Building Planning & Design") {
      if (!formData.typeOfBuilding || !formData.buildingPurpose || !formData.num_floors || !formData.landArea) {
        setError("Please fill all required fields for Comprehensive Building Planning & Design.");
        setLoading(false);
        return;
      }
    } else if (formData.subService === "Construction Management & Cost Estimation") {
      if (!formData.constructionPermit || !formData.costEstimation) {
        setError("Please upload both Construction Permit and Cost Estimation Report.");
        setLoading(false);
        return;
      }
    } else if (formData.subService === "Structural & Geotechnical Consultation") {
      if (!formData.sitePlan || !formData.architecturalPlan || !formData.soilTestReport || !formData.foundationDesign) {
        setError("Please upload all required documents for Structural & Geotechnical Consultation.");
        setLoading(false);
        return;
      }
    } else if (formData.subService === "MEP System Design (Mechanical, Electrical & Plumbing)") {
      if (!formData.electricalPlan || !formData.plumbingPlan) {
        setError("Please upload both Electrical Plan and Plumbing Plan.");
        setLoading(false);
        return;
      }
    }

    const formDataToSend = new FormData();
    formDataToSend.append("full_name", formData.fullName || "");
    formDataToSend.append("location", formData.location || "");
    formDataToSend.append("email", formData.email || "");
    formDataToSend.append("phone_number", formData.phoneNumber || "");
    formDataToSend.append("category", formData.category || "");
    formDataToSend.append("sub_service", formData.subService || "");

    // Only append fields relevant to the selected sub-service
    if (formData.subService === "Comprehensive Building Planning & Design") {
      formDataToSend.append("type_of_building", formData.typeOfBuilding || "");
      formDataToSend.append("building_purpose", formData.buildingPurpose || "");
      formDataToSend.append("num_floors", formData.num_floors || "");
      formDataToSend.append("land_area", formData.landArea || "");
      formDataToSend.append("architectural_style", formData.architecturalStyle || "");
      formDataToSend.append("architectural_style_other", formData.architecturalStyleOther || "");
      formDataToSend.append("budget_estimate", formData.budgetEstimate || "");
      formDataToSend.append("special_requirements", formData.specialRequirements || "");
    } else if (formData.subService === "Structural & Geotechnical Consultation") {
      if (formData.sitePlan) formDataToSend.append("site_plan", formData.sitePlan);
      if (formData.architecturalPlan) formDataToSend.append("architectural_plan", formData.architecturalPlan);
      if (formData.soilTestReport) formDataToSend.append("soil_test_report", formData.soilTestReport);
      if (formData.foundationDesign) formDataToSend.append("foundation_design", formData.foundationDesign);
    } else if (formData.subService === "MEP System Design (Mechanical, Electrical & Plumbing)") {
      if (formData.electricalPlan) formDataToSend.append("electrical_plan", formData.electricalPlan);
      if (formData.plumbingPlan) formDataToSend.append("plumbing_plan", formData.plumbingPlan);
      if (formData.hvacPlan) formDataToSend.append("hvac_plan", formData.hvacPlan);
    } else if (formData.subService === "Construction Management & Cost Estimation") {
      if (formData.constructionPermit) formDataToSend.append("construction_permit", formData.constructionPermit);
      if (formData.costEstimation) formDataToSend.append("cost_estimation", formData.costEstimation);
    }

    try {
      let token = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      if (!token) {
        throw new Error("No access token found. Please log in.");
      }

      if (isTokenExpired(token) && refreshToken) {
        const refreshResponse = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
          refresh: refreshToken,
        });
        token = refreshResponse.data.access;
        localStorage.setItem("access_token", token);
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/api/submit-inquiry/${id}/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess(
        response.data.message || "Your inquiry has been submitted successfully! You will receive notification of your appointment details via email."
      );
      setTimeout(() => {
        setSuccess("");
      }, 5000);

      setFormData({
        fullName: "",
        location: "",
        email: "",
        phoneNumber: "",
        category: "",
        subService: "",
        typeOfBuilding: "",
        buildingPurpose: "",
        num_floors: 0,
        landArea: "",
        architecturalStyle: "",
        architecturalStyleOther: "",
        budgetEstimate: "",
        specialRequirements: "",
        sitePlan: null,
        architecturalPlan: null,
        soilTestReport: null,
        foundationDesign: null,
        electricalPlan: null,
        plumbingPlan: null,
        hvacPlan: null,
        constructionPermit: null,
        costEstimation: null,
      });
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      if (error.response) {
        if (error.response.status === 401) {
          handleAuthError(navigate);
          setError("Session expired. Please log in again.");
        } else if (error.response.status === 400) {
          setError(error.response.data.error || "Invalid form data. Please check your inputs and try again.");
        } else {
          setError("Failed to submit inquiry. Please try again or contact support.");
        }
      } else {
        setError(error.message || "Failed to submit inquiry. Please check your network connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderSubServiceForm = () => {
    switch (formData.subService) {
      case "Comprehensive Building Planning & Design":
        return (
          <>
            <Typography variant="h6" sx={{ mt: 3, color: "#1976d2", fontWeight: "bold" }}>
              Building Information
            </Typography>
            <Grid item xs={12}>
              <FormControl fullWidth required sx={{ mb: 2 }}>
                <InputLabel>Type of Building *</InputLabel>
                <Select
                  name="typeOfBuilding"
                  value={formData.typeOfBuilding}
                  onChange={handleInputChange}
                  sx={{ borderRadius: 1 }}
                >
                  <MenuItem value="">Select Type of Building</MenuItem>
                  <MenuItem value="Residential">Residential</MenuItem>
                  <MenuItem value="Commercial">Commercial</MenuItem>
                  <MenuItem value="Industrial">Industrial</MenuItem>
                  <MenuItem value="Institutional">Institutional</MenuItem>
                  <MenuItem value="Recreational">Recreational & Public Utility</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              {formData.typeOfBuilding === "Other" && (
                <TextField
                  label="Please Specify"
                  fullWidth
                  name="typeOfBuildingOther"
                  value={formData.typeOfBuildingOther || ""}
                  onChange={handleInputChange}
                  sx={{ mt: 2, mb: 2 }}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Building Purpose *"
                fullWidth
                name="buildingPurpose"
                value={formData.buildingPurpose}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Number of Floors Planned *"
                fullWidth
                type="number"
                name="num_floors"
                value={formData.num_floors === null ? "" : formData.num_floors}
                onChange={(e) => {
                  const value = e.target.value === "" ? null : parseInt(e.target.value, 10) || null;
                  setFormData((prev) => ({
                    ...prev,
                    num_floors: value < 1 || isNaN(value) ? null : value,
                  }));
                }}
                inputProps={{ min: 1 }}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Estimated Land Area (sq. ft. or sq. m.) *"
                fullWidth
                name="landArea"
                value={formData.landArea}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Preferred Architectural Style</InputLabel>
                <Select
                  name="architecturalStyle"
                  value={formData.architecturalStyle}
                  onChange={handleInputChange}
                  sx={{ borderRadius: 1 }}
                >
                  <MenuItem value="">Select Architectural Style</MenuItem>
                  <MenuItem value="Newar Architecture">Newar Architecture (Pagoda Style)</MenuItem>
                  <MenuItem value="Shikhara Style">Shikhara Style</MenuItem>
                  <MenuItem value="Himalayan Stone Houses">Himalayan Stone Houses</MenuItem>
                  <MenuItem value="Modern Minimalist">Modern Minimalist</MenuItem>
                  <MenuItem value="Rana Palace Style">Rana Palace Style</MenuItem>
                  <MenuItem value="Eco-Friendly Sustainable">Eco-Friendly & Sustainable</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              {formData.architecturalStyle === "Other" && (
                <TextField
                  label="Please Specify"
                  fullWidth
                  name="architecturalStyleOther"
                  value={formData.architecturalStyleOther || ""}
                  onChange={handleInputChange}
                  sx={{ mt: 2, mb: 2 }}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Budget Estimate (if available)"
                fullWidth
                name="budgetEstimate"
                value={formData.budgetEstimate}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Special Requirements (if any)"
                fullWidth
                multiline
                rows={3}
                name="specialRequirements"
                value={formData.specialRequirements}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
            </Grid>
          </>
        );

      case "Structural & Geotechnical Consultation":
        return (
          <>
            <Typography variant="h6" sx={{ mt: 3, color: "#1976d2", fontWeight: "bold" }}>
              Required Documents
            </Typography>
            <Grid item xs={12}>
              <Typography>Upload Site Plan *</Typography>
              <input
                type="file"
                name="sitePlan"
                accept=".pdf,.jpg,.png"
                onChange={handleFileUpload}
                style={{ margin: "10px 0" }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Upload Architectural Plan *</Typography>
              <input
                type="file"
                name="architecturalPlan"
                accept=".pdf,.jpg,.png"
                onChange={handleFileUpload}
                style={{ margin: "10px 0" }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Upload Soil Test Report *</Typography>
              <input
                type="file"
                name="soilTestReport"
                accept=".pdf,.jpg,.png"
                onChange={handleFileUpload}
                style={{ margin: "10px 0" }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Upload Foundation Design Report *</Typography>
              <input
                type="file"
                name="foundationDesign"
                accept=".pdf,.jpg,.png"
                onChange={handleFileUpload}
                style={{ margin: "10px 0" }}
                required
              />
            </Grid>
          </>
        );

      case "MEP System Design (Mechanical, Electrical & Plumbing)":
        return (
          <>
            <Typography variant="h6" sx={{ mt: 3, color: "#1976d2", fontWeight: "bold" }}>
              Required Documents
            </Typography>
            <Grid item xs={12}>
              <Typography>Upload Electrical Plan *</Typography>
              <input
                type="file"
                name="electricalPlan"
                accept=".pdf,.jpg,.png"
                onChange={handleFileUpload}
                style={{ margin: "10px 0" }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Upload Plumbing Plan *</Typography>
              <input
                type="file"
                name="plumbingPlan"
                accept=".pdf,.jpg,.png"
                onChange={handleFileUpload}
                style={{ margin: "10px 0" }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Upload HVAC Plan (if applicable)</Typography>
              <input
                type="file"
                name="hvacPlan"
                accept=".pdf,.jpg,.png"
                onChange={handleFileUpload}
                style={{ margin: "10px 0" }}
              />
            </Grid>
          </>
        );

      case "Construction Management & Cost Estimation":
        return (
          <>
            <Typography variant="h6" sx={{ mt: 3, color: "#1976d2", fontWeight: "bold" }}>
              Required Documents
            </Typography>
            <Grid item xs={12}>
              <Typography>Upload Construction Permit *</Typography>
              <input
                type="file"
                name="constructionPermit"
                accept=".pdf,.jpg,.png"
                onChange={handleFileUpload}
                style={{ margin: "10px 0" }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Upload Cost Estimation Report *</Typography>
              <input
                type="file"
                name="costEstimation"
                accept=".pdf,.jpg,.png"
                onChange={handleFileUpload}
                style={{ margin: "10px 0" }}
                required
              />
            </Grid>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <ClientNavbar wishlist={wishlist} cartItems={cartItems} onNavigateToProfile={handleNavigateToProfile} />
      <Box
        sx={{
          p: 4,
          minHeight: "100vh",
          mt: 10,
          backgroundColor: "#f5f5f5",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: "800px",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography variant="h4" sx={{ mb: 3, color: "#1976d2", fontWeight: "bold" }}>
                Consulting Inquiry Form
              </Typography>

              {error && (
                <Grid item xs={12} sx={{ mb: 2 }}>
                  <Alert
                    severity="error"
                    onClose={() => setError("")}
                    sx={{ borderRadius: 1 }}
                  >
                    {error}
                  </Alert>
                </Grid>
              )}

              {success && (
                <Grid item xs={12} sx={{ mb: 2 }}>
                  <Alert
                    severity="success"
                    onClose={() => setSuccess("")}
                    sx={{ borderRadius: 1 }}
                  >
                    {success}
                  </Alert>
                </Grid>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Full Name *"
                      fullWidth
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Location *"
                      fullWidth
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email *"
                      fullWidth
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      type="email"
                      variant="outlined"
                      sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone Number *"
                      fullWidth
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required sx={{ mb: 2 }}>
                      <InputLabel>Category *</InputLabel>
                      <Select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                      >
                        <MenuItem value="" disabled>
                          Select a Category
                        </MenuItem>
                        {Array.from(new Set(companyServices.map((service) => service.category))).map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required sx={{ mb: 2 }}>
                      <InputLabel>Sub-Service *</InputLabel>
                      <Select
                        name="subService"
                        value={formData.subService}
                        onChange={handleInputChange}
                        disabled={!formData.category}
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                      >
                        <MenuItem value="" disabled>
                          Select a Sub-Service
                        </MenuItem>
                        {companyServices
                          .filter((service) => service.category === formData.category)
                          .map((service) => (
                            <MenuItem key={service.id} value={service.sub_service}>
                              {service.sub_service}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: "#fff3e0",
                        borderLeft: "4px solid #ff9800",
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <InfoIcon sx={{ color: "#ff9800", mr: 1 }} />
                      <Typography variant="body1" sx={{ fontWeight: "bold", color: "#333" }}>
                        Important: Please bring the following documents when you come for your appointment:
                      </Typography>
                      <Typography variant="body2" sx={{ ml: 2, color: "#666" }}>
                        - Napi Naksha
                        <br />
                        - Lalpurja
                        <br />
                        - Citizenship
                        <br />
                        - Tiro Tireyko Rasid (Tax Clearance Receipt of Land)
                      </Typography>
                    </Box>
                  </Grid>

                  {renderSubServiceForm()}

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={loading}
                      sx={{
                        mt: 2,
                        py: 1.5,
                        borderRadius: 1,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                        },
                      }}
                    >
                      {loading ? "Submitting..." : "Submit Inquiry"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default CDConsultingInquiryForm;