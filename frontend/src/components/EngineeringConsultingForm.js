// // EngineeringConsultingForm.js
// import React, { useState } from 'react';
// import {
//   Box,
//   TextField,
//   Button,
//   MenuItem,
//   Typography,
//   CircularProgress,
//   Alert,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
// } from '@mui/material';
// import { Info as InfoIcon } from '@mui/icons-material';
// import axios from 'axios';

// const EngineeringConsultingForm = ({ companyId, onClose, subServices }) => {
//   const [formData, setFormData] = useState({
//     full_name: '',
//     location: '',
//     email: '',
//     phone_number: '',
//     sub_service: '',
//     type_of_building: '',
//     building_purpose: '',
//     num_floors: '',
//     land_area: '',
//     architectural_style: '',
//     budget_estimate: '',
//     special_requirements: '',
//     preferred_service_time: '',
//     site_plan: null,
//     architectural_plan: null,
//     soil_test_report: null,
//     foundation_design: null,
//     electrical_plan: null,
//     plumbing_plan: null,
//     hvac_plan: null,
//     construction_permit: null,
//     cost_estimation: null,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     setFormData({ ...formData, [name]: files[0] });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('access_token');
//       const formDataToSend = new FormData();
//       formDataToSend.append('category', 'Engineering Consulting');
//       for (const key in formData) {
//         if (formData[key]) {
//           formDataToSend.append(key, formData[key]);
//         }
//       }

//       const response = await axios.post(
//         `http://127.0.0.1:8000/api/company-inquiries/${companyId}/`,
//         formDataToSend,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );
//       alert(response.data.message);
//       onClose();
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to submit inquiry');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getRequiredDocuments = () => {
//     const docs = [];
//     if (formData.sub_service === 'Comprehensive Building Planning & Design') {
//       return docs;
//     } else if (formData.sub_service === 'Structural & Geotechnical Consultation') {
//       return [...docs, 'Site Plan', 'Architectural Plan', 'Soil Test Report', 'Foundation Design Report'];
//     } else if (formData.sub_service === 'MEP System Design (Mechanical, Electrical & Plumbing)') {
//       return [...docs, 'Electrical Plan', 'Plumbing Plan', 'HVAC Plan'];
//     } else if (formData.sub_service === 'Construction Management & Cost Estimation') {
//       return [...docs, 'Construction Permit', 'Cost Estimation Report'];
//     }
//     return docs;
//   };

//   const renderRequiredDocuments = () => {
//     const docs = getRequiredDocuments();
//     if (docs.length === 0) return null;

//     return (
//       <>
//         <Alert severity="info" sx={{ mb: 2 }}>
//           <Typography variant="body2">
//             <strong>Important:</strong> Please bring the following documents when you come for your appointment:
//           </Typography>
//           <List dense>
//             {docs.map((doc, index) => (
//               <ListItem key={index}>
//                 <ListItemIcon>
//                   <InfoIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText primary={doc} />
//               </ListItem>
//             ))}
//           </List>
//         </Alert>
//         <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
//           Required Documents
//         </Typography>
//         {formData.sub_service === 'Structural & Geotechnical Consultation' && (
//           <>
//             <TextField
//               label="Upload Site Plan"
//               name="site_plan"
//               type="file"
//               onChange={handleFileChange}
//               fullWidth
//               sx={{ mb: 2 }}
//               InputLabelProps={{ shrink: true }}
//               required
//             />
//             <TextField
//               label="Upload Architectural Plan"
//               name="architectural_plan"
//               type="file"
//               onChange={handleFileChange}
//               fullWidth
//               sx={{ mb: 2 }}
//               InputLabelProps={{ shrink: true }}
//               required
//             />
//             <TextField
//               label="Upload Soil Test Report"
//               name="soil_test_report"
//               type="file"
//               onChange={handleFileChange}
//               fullWidth
//               sx={{ mb: 2 }}
//               InputLabelProps={{ shrink: true }}
//               required
//             />
//             <TextField
//               label="Upload Foundation Design Report"
//               name="foundation_design"
//               type="file"
//               onChange={handleFileChange}
//               fullWidth
//               sx={{ mb: 2 }}
//               InputLabelProps={{ shrink: true }}
//               required
//             />
//           </>
//         )}
//         {formData.sub_service === 'MEP System Design (Mechanical, Electrical & Plumbing)' && (
//           <>
//             <TextField
//               label="Upload Electrical Plan"
//               name="electrical_plan"
//               type="file"
//               onChange={handleFileChange}
//               fullWidth
//               sx={{ mb: 2 }}
//               InputLabelProps={{ shrink: true }}
//               required
//             />
//             <TextField
//               label="Upload Plumbing Plan"
//               name="plumbing_plan"
//               type="file"
//               onChange={handleFileChange}
//               fullWidth
//               sx={{ mb: 2 }}
//               InputLabelProps={{ shrink: true }}
//               required
//             />
//             <TextField
//               label="Upload HVAC Plan (if applicable)"
//               name="hvac_plan"
//               type="file"
//               onChange={handleFileChange}
//               fullWidth
//               sx={{ mb: 2 }}
//               InputLabelProps={{ shrink: true }}
//             />
//           </>
//         )}
//         {formData.sub_service === 'Construction Management & Cost Estimation' && (
//           <>
//             <TextField
//               label="Upload Construction Permit"
//               name="construction_permit"
//               type="file"
//               onChange={handleFileChange}
//               fullWidth
//               sx={{ mb: 2 }}
//               InputLabelProps={{ shrink: true }}
//               required
//             />
//             <TextField
//               label="Upload Cost Estimation Report"
//               name="cost_estimation"
//               type="file"
//               onChange={handleFileChange}
//               fullWidth
//               sx={{ mb: 2 }}
//               InputLabelProps={{ shrink: true }}
//               required
//             />
//           </>
//         )}
//       </>
//     );
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" sx={{ mb: 3, color: 'primary.main' }}>
//         Engineering Consulting Inquiry Form
//       </Typography>
//       {error && (
//         <Typography color="error" sx={{ mb: 2 }}>
//           {error}
//         </Typography>
//       )}
//       <form onSubmit={handleSubmit}>
//         <TextField
//           label="Full Name"
//           name="full_name"
//           value={formData.full_name}
//           onChange={handleChange}
//           fullWidth
//           sx={{ mb: 2 }}
//           required
//         />
//         <TextField
//           label="Location"
//           name="location"
//           value={formData.location}
//           onChange={handleChange}
//           fullWidth
//           sx={{ mb: 2 }}
//           required
//         />
//         <TextField
//           label="Email"
//           name="email"
//           type="email"
//           value={formData.email}
//           onChange={handleChange}
//           fullWidth
//           sx={{ mb: 2 }}
//           required
//         />
//         <TextField
//           label="Phone Number"
//           name="phone_number"
//           value={formData.phone_number}
//           onChange={handleChange}
//           fullWidth
//           sx={{ mb: 2 }}
//           required
//         />
//         <TextField
//           select
//           label="Sub-Service"
//           name="sub_service"
//           value={formData.sub_service}
//           onChange={handleChange}
//           fullWidth
//           sx={{ mb: 2 }}
//           required
//         >
//           {subServices.map((subService, index) => (
//             <MenuItem key={index} value={subService}>
//               {subService}
//             </MenuItem>
//           ))}
//         </TextField>
//         {formData.sub_service === 'Comprehensive Building Planning & Design' && (
//           <>
//             <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
//               Building Information
//             </Typography>
//             <TextField
//               select
//               label="Type of Building"
//               name="type_of_building"
//               value={formData.type_of_building}
//               onChange={handleChange}
//               fullWidth
//               sx={{ mb: 2 }}
//             >
//               <MenuItem value="Residential">Residential</MenuItem>
//               <MenuItem value="Commercial">Commercial</MenuItem>
//             </TextField>
//             <TextField
//               label="Building Purpose"
//               name="building_purpose"
//               value={formData.building_purpose}
//               onChange={handleChange}
//               fullWidth
//               sx={{ mb: 2 }}
//               required
//             />
//             <TextField
//               label="Number of Floors Planned"
//               name="num_floors"
//               type="number"
//               value={formData.num_floors}
//               onChange={handleChange}
//               fullWidth
//               sx={{ mb: 2 }}
//               required
//             />
//             <TextField
//               label="Estimated Land Area (sq. ft. or sq. m.)"
//               name="land_area"
//               value={formData.land_area}
//               onChange={handleChange}
//               fullWidth
//               sx={{ mb: 2 }}
//               required
//             />
//             <TextField
//               select
//               label="Preferred Architectural Style"
//               name="architectural_style"
//               value={formData.architectural_style}
//               onChange={handleChange}
//               fullWidth
//               sx={{ mb: 2 }}
//             >
//               <MenuItem value="Modern">Modern</MenuItem>
//               <MenuItem value="Traditional">Traditional</MenuItem>
//               <MenuItem value="Contemporary">Contemporary</MenuItem>
//             </TextField>
//             <TextField
//               label="Budget Estimate (if available)"
//               name="budget_estimate"
//               value={formData.budget_estimate}
//               onChange={handleChange}
//               fullWidth
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               label="Special Requirements (if any)"
//               name="special_requirements"
//               value={formData.special_requirements}
//               onChange={handleChange}
//               fullWidth
//               multiline
//               rows={4}
//               sx={{ mb: 2 }}
//             />
//           </>
//         )}
//         {(formData.sub_service === 'Structural & Geotechnical Consultation' ||
//           formData.sub_service === 'MEP System Design (Mechanical, Electrical & Plumbing)' ||
//           formData.sub_service === 'Construction Management & Cost Estimation') && (
//           <>
//             <TextField
//               label="Special Requirements (if any)"
//               name="special_requirements"
//               value={formData.special_requirements}
//               onChange={handleChange}
//               fullWidth
//               multiline
//               rows={4}
//               sx={{ mb: 2 }}
//             />
//           </>
//         )}
//         <TextField
//           label="Preferred Service Time"
//           name="preferred_service_time"
//           type="datetime-local"
//           value={formData.preferred_service_time}
//           onChange={handleChange}
//           fullWidth
//           sx={{ mb: 2 }}
//           InputLabelProps={{ shrink: true }}
//         />
//         {renderRequiredDocuments()}
//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           disabled={loading}
//           sx={{ mt: 3, width: '100%' }}
//         >
//           {loading ? <CircularProgress size={24} /> : 'Submit Inquiry'}
//         </Button>
//       </form>
//     </Box>
//   );
// };

// export default EngineeringConsultingForm;

import React from "react";
import {
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const EngineeringConsultingForm = ({ formData, onInputChange, onFileUpload, subService }) => {
  return (
    <>
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

      {subService === "Comprehensive Building Planning & Design" && (
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
                onChange={onInputChange}
                sx={{ borderRadius: 1 }}
              >
                <MenuItem value="">Select Type of Building</MenuItem>
                <MenuItem value="Residential">Residential</MenuItem>
                <MenuItem value="Commercial">Commercial</MenuItem>
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
                onChange={onInputChange}
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
              onChange={onInputChange}
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
                onInputChange({ target: { name: "num_floors", value: value < 1 || isNaN(value) ? null : value } });
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
              onChange={onInputChange}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
              sx={{ mb: 2 }}
            />
          </Grid>
        </>
      )}

      {subService === "Structural & Geotechnical Consultation" && (
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
              onChange={onFileUpload}
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
              onChange={onFileUpload}
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
              onChange={onFileUpload}
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
              onChange={onFileUpload}
              style={{ margin: "10px 0" }}
              required
            />
          </Grid>
        </>
      )}

      {subService === "MEP System Design (Mechanical, Electrical & Plumbing)" && (
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
              onChange={onFileUpload}
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
              onChange={onFileUpload}
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
              onChange={onFileUpload}
              style={{ margin: "10px 0" }}
            />
          </Grid>
        </>
      )}

      {subService === "Construction Management & Cost Estimation" && (
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
              onChange={onFileUpload}
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
              onChange={onFileUpload}
              style={{ margin: "10px 0" }}
              required
            />
          </Grid>
        </>
      )}
    </>
  );
};

export default EngineeringConsultingForm;