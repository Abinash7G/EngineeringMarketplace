// import React from "react";
// import {
//   TextField,
//   Grid,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Typography,
//   Box,
// } from "@mui/material";
// import InfoIcon from "@mui/icons-material/Info";

// const EngineeringConsultingForm = ({ formData, onInputChange, onFileUpload, subService }) => {
//   return (
//     <>
//       <Grid item xs={12} sx={{ mb: 3 }}>
//         <Box
//           sx={{
//             p: 2,
//             backgroundColor: "#fff3e0",
//             borderLeft: "4px solid #ff9800",
//             borderRadius: 1,
//             display: "flex",
//             alignItems: "center",
//           }}
//         >
//           <InfoIcon sx={{ color: "#ff9800", mr: 1 }} />
//           <Typography variant="body1" sx={{ fontWeight: "bold", color: "#333" }}>
//             Important: Please bring the following documents when you come for your appointment:
//           </Typography>
//           <Typography variant="body2" sx={{ ml: 2, color: "#666" }}>
//             - Napi Naksha
//             <br />
//             - Lalpurja
//             <br />
//             - Citizenship
//             <br />
//             - Tiro Tireyko Rasid (Tax Clearance Receipt of Land)
//           </Typography>
//         </Box>
//       </Grid>

//       {subService === "Comprehensive Building Planning & Design" && (
//         <>
//           <Typography variant="h6" sx={{ mt: 3, color: "#1976d2", fontWeight: "bold" }}>
//             Building Information
//           </Typography>
//           <Grid item xs={12}>
//             <FormControl fullWidth required sx={{ mb: 2 }}>
//               <InputLabel>Type of Building *</InputLabel>
//               <Select
//                 name="typeOfBuilding"
//                 value={formData.typeOfBuilding}
//                 onChange={onInputChange}
//                 sx={{ borderRadius: 1 }}
//               >
//                 <MenuItem value="">Select Type of Building</MenuItem>
//                 <MenuItem value="Residential">Residential</MenuItem>
//                 <MenuItem value="Commercial">Commercial</MenuItem>
//                 <MenuItem value="Institutional">Institutional</MenuItem>
//                 <MenuItem value="Recreational">Recreational & Public Utility</MenuItem>
//                 <MenuItem value="Other">Other</MenuItem>
//               </Select>
//             </FormControl>
//             {formData.typeOfBuilding === "Other" && (
//               <TextField
//                 label="Please Specify"
//                 fullWidth
//                 name="typeOfBuildingOther"
//                 value={formData.typeOfBuildingOther || ""}
//                 onChange={onInputChange}
//                 sx={{ mt: 2, mb: 2 }}
//               />
//             )}
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Building Purpose *"
//               fullWidth
//               name="buildingPurpose"
//               value={formData.buildingPurpose}
//               onChange={onInputChange}
//               required
//               sx={{ mb: 2 }}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Number of Floors Planned *"
//               fullWidth
//               type="number"
//               name="num_floors"
//               value={formData.num_floors === null ? "" : formData.num_floors}
//               onChange={(e) => {
//                 const value = e.target.value === "" ? null : parseInt(e.target.value, 10) || null;
//                 onInputChange({ target: { name: "num_floors", value: value < 1 || isNaN(value) ? null : value } });
//               }}
//               inputProps={{ min: 1 }}
//               required
//               sx={{ mb: 2 }}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Estimated Land Area (sq. ft. or sq. m.) *"
//               fullWidth
//               name="landArea"
//               value={formData.landArea}
//               onChange={onInputChange}
//               required
//               sx={{ mb: 2 }}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <FormControl fullWidth sx={{ mb: 2 }}>
//               <InputLabel>Preferred Architectural Style</InputLabel>
//               <Select
//                 name="architecturalStyle"
//                 value={formData.architecturalStyle}
//                 onChange={onInputChange}
//                 sx={{ borderRadius: 1 }}
//               >
//                 <MenuItem value="">Select Architectural Style</MenuItem>
//                 <MenuItem value="Newar Architecture">Newar Architecture (Pagoda Style)</MenuItem>
//                 <MenuItem value="Shikhara Style">Shikhara Style</MenuItem>
//                 <MenuItem value="Himalayan Stone Houses">Himalayan Stone Houses</MenuItem>
//                 <MenuItem value="Modern Minimalist">Modern Minimalist</MenuItem>
//                 <MenuItem value="Rana Palace Style">Rana Palace Style</MenuItem>
//                 <MenuItem value="Eco-Friendly Sustainable">Eco-Friendly & Sustainable</MenuItem>
//                 <MenuItem value="Other">Other</MenuItem>
//               </Select>
//             </FormControl>
//             {formData.architecturalStyle === "Other" && (
//               <TextField
//                 label="Please Specify"
//                 fullWidth
//                 name="architecturalStyleOther"
//                 value={formData.architecturalStyleOther || ""}
//                 onChange={onInputChange}
//                 sx={{ mt: 2, mb: 2 }}
//               />
//             )}
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Budget Estimate (if available)"
//               fullWidth
//               name="budgetEstimate"
//               value={formData.budgetEstimate}
//               onChange={onInputChange}
//               sx={{ mb: 2 }}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Special Requirements (if any)"
//               fullWidth
//               multiline
//               rows={3}
//               name="specialRequirements"
//               value={formData.specialRequirements}
//               onChange={onInputChange}
//               sx={{ mb: 2 }}
//             />
//           </Grid>
//         </>
//       )}

//       {subService === "Structural & Geotechnical Consultation" && (
//         <>
//           <Typography variant="h6" sx={{ mt: 3, color: "#1976d2", fontWeight: "bold" }}>
//             Required Documents
//           </Typography>
//           <Grid item xs={12}>
//             <Typography>Upload Site Plan *</Typography>
//             <input
//               type="file"
//               name="sitePlan"
//               accept=".pdf,.jpg,.png"
//               onChange={onFileUpload}
//               style={{ margin: "10px 0" }}
//               required
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <Typography>Upload Architectural Plan *</Typography>
//             <input
//               type="file"
//               name="architecturalPlan"
//               accept=".pdf,.jpg,.png"
//               onChange={onFileUpload}
//               style={{ margin: "10px 0" }}
//               required
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <Typography>Upload Soil Test Report *</Typography>
//             <input
//               type="file"
//               name="soilTestReport"
//               accept=".pdf,.jpg,.png"
//               onChange={onFileUpload}
//               style={{ margin: "10px 0" }}
//               required
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <Typography>Upload Foundation Design Report *</Typography>
//             <input
//               type="file"
//               name="foundationDesign"
//               accept=".pdf,.jpg,.png"
//               onChange={onFileUpload}
//               style={{ margin: "10px 0" }}
//               required
//             />
//           </Grid>
//         </>
//       )}

//       {subService === "MEP System Design (Mechanical, Electrical & Plumbing)" && (
//         <>
//           <Typography variant="h6" sx={{ mt: 3, color: "#1976d2", fontWeight: "bold" }}>
//             Required Documents
//           </Typography>
//           <Grid item xs={12}>
//             <Typography>Upload Electrical Plan *</Typography>
//             <input
//               type="file"
//               name="electricalPlan"
//               accept=".pdf,.jpg,.png"
//               onChange={onFileUpload}
//               style={{ margin: "10px 0" }}
//               required
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <Typography>Upload Plumbing Plan *</Typography>
//             <input
//               type="file"
//               name="plumbingPlan"
//               accept=".pdf,.jpg,.png"
//               onChange={onFileUpload}
//               style={{ margin: "10px 0" }}
//               required
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <Typography>Upload HVAC Plan (if applicable)</Typography>
//             <input
//               type="file"
//               name="hvacPlan"
//               accept=".pdf,.jpg,.png"
//               onChange={onFileUpload}
//               style={{ margin: "10px 0" }}
//             />
//           </Grid>
//         </>
//       )}

//       {subService === "Construction Management & Cost Estimation" && (
//         <>
//           <Typography variant="h6" sx={{ mt: 3, color: "#1976d2", fontWeight: "bold" }}>
//             Required Documents
//           </Typography>
//           <Grid item xs={12}>
//             <Typography>Upload Construction Permit *</Typography>
//             <input
//               type="file"
//               name="constructionPermit"
//               accept=".pdf,.jpg,.png"
//               onChange={onFileUpload}
//               style={{ margin: "10px 0" }}
//               required
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <Typography>Upload Cost Estimation Report *</Typography>
//             <input
//               type="file"
//               name="costEstimation"
//               accept=".pdf,.jpg,.png"
//               onChange={onFileUpload}
//               style={{ margin: "10px 0" }}
//               required
//             />
//           </Grid>
//         </>
//       )}
//     </>
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
      {/* Important Documents Notice */}
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

      {/* Comprehensive Building Planning & Design Sub-Service */}
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

      {/* Structural & Geotechnical Consultation Sub-Service */}
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

      {/* MEP System Design Sub-Service */}
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

      {/* Construction Management & Cost Estimation Sub-Service */}
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