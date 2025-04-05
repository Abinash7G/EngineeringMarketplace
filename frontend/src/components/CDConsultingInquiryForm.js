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
import EngineeringConsultingForm from "./EngineeringConsultingForm";
import BuildingConstructionForm from "./BuildingConstructionForm";
import PostConstructionMaintenanceForm from "./PostConstructionMaintenanceForm";
import SafetyTrainingForm from "./SafetyTrainingForm";

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
    
    // Engineering Consulting fields
    typeOfBuilding: "",
    buildingPurpose: "",
    num_floors: null,
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
    
    // Building Construction fields
    hasMunicipalApproval: false,
    landDispute: "",
    landDisputeDetails: "",
    neighborConsentLetter: null,
    existingBuildingDetails: "",
    areaToRenovate: "",
    existingBuildingPlan: null,
    lalpurja: null,
    napiNaksa: null,
    taxClearance: null,
    approvedBuildingDrawings: null,
    structuralStabilityCertificate: null,
    houseDesignApproval: null,
    ieeReport: null,
    fireSafetyCertificate: null,
    liftPermit: null,
    parkingLayoutPlan: null,
    ownerPermissionLetter: null,
    existingStructureAnalysis: null,
    renovationPlan: null,
    nocMunicipality: null,
    wasteManagementPlan: null,
    
    // Post-Construction Maintenance fields
    maintenanceType: "",
    maintenanceDetails: "",
    maintenancePhotos: null,
    preferredDate: "",
    preferredTime: "",
    specificTime: "",
    paymentAgreed: false,
    
    // Safety Training fields
    languagePreference: "",
    languagePreferenceOther: "",
    trainingDate: "",
    trainingTime: "",
    specificTrainingTime: "",
    trainingAgreement: false,
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

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleFileUpload = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleFormDataChange = (updatedData) => {
    setFormData({ ...formData, ...updatedData });
  };

  const categories = Array.from(new Set(companyServices.map((service) => service.category)));
  const subServices = companyServices
    .filter((service) => service.category === formData.category)
    .map((service) => service.sub_service);

  const renderCategoryForm = () => {
    switch (formData.category) {
      case "Engineering Consulting":
        return (
          <EngineeringConsultingForm
            formData={formData}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            subService={formData.subService}
          />
        );
      case "Building Construction Services":
        return (
          <BuildingConstructionForm
            formData={formData}
            onInputChange={handleInputChange}
            onCheckboxChange={handleCheckboxChange}
            onFileUpload={handleFileUpload}
            onFormDataChange={handleFormDataChange}
            subService={formData.subService}
          />
        );
      case "Post-Construction Maintenance":
        return (
          <PostConstructionMaintenanceForm
            formData={formData}
            onInputChange={handleInputChange}
            onCheckboxChange={handleCheckboxChange}
            onFileUpload={handleFileUpload}
            subService={formData.subService}
          />
        );
      case "Safety and Training Services":
        return (
          <SafetyTrainingForm
            formData={formData}
            onInputChange={handleInputChange}
            onCheckboxChange={handleCheckboxChange}
            subService={formData.subService}
          />
        );
      default:
        return null;
    }
  };

  const prepareFormData = () => {
    const formDataToSend = new FormData();
    
    // Common fields
    formDataToSend.append("full_name", formData.fullName || "");
    formDataToSend.append("location", formData.location || "");
    formDataToSend.append("email", formData.email || "");
    formDataToSend.append("phone_number", formData.phoneNumber || "");
    formDataToSend.append("category", formData.category || "");
    formDataToSend.append("sub_service", formData.subService || "");

    // Service-specific fields
    switch(formData.category) {
      case "Engineering Consulting":
        // Engineering fields
        formDataToSend.append("type_of_building", formData.typeOfBuilding || "");
        formDataToSend.append("building_purpose", formData.buildingPurpose || "");
        // Only append num_floors if it's a valid number
        if (formData.num_floors !== null && !isNaN(formData.num_floors) && formData.num_floors > 0) {
          formDataToSend.append("num_floors", formData.num_floors);
        }
        formDataToSend.append("land_area", formData.landArea || "");
        formDataToSend.append("architectural_style", formData.architecturalStyle || "");
        formDataToSend.append("architectural_style_other", formData.architecturalStyleOther || "");
        formDataToSend.append("budget_estimate", formData.budgetEstimate || "");
        formDataToSend.append("special_requirements", formData.specialRequirements || "");
        
        // Engineering files
        if (formData.sitePlan) formDataToSend.append("site_plan", formData.sitePlan);
        if (formData.architecturalPlan) formDataToSend.append("architectural_plan", formData.architecturalPlan);
        if (formData.soilTestReport) formDataToSend.append("soil_test_report", formData.soilTestReport);
        if (formData.foundationDesign) formDataToSend.append("foundation_design", formData.foundationDesign);
        if (formData.electricalPlan) formDataToSend.append("electrical_plan", formData.electricalPlan);
        if (formData.plumbingPlan) formDataToSend.append("plumbing_plan", formData.plumbingPlan);
        if (formData.hvacPlan) formDataToSend.append("hvac_plan", formData.hvacPlan);
        if (formData.constructionPermit) formDataToSend.append("construction_permit", formData.constructionPermit);
        if (formData.costEstimation) formDataToSend.append("cost_estimation", formData.costEstimation);
        break;

      case "Building Construction Services":
        // Common construction files
        if (formData.lalpurja) formDataToSend.append("lalpurja", formData.lalpurja);
        if (formData.napiNaksa) formDataToSend.append("napi_naksa", formData.napiNaksa);
        if (formData.taxClearance) formDataToSend.append("tax_clearance", formData.taxClearance);
        if (formData.approvedBuildingDrawings) formDataToSend.append("approved_building_drawings", formData.approvedBuildingDrawings);
        
        // Sub-service specific handling
        if (formData.subService === "Residential Construction") {
          if (formData.soilTestReport) formDataToSend.append("soil_test_report", formData.soilTestReport);
          if (formData.structuralStabilityCertificate) formDataToSend.append("structural_stability_certificate", formData.structuralStabilityCertificate);
          if (formData.houseDesignApproval) formDataToSend.append("house_design_approval", formData.houseDesignApproval);
          if (formData.neighborConsentLetter) formDataToSend.append("neighbor_consent_letter", formData.neighborConsentLetter);
        } 
        else if (formData.subService === "Commercial Construction") {
          if (formData.ieeReport) formDataToSend.append("iee_report", formData.ieeReport);
          if (formData.fireSafetyCertificate) formDataToSend.append("fire_safety_certificate", formData.fireSafetyCertificate);
          if (formData.liftPermit) formDataToSend.append("lift_permit", formData.liftPermit);
          if (formData.parkingLayoutPlan) formDataToSend.append("parking_layout_plan", formData.parkingLayoutPlan);
          formDataToSend.append("special_requirements", formData.specialRequirements || "");
        } 
        else if (formData.subService === "Renovation and Remodeling Services") {
          formDataToSend.append("type_of_building", formData.typeOfBuilding || "");
          formDataToSend.append("existing_building_details", formData.existingBuildingDetails || "");
          formDataToSend.append("area_to_renovate", formData.areaToRenovate || "");
          formDataToSend.append("budget_estimate", formData.budgetEstimate || "");
          formDataToSend.append("special_requirements", formData.specialRequirements || "");
          
          if (formData.ownerPermissionLetter) formDataToSend.append("owner_permission_letter", formData.ownerPermissionLetter);
          if (formData.existingStructureAnalysis) formDataToSend.append("existing_structure_analysis", formData.existingStructureAnalysis);
          if (formData.renovationPlan) formDataToSend.append("renovation_plan", formData.renovationPlan);
          if (formData.nocMunicipality) formDataToSend.append("noc_municipality", formData.nocMunicipality);
          if (formData.wasteManagementPlan) formDataToSend.append("waste_management_plan", formData.wasteManagementPlan);
        }
        break;

      case "Post-Construction Maintenance":
        formDataToSend.append("maintenance_type", formData.maintenanceType || "");
        formDataToSend.append("maintenance_details", formData.maintenanceDetails || "");
        formDataToSend.append("preferred_date", formData.preferredDate || "");
        formDataToSend.append("preferred_time", 
          formData.preferredTime === "Specific Time" ? formData.specificTime : formData.preferredTime || "");
        formDataToSend.append("payment_agreed", formData.paymentAgreed ? "True" : "False");
        
        if (formData.maintenancePhotos) formDataToSend.append("maintenance_photos", formData.maintenancePhotos);
        break;

      case "Safety and Training Services":
        formDataToSend.append("language_preference", 
          formData.languagePreference === "Other" ? formData.languagePreferenceOther : formData.languagePreference || "");
        formDataToSend.append("training_date", formData.trainingDate || "");
        formDataToSend.append("training_time", 
          formData.trainingTime === "Specific Time" ? formData.specificTrainingTime : formData.trainingTime || "");
        formDataToSend.append("training_agreement", formData.trainingAgreement ? "True" : "False");
        break;
    }

    return formDataToSend;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.fullName || !formData.location || !formData.email || 
        !formData.phoneNumber || !formData.category || !formData.subService) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = prepareFormData();
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

      setSuccess("Inquiry submitted successfully! You will receive notification of your appointment details via email.");
      
      // Reset form after successful submission
      setFormData({
        fullName: "",
        location: "",
        email: "",
        phoneNumber: "",
        category: "",
        subService: "",
        typeOfBuilding: "",
        buildingPurpose: "",
        num_floors: null,
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
        hasMunicipalApproval: false,
        landDispute: "",
        landDisputeDetails: "",
        neighborConsentLetter: null,
        existingBuildingDetails: "",
        areaToRenovate: "",
        existingBuildingPlan: null,
        lalpurja: null,
        napiNaksa: null,
        taxClearance: null,
        approvedBuildingDrawings: null,
        structuralStabilityCertificate: null,
        houseDesignApproval: null,
        ieeReport: null,
        fireSafetyCertificate: null,
        liftPermit: null,
        parkingLayoutPlan: null,
        ownerPermissionLetter: null,
        existingStructureAnalysis: null,
        renovationPlan: null,
        nocMunicipality: null,
        wasteManagementPlan: null,
        maintenanceType: "",
        maintenanceDetails: "",
        maintenancePhotos: null,
        preferredDate: "",
        preferredTime: "",
        specificTime: "",
        paymentAgreed: false,
        languagePreference: "",
        languagePreferenceOther: "",
        trainingDate: "",
        trainingTime: "",
        specificTrainingTime: "",
        trainingAgreement: false,
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
                Inquiry Form
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
                        onChange={(e) => {
                          setFormData({ ...formData, category: e.target.value, subService: "" });
                        }}
                        sx={{ borderRadius: 1 }}
                      >
                        <MenuItem value="" disabled>
                          Select a Category
                        </MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {formData.category && (
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required sx={{ mb: 2 }}>
                        <InputLabel>Sub-Service *</InputLabel>
                        <Select
                          name="subService"
                          value={formData.subService}
                          onChange={handleInputChange}
                          sx={{ borderRadius: 1 }}
                        >
                          <MenuItem value="" disabled>
                            Select a Sub-Service
                          </MenuItem>
                          {subServices.map((subService) => (
                            <MenuItem key={subService} value={subService}>
                              {subService}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}

                  {formData.subService && renderCategoryForm()}

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