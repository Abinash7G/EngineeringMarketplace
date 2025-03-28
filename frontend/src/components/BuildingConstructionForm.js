
// // import React from "react";
// // import {
// //   TextField,
// //   Grid,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   MenuItem,
// //   Typography,
// //   Box,
// //   FormControlLabel,
// //   Checkbox,
// // } from "@mui/material";

// // const BuildingConstructionForm = ({
// //   formData,
// //   onInputChange,
// //   onCheckboxChange,
// //   onFileUpload,
// //   subService,
// // }) => {
// //   // Render common fields (Municipal Approval and Required Documents)
// //   const renderCommonFields = () => (
// //     <Box sx={{ p: 2 }}>
// //       {/* Municipal Approval Section */}
// //       <Grid item xs={12}>
// //         <Typography variant="h6" sx={{ mb: 2, color: "#1976d2", fontWeight: "bold" }}>
// //           Municipal Approval Process
// //         </Typography>
// //         <FormControlLabel
// //           control={
// //             <Checkbox
// //               name="hasMunicipalApproval"
// //               checked={formData.hasMunicipalApproval}
// //               onChange={onCheckboxChange}
// //             />
// //           }
// //           label="I have already completed the municipal approval process (e.g., design approval, plinth level approval)."
// //         />
// //       </Grid>

// //       {!formData.hasMunicipalApproval && (
// //         <>
// //           <Grid item xs={12}>
// //             <Typography variant="body1" sx={{ mt: 2, mb: 2, color: "#666" }}>
// //               Note: If you want the company to handle the municipal approval process, additional charges may apply. 
// //               Construction may pause during approvals (e.g., 15-day public notice period, inspections).
// //             </Typography>
// //           </Grid>
// //           <Grid item xs={12}>
// //             <FormControlLabel
// //               control={
// //                 <Checkbox
// //                   name="landDispute"
// //                   checked={formData.landDispute}
// //                   onChange={onCheckboxChange}
// //                 />
// //               }
// //               label="Do you have any disputes on this land?"
// //             />
// //           </Grid>
// //           {formData.landDispute && (
// //             <Grid item xs={12}>
// //               <TextField
// //                 label="Please Explain the Dispute"
// //                 fullWidth
// //                 name="landDisputeDetails"
// //                 value={formData.landDisputeDetails}
// //                 onChange={onInputChange}
// //                 multiline
// //                 rows={3}
// //                 sx={{ mb: 2 }}
// //               />
// //             </Grid>
// //           )}
// //           <Grid item xs={12}>
// //             <Typography>Upload Neighbor Consent Letter (if required for 4 Killa verification)</Typography>
// //             <input
// //               type="file"
// //               name="neighborConsentLetter"
// //               accept=".pdf,.jpg,.png"
// //               onChange={onFileUpload}
// //               style={{ margin: "10px 0" }}
// //             />
// //           </Grid>
// //         </>
// //       )}

// //       {/* Required Documents */}
// //       <Grid item xs={12}>
// //         <Typography variant="h6" sx={{ mb: 2, mt: 3, color: "#1976d2", fontWeight: "bold" }}>
// //           Required Documents
// //         </Typography>
// //       </Grid>
// //       <Grid item xs={12}>
// //         <Typography>Upload Napi Naksha (Blueprint) *</Typography>
// //         <input
// //           type="file"
// //           name="napiNaksha"
// //           accept=".pdf,.jpg,.png"
// //           onChange={onFileUpload}
// //           style={{ margin: "10px 0" }}
// //           required
// //         />
// //       </Grid>
// //       <Grid item xs={12}>
// //         <Typography>Upload Lalpurja (Land Ownership Certificate) *</Typography>
// //         <input
// //           type="file"
// //           name="lalpurja"
// //           accept=".pdf,.jpg,.png"
// //           onChange={onFileUpload}
// //           style={{ margin: "10px 0" }}
// //           required
// //         />
// //       </Grid>
// //       <Grid item xs={12}>
// //         <Typography>Upload Citizenship Certificate *</Typography>
// //         <input
// //           type="file"
// //           name="citizenship"
// //           accept=".pdf,.jpg,.png"
// //           onChange={onFileUpload}
// //           style={{ margin: "10px 0" }}
// //           required
// //         />
// //       </Grid>
// //       <Grid item xs={12}>
// //         <Typography>Upload Land Tax Clearance Paper *</Typography>
// //         <input
// //           type="file"
// //           name="landTaxClearance"
// //           accept=".pdf,.jpg,.png"
// //           onChange={onFileUpload}
// //           style={{ margin: "10px 0" }}
// //           required
// //         />
// //       </Grid>
// //       <Grid item xs={12}>
// //         <Typography>Upload Approved Design by Municipality (if available)</Typography>
// //         <input
// //           type="file"
// //           name="approvedDesign"
// //           accept=".pdf,.jpg,.png"
// //           onChange={onFileUpload}
// //           style={{ margin: "10px 0" }}
// //         />
// //       </Grid>
// //     </Box>
// //   );

// //   // Render Residential Form
// //   const renderResidentialForm = () => (
// //     <Box sx={{ p: 2 }}>
// //       <Grid item xs={12}>
// //         <Typography variant="h6" sx={{ mt: 3, color: "#1976d2", fontWeight: "bold" }}>
// //           Residential Construction Information
// //         </Typography>
// //       </Grid>
// //       <Grid item xs={12}>
// //         <TextField
// //           label="Building Purpose (e.g., Family Home, Rental Property) *"
// //           fullWidth
// //           name="buildingPurpose"
// //           value={formData.buildingPurpose}
// //           onChange={onInputChange}
// //           required
// //           sx={{ mb: 2 }}
// //         />
// //       </Grid>
// //       <Grid item xs={12}>
// //         <TextField
// //           label="Number of Floors Planned *"
// //           fullWidth
// //           type="number"
// //           name="numFloors"
// //           value={formData.numFloors}
// //           onChange={onInputChange}
// //           inputProps={{ min: 1 }}
// //           required
// //           sx={{ mb: 2 }}
// //         />
// //       </Grid>
// //       <Grid item xs={12}>
// //         <TextField
// //           label="Estimated Land Area (sq. ft. or sq. m.) *"
// //           fullWidth
// //           name="landArea"
// //           value={formData.landArea}
// //           onChange={onInputChange}
// //           required
// //           sx={{ mb: 2 }}
// //         />
// //       </Grid>
// //       <Grid item xs={12}>
// //         <Typography>Upload Structural Analysis Report (Required for Plinth Approval)</Typography>
// //         <input
// //           type="file"
// //           name="structuralAnalysisReport"
// //           accept=".pdf"
// //           onChange={onFileUpload}
// //           style={{ margin: "10px 0" }}
// //         />
// //       </Grid>
// //       <Grid item xs={12}>
// //         <FormControl fullWidth sx={{ mb: 2 }}>
// //           <InputLabel>Preferred Architectural Style</InputLabel>
// //           <Select
// //             name="architecturalStyle"
// //             value={formData.architecturalStyle}
// //             onChange={onInputChange}
// //           >
// //             <MenuItem value="">Select Architectural Style</MenuItem>
// //             <MenuItem value="Newar Architecture">Newar Architecture</MenuItem>
// //             <MenuItem value="Modern Minimalist">Modern Minimalist</MenuItem>
// //             <MenuItem value="Eco-Friendly Sustainable">Eco-Friendly & Sustainable</MenuItem>
// //             <MenuItem value="Other">Other</MenuItem>
// //           </Select>
// //         </FormControl>
// //         {formData.architecturalStyle === "Other" && (
// //           <TextField
// //             label="Please Specify"
// //             fullWidth
// //             name="architecturalStyleOther"
// //             value={formData.architecturalStyleOther}
// //             onChange={onInputChange}
// //             sx={{ mt: 2, mb: 2 }}
// //           />
// //         )}
// //       </Grid>
// //       <Grid item xs={12}>
// //         <TextField
// //           label="Budget Estimate (if available)"
// //           fullWidth
// //           name="budgetEstimate"
// //           value={formData.budgetEstimate}
// //           onChange={onInputChange}
// //           sx={{ mb: 2 }}
// //         />
// //       </Grid>
// //       <Grid item xs={12}>
// //         <TextField
// //           label="Special Requirements (e.g., Earthquake Resistance, Solar Panels)"
// //           fullWidth
// //           multiline
// //           rows={3}
// //           name="specialRequirements"
// //           value={formData.specialRequirements}
// //           onChange={onInputChange}
// //           sx={{ mb: 2 }}
// //         />
// //       </Grid>
// //     </Box>
// //   );

// //   // Render Commercial Form
// //   const renderCommercialForm = () => (
// //     <Box sx={{ p: 2 }}>
// //       <Grid item xs={12}>
// //         <Typography variant="h6" sx={{ mt: 3, color: "#1976d2", fontWeight: "bold" }}>
// //           Commercial Construction Information
// //         </Typography>
// //       </Grid>
// //       <Grid item xs={12}>
// //         <TextField
// //           label="Building Purpose (e.g., Office, Mall, Hotel) *"
// //           fullWidth
// //           name="buildingPurpose"
// //           value={formData.buildingPurpose}
// //           onChange={onInputChange}
// //           required
// //           sx={{ mb: 2 }}
// //         />
// //       </Grid>
// //       <Grid item xs={12}>
// //         <TextField
// //           label="Number of Floors Planned *"
// //           fullWidth
// //           type="number"
// //           name="numFloors"
// //           value={formData.numFloors}
// //           onChange={onInputChange}
// //           inputProps={{ min: 1 }}
// //           required
// //           sx={{ mb: 2 }}
// //         />
// //       </Grid>
// //       <Grid item xs={12}>
// //         <TextField
// //           label="Estimated Land Area (sq. ft. or sq. m.) *"
// //           fullWidth
// //           name="landArea"
// //           value={formData.landArea}
// //           onChange={onInputChange}
// //           required
// //           sx={{ mb: 2 }}
// //         />
// //       </Grid>
// //       <Grid item xs={12}>
// //         <Typography>Upload Structural Analysis Report (Required for Plinth Approval)</Typography>
// //         <input
// //           type="file"
// //           name="structuralAnalysisReport"
// //           accept=".pdf"
// //           onChange={onFileUpload}
// //           style={{ margin: "10px 0" }}
// //         />
// //       </Grid>
// //       <Grid item xs={12}>
// //         <Typography>Upload Fire Safety & Exit Plan *</Typography>
// //         <input
// //           type="file"
// //           name="fireSafetyPlan"
// //           accept=".pdf,.jpg,.png"
// //           onChange={onFileUpload}
// //           style={{ margin: "10px 0" }}
// //           required
// //         />
// //       </Grid>
// //       <Grid item xs={12}>
// //         <Typography>Upload Parking Space Management Plan *</Typography>
// //         <input
// //           type="file"
// //           name="parkingPlan"
// //           accept=".pdf,.jpg,.png"
// //           onChange={onFileUpload}
// //           style={{ margin: "10px 0" }}
// //           required
// //         />
// //       </Grid>
// //       <Grid item xs={12}>
// //         <Typography>Upload Environmental Impact Assessment (EIA) Report (if applicable)</Typography>
// //         <input
// //           type="file"
// //           name="eiaReport"
// //           accept=".pdf"
// //           onChange={onFileUpload}
// //           style={{ margin: "10px 0" }}
// //         />
// //       </Grid>
// //       <Grid item xs={12}>
// //         <FormControl fullWidth sx={{ mb: 2 }}>
// //           <InputLabel>Preferred Architectural Style</InputLabel>
// //           <Select
// //             name="architecturalStyle"
// //             value={formData.architecturalStyle}
// //             onChange={onInputChange}
// //           >
// //             <MenuItem value="">Select Architectural Style</MenuItem>
// //             <MenuItem value="Modern Minimalist">Modern Minimalist</MenuItem>
// //             <MenuItem value="Eco-Friendly Sustainable">Eco-Friendly & Sustainable</MenuItem>
// //             <MenuItem value="Other">Other</MenuItem>
// //           </Select>
// //         </FormControl>
// //         {formData.architecturalStyle === "Other" && (
// //           <TextField
// //             label="Please Specify"
// //             fullWidth
// //             name="architecturalStyleOther"
// //             value={formData.architecturalStyleOther}
// //             onChange={onInputChange}
// //             sx={{ mt: 2, mb: 2 }}
// //           />
// //         )}
// //       </Grid>
// //       <Grid item xs={12}>
// //         <TextField
// //           label="Budget Estimate (if available)"
// //           fullWidth
// //           name="budgetEstimate"
// //           value={formData.budgetEstimate}
// //           onChange={onInputChange}
// //           sx={{ mb: 2 }}
// //         />
// //       </Grid>
// //       <Grid item xs={12}>
// //         <TextField
// //           label="Special Requirements (e.g., High-Capacity Elevators, Green Building Features)"
// //           fullWidth
// //           multiline
// //           rows={3}
// //           name="specialRequirements"
// //           value={formData.specialRequirements}
// //           onChange={onInputChange}
// //           sx={{ mb: 2 }}
// //         />
// //       </Grid>
// //     </Box>
// //   );

// //   // Render Renovation Form
// //   const renderRenovationForm = () => (
// //     <Box sx={{ p: 2 }}>
// //       <Grid item xs={12}>
// //         <Typography variant="h6" sx={{ mt: 3, color: "#1976d2", fontWeight: "bold" }}>
// //           Renovation and Remodeling Information
// //         </Typography>
// //       </Grid>
// //       <Grid item xs={12}>
// //         <TextField
// //           label="Type of Building (e.g., Residential, Commercial) *"
// //           fullWidth
// //           name="typeOfBuilding"
// //           value={formData.typeOfBuilding}
// //           onChange={onInputChange}
// //           required
// //           sx={{ mb: 2 }}
// //         />
// //       </Grid>
// //       <Grid item xs={12}>
// //         <TextField
// //           label="Existing Building Details (e.g., Age, Current Floors) *"
// //           fullWidth
// //           name="existingBuildingDetails"
// //           value={formData.existingBuildingDetails}
// //           onChange={onInputChange}
// //           required
// //           sx={{ mb: 2 }}
// //         />
// //       </Grid>
// //       <Grid item xs={12}>
// //         <FormControlLabel
// //           control={
// //             <Checkbox
// //               name="structuralChanges"
// //               checked={formData.structuralChanges}
// //               onChange={onCheckboxChange}
// //             />
// //           }
// //           label="Are you planning structural changes (e.g., adding floors, modifying load-bearing walls)?"
// //         />
// //       </Grid>
// //       {formData.structuralChanges && (
// //         <>
// //           <Grid item xs={12}>
// //             <Typography>Upload Modification Plan *</Typography>
// //             <input
// //               type="file"
// //               name="modificationPlan"
// //               accept=".pdf,.jpg,.png"
// //               onChange={onFileUpload}
// //               style={{ margin: "10px 0" }}
// //               required
// //             />
// //           </Grid>
// //           <Grid item xs={12}>
// //             <Typography>Upload Structural Analysis Report (if applicable)</Typography>
// //             <input
// //               type="file"
// //               name="structuralAnalysisReport"
// //               accept=".pdf"
// //               onChange={onFileUpload}
// //               style={{ margin: "10px 0" }}
// //             />
// //           </Grid>
// //         </>
// //       )}
// //       <Grid item xs={12}>
// //         <TextField
// //           label="Renovation Purpose (e.g., Aesthetic Upgrade, Functional Improvement) *"
// //           fullWidth
// //           name="buildingPurpose"
// //           value={formData.buildingPurpose}
// //           onChange={onInputChange}
// //           required
// //           sx={{ mb: 2 }}
// //         />
// //       </Grid>
// //       <Grid item xs={12}>
// //         <TextField
// //           label="Estimated Area to Renovate (sq. ft. or sq. m.) *"
// //           fullWidth
// //           name="areaToRenovate"
// //           value={formData.areaToRenovate}
// //           onChange={onInputChange}
// //           required
// //           sx={{ mb: 2 }}
// //         />
// //       </Grid>
// //       <Grid item xs={12}>
// //         <TextField
// //           label="Budget Estimate (if available)"
// //           fullWidth
// //           name="budgetEstimate"
// //           value={formData.budgetEstimate}
// //           onChange={onInputChange}
// //           sx={{ mb: 2 }}
// //         />
// //       </Grid>
// //       <Grid item xs={12}>
// //         <TextField
// //           label="Special Requirements (e.g., Retrofitting, Accessibility Features)"
// //           fullWidth
// //           multiline
// //           rows={3}
// //           name="specialRequirements"
// //           value={formData.specialRequirements}
// //           onChange={onInputChange}
// //           sx={{ mb: 2 }}
// //         />
// //       </Grid>
// //       <Grid item xs={12}>
// //         <Typography>Upload Existing Building Plan (if available)</Typography>
// //         <input
// //           type="file"
// //           name="existingBuildingPlan"
// //           accept=".pdf,.jpg,.png"
// //           onChange={onFileUpload}
// //           style={{ margin: "10px 0" }}
// //         />
// //       </Grid>
// //     </Box>
// //   );

// //   // Render the form based on subService
// //   const renderSubServiceForm = () => {
// //     if (!subService) return null;

// //     return (
// //       <>
// //         {renderCommonFields()}
// //         {subService === "Residential Construction" && renderResidentialForm()}
// //         {subService === "Commercial Construction" && renderCommercialForm()}
// //         {subService === "Renovation and Remodeling Services" && renderRenovationForm()}
// //       </>
// //     );
// //   };

// //   return <>{renderSubServiceForm()}</>;
// // };

// // export default BuildingConstructionForm;
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
//   FormControlLabel,
//   Checkbox,
// } from "@mui/material";

// const BuildingConstructionForm = ({
//   formData,
//   onInputChange,
//   onCheckboxChange,
//   onFileUpload,
//   subService,
// }) => {
//   // Render common fields (Municipal Approval and Required Documents)
//   const renderCommonFields = () => (
//     <Box sx={{ p: 2 }}>
//       {/* Municipal Approval Section */}
//       <Grid item xs={12}>
//         <Typography variant="h6" sx={{ mb: 2, color: "#1976d2", fontWeight: "bold" }}>
//           Municipal Approval Process
//         </Typography>
//         <FormControlLabel
//           control={
//             <Checkbox
//               name="hasMunicipalApproval"
//               checked={formData.hasMunicipalApproval}
//               onChange={onCheckboxChange}
//             />
//           }
//           label="I have already completed the municipal approval process (e.g., design approval, building permit)."
//         />
//       </Grid>

//       {!formData.hasMunicipalApproval && (
//         <>
//           <Grid item xs={12}>
//             <Typography variant="body1" sx={{ mt: 2, mb: 2, color: "#666" }}>
//               Note: If you want the company to handle the municipal approval process, additional charges may apply. 
//               Construction may pause during approvals (e.g., inspections, permit issuance).
//             </Typography>
//           </Grid>
//           <Grid item xs={12}>
//             <Typography>Upload Land Ownership Certificate (Lalpurja) *</Typography>
//             <input
//               type="file"
//               name="lalpurja"
//               accept=".pdf,.jpg,.png"
//               onChange={onFileUpload}
//               style={{ margin: "10px 0" }}
//               required
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <Typography>Upload Napi Naksa (Cadastral Map) *</Typography>
//             <input
//               type="file"
//               name="napiNaksha"
//               accept=".pdf,.jpg,.png"
//               onChange={onFileUpload}
//               style={{ margin: "10px 0" }}
//               required
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <Typography>Upload Tax Clearance Document *</Typography>
//             <input
//               type="file"
//               name="taxClearance"
//               accept=".pdf,.jpg,.png"
//               onChange={onFileUpload}
//               style={{ margin: "10px 0" }}
//               required
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <Typography>Upload Approved Building Drawings (if available)</Typography>
//             <input
//               type="file"
//               name="approvedBuildingDrawings"
//               accept=".pdf,.jpg,.png"
//               onChange={onFileUpload}
//               style={{ margin: "10px 0" }}
//             />
//           </Grid>
//         </>
//       )}

//       {/* Common Required Documents */}
//       <Grid item xs={12}>
//         <Typography variant="h6" sx={{ mb: 2, mt: 3, color: "#1976d2", fontWeight: "bold" }}>
//           Common Required Documents
//         </Typography>
//       </Grid>
//       <Grid item xs={12}>
//         <Typography>Upload Construction Agreement (if available)</Typography>
//         <input
//           type="file"
//           name="constructionAgreement"
//           accept=".pdf,.jpg,.png"
//           onChange={onFileUpload}
//           style={{ margin: "10px 0" }}
//         />
//       </Grid>
//     </Box>
//   );

//   // Render Residential Form
//   const renderResidentialForm = () => (
//     <Box sx={{ p: 2 }}>
//       <Grid item xs={12}>
//         <Typography variant="h6" sx={{ mt: 3, color: "#1976d2", fontWeight: "bold" }}>
//           Residential Construction Information
//         </Typography>
//       </Grid>
//       <Grid item xs={12}>
//         <TextField
//           label="Building Purpose (e.g., Family Home, Rental Property) *"
//           fullWidth
//           name="buildingPurpose"
//           value={formData.buildingPurpose}
//           onChange={onInputChange}
//           required
//           sx={{ mb: 2 }}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <TextField
//           label="Number of Floors Planned *"
//           fullWidth
//           type="number"
//           name="numFloors"
//           value={formData.numFloors}
//           onChange={onInputChange}
//           inputProps={{ min: 1 }}
//           required
//           sx={{ mb: 2 }}
//         />
//       </Grid>
//       {formData.numFloors > 3 && (
//         <Grid item xs={12}>
//           <Typography>Upload Soil Test Report (Required for  3 storeys) *</Typography>
//           <input
//             type="file"
//             name="soilTestReport"
//             accept=".pdf"
//             onChange={onFileUpload}
//             style={{ margin: "10px 0" }}
//             required
//           />
//         </Grid>
//       )}
//       <Grid item xs={12}>
//         <Typography>Upload Structural Stability Certificate (if available)</Typography>
//         <input
//           type="file"
//           name="structuralStabilityCertificate"
//           accept=".pdf"
//           onChange={onFileUpload}
//           style={{ margin: "10px 0" }}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <Typography>Upload House Design Approval (if available)</Typography>
//         <input
//           type="file"
//           name="houseDesignApproval"
//           accept=".pdf,.jpg,.png"
//           onChange={onFileUpload}
//           style={{ margin: "10px 0" }}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <Typography>Upload Neighbour Consent (if required)</Typography>
//         <input
//           type="file"
//           name="neighbourConsent"
//           accept=".pdf,.jpg,.png"
//           onChange={onFileUpload}
//           style={{ margin: "10px 0" }}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <TextField
//           label="Estimated Land Area (sq. ft. or sq. m.) *"
//           fullWidth
//           name="landArea"
//           value={formData.landArea}
//           onChange={onInputChange}
//           required
//           sx={{ mb: 2 }}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <FormControl fullWidth sx={{ mb: 2 }}>
//           <InputLabel>Preferred Architectural Style</InputLabel>
//           <Select
//             name="architecturalStyle"
//             value={formData.architecturalStyle}
//             onChange={onInputChange}
//           >
//             <MenuItem value="">Select Architectural Style</MenuItem>
//             <MenuItem value="Newar Architecture">Newar Architecture</MenuItem>
//             <MenuItem value="Modern Minimalist">Modern Minimalist</MenuItem>
//             <MenuItem value="Eco-Friendly Sustainable">Eco-Friendly & Sustainable</MenuItem>
//             <MenuItem value="Other">Other</MenuItem>
//           </Select>
//         </FormControl>
//         {formData.architecturalStyle === "Other" && (
//           <TextField
//             label="Please Specify"
//             fullWidth
//             name="architecturalStyleOther"
//             value={formData.architecturalStyleOther}
//             onChange={onInputChange}
//             sx={{ mt: 2, mb: 2 }}
//           />
//         )}
//       </Grid>
//       <Grid item xs={12}>
//         <TextField
//           label="Budget Estimate (if available)"
//           fullWidth
//           name="budgetEstimate"
//           value={formData.budgetEstimate}
//           onChange={onInputChange}
//           sx={{ mb: 2 }}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <TextField
//           label="Special Requirements (e.g., Earthquake Resistance, Solar Panels)"
//           fullWidth
//           multiline
//           rows={3}
//           name="specialRequirements"
//           value={formData.specialRequirements}
//           onChange={onInputChange}
//           sx={{ mb: 2 }}
//         />
//       </Grid>
//     </Box>
//   );

//   // Render Commercial Form
//   const renderCommercialForm = () => (
//     <Box sx={{ p: 2 }}>
//       <Grid item xs={12}>
//         <Typography variant="h6" sx={{ mt: 3, color: "#1976d2", fontWeight: "bold" }}>
//           Commercial Construction Information
//         </Typography>
//       </Grid>
//       <Grid item xs={12}>
//         <TextField
//           label="Building Purpose (e.g., Office, Mall, Hotel) *"
//           fullWidth
//           name="buildingPurpose"
//           value={formData.buildingPurpose}
//           onChange={onInputChange}
//           required
//           sx={{ mb: 2 }}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <TextField
//           label="Number of Floors Planned *"
//           fullWidth
//           type="number"
//           name="numFloors"
//           value={formData.numFloors}
//           onChange={onInputChange}
//           inputProps={{ min: 1 }}
//           required
//           sx={{ mb: 2 }}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <TextField
//           label="Estimated Land Area (sq. ft. or sq. m.) *"
//           fullWidth
//           name="landArea"
//           value={formData.landArea}
//           onChange={onInputChange}
//           required
//           sx={{ mb: 2 }}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <Typography>Upload Initial Environmental Examination (IEE) (if applicable)</Typography>
//         <input
//           type="file"
//           name="ieeReport"
//           accept=".pdf"
//           onChange={onFileUpload}
//           style={{ margin: "10px 0" }}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <Typography>Upload Fire Safety Compliance Certificate (if available)</Typography>
//         <input
//           type="file"
//           name="fireSafetyCertificate"
//           accept=".pdf,.jpg,.png"
//           onChange={onFileUpload}
//           style={{ margin: "10px 0" }}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <Typography>Upload Lift/Elevator Permit (if applicable)</Typography>
//         <input
//           type="file"
//           name="liftPermit"
//           accept=".pdf,.jpg,.png"
//           onChange={onFileUpload}
//           style={{ margin: "10px 0" }}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <Typography>Upload Parking Layout Plan *</Typography>
//         <input
//           type="file"
//           name="parkingLayoutPlan"
//           accept=".pdf,.jpg,.png"
//           onChange={onFileUpload}
//           style={{ margin: "10px 0" }}
//           required
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <Typography>Upload Occupancy Certificate (if available)</Typography>
//         <input
//           type="file"
//           name="occupancyCertificate"
//           accept=".pdf,.jpg,.png"
//           onChange={onFileUpload}
//           style={{ margin: "10px 0" }}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <FormControl fullWidth sx={{ mb: 2 }}>
//           <InputLabel>Preferred Architectural Style</InputLabel>
//           <Select
//             name="architecturalStyle"
//             value={formData.architecturalStyle}
//             onChange={onInputChange}
//           >
//             <MenuItem value="">Select Architectural Style</MenuItem>
//             <MenuItem value="Modern Minimalist">Modern Minimalist</MenuItem>
//             <MenuItem value="Eco-Friendly Sustainable">Eco-Friendly & Sustainable</MenuItem>
//             <MenuItem value="Other">Other</MenuItem>
//           </Select>
//         </FormControl>
//         {formData.architecturalStyle === "Other" && (
//           <TextField
//             label="Please Specify"
//             fullWidth
//             name="architecturalStyleOther"
//             value={formData.architecturalStyleOther}
//             onChange={onInputChange}
//             sx={{ mt: 2, mb: 2 }}
//           />
//         )}
//       </Grid>
//       <Grid item xs={12}>
//         <TextField
//           label="Budget Estimate (if available)"
//           fullWidth
//           name="budgetEstimate"
//           value={formData.budgetEstimate}
//           onChange={onInputChange}
//           sx={{ mb: 2 }}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <TextField
//           label="Special Requirements (e.g., High-Capacity Elevators, Green Building Features)"
//           fullWidth
//           multiline
//           rows={3}
//           name="specialRequirements"
//           value={formData.specialRequirements}
//           onChange={onInputChange}
//           sx={{ mb: 2 }}
//         />
//       </Grid>
//     </Box>
//   );

//   // Render Renovation Form
//   const renderRenovationForm = () => (
//     <Box sx={{ p: 2 }}>
//       <Grid item xs={12}>
//         <Typography variant="h6" sx={{ mt: 3, color: "#1976d2", fontWeight: "bold" }}>
//           Renovation and Remodeling Information
//         </Typography>
//       </Grid>
//       <Grid item xs={12}>
//         <TextField
//           label="Type of Building (e.g., Residential, Commercial) *"
//           fullWidth
//           name="typeOfBuilding"
//           value={formData.typeOfBuilding}
//           onChange={onInputChange}
//           required
//           sx={{ mb: 2 }}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <TextField
//           label="Existing Building Details (e.g., Age, Current Floors) *"
//           fullWidth
//           name="existingBuildingDetails"
//           value={formData.existingBuildingDetails}
//           onChange={onInputChange}
//           required
//           sx={{ mb: 2 }}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <Typography>Upload Owner's Permission Letter (if not owned by client)</Typography>
//         <input
//           type="file"
//           name="ownerPermissionLetter"
//           accept=".pdf,.jpg,.png"
//           onChange={onFileUpload}
//           style={{ margin: "10px 0" }}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <Typography>Upload Existing Structure Analysis (if available)</Typography>
//         <input
//           type="file"
//           name="existingStructureAnalysis"
//           accept=".pdf"
//           onChange={onFileUpload}
//           style={{ margin: "10px 0" }}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <Typography>Upload Renovation Plan *</Typography>
//         <input
//           type="file"
//           name="renovationPlan"
//           accept=".pdf,.jpg,.png"
//           onChange={onFileUpload}
//           style={{ margin: "10px 0" }}
//           required
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <Typography>Upload No Objection Letter (NOC) (if major structural change)</Typography>
//         <input
//           type="file"
//           name="noc"
//           accept=".pdf,.jpg,.png"
//           onChange={onFileUpload}
//           style={{ margin: "10px 0" }}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <Typography>Upload Waste Management Plan (if applicable)</Typography>
//         <input
//           type="file"
//           name="wasteManagementPlan"
//           accept=".pdf,.jpg,.png"
//           onChange={onFileUpload}
//           style={{ margin: "10px 0" }}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <TextField
//           label="Renovation Purpose (e.g., Aesthetic Upgrade, Functional Improvement) *"
//           fullWidth
//           name="renovationPurpose"
//           value={formData.renovationPurpose}
//           onChange={onInputChange}
//           required
//           sx={{ mb: 2 }}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <TextField
//           label="Estimated Area to Renovate (sq. ft. or sq. m.) *"
//           fullWidth
//           name="areaToRenovate"
//           value={formData.areaToRenovate}
//           onChange={onInputChange}
//           required
//           sx={{ mb: 2 }}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <TextField
//           label="Budget Estimate (if available)"
//           fullWidth
//           name="budgetEstimate"
//           value={formData.budgetEstimate}
//           onChange={onInputChange}
//           sx={{ mb: 2 }}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <TextField
//           label="Special Requirements (e.g., Retrofitting, Accessibility Features)"
//           fullWidth
//           multiline
//           rows={3}
//           name="specialRequirements"
//           value={formData.specialRequirements}
//           onChange={onInputChange}
//           sx={{ mb: 2 }}
//         />
//       </Grid>
//     </Box>
//   );

//   // Render the form based on subService
//   const renderSubServiceForm = () => {
//     if (!subService) return null;

//     return (
//       <>
//         {renderCommonFields()}
//         {subService === "Residential Construction" && renderResidentialForm()}
//         {subService === "Commercial Construction" && renderCommercialForm()}
//         {subService === "Renovation and Remodeling Services" && renderRenovationForm()}
//       </>
//     );
//   };

//   return <>{renderSubServiceForm()}</>;
// };

// export default BuildingConstructionForm;
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

const BuildingConstructionForm = ({
  formData,
  onInputChange,
  onFileUpload,
  subService,
}) => {
  // Render common fields (Construction Agreement, Design & Drawing Approval, Municipality Building Permit)
  const renderCommonFields = () => (
    <Box sx={{ p: 2 }}>
      {/* Common Documents Section */}
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mb: 2, color: "#1976d2", fontWeight: "bold" }}>
          Common Documents
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>Upload Land Ownership Certificate (Lalpurja) *</Typography>
        <input
          type="file"
          name="lalpurja"
          accept=".pdf,.jpg,.png"
          onChange={onFileUpload}
          style={{ margin: "10px 0" }}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <Typography>Upload Napi Naksa (Cadastral Map) *</Typography>
        <input
          type="file"
          name="napiNaksa"
          accept=".pdf,.jpg,.png"
          onChange={onFileUpload}
          style={{ margin: "10px 0" }}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <Typography>Upload Tax Clearance *</Typography>
        <input
          type="file"
          name="taxClearance"
          accept=".pdf,.jpg,.png"
          onChange={onFileUpload}
          style={{ margin: "10px 0" }}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <Typography>Upload Approved Building Drawings (Architectural, Structural, MEP) *</Typography>
        <input
          type="file"
          name="approvedBuildingDrawings"
          accept=".pdf,.jpg,.png"
          onChange={onFileUpload}
          style={{ margin: "10px 0" }}
          required
        />
      </Grid>
    </Box>
  );

  // Render Residential Form
  const renderResidentialForm = () => (
    <Box sx={{ p: 2 }}>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mt: 3, color: "#1976d2", fontWeight: "bold" }}>
          Residential Construction Information
        </Typography>
      </Grid>
      {formData.numFloors > 3 && (
        <Grid item xs={12}>
          <Typography>Upload Soil Test Report (Required for 3 storeys) *</Typography>
          <input
            type="file"
            name="soilTestReport"
            accept=".pdf"
            onChange={onFileUpload}
            style={{ margin: "10px 0" }}
            required
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <Typography>Upload Structural Stability Certificate *</Typography>
        <input
          type="file"
          name="structuralStabilityCertificate"
          accept=".pdf"
          onChange={onFileUpload}
          style={{ margin: "10px 0" }}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <Typography>Upload House Design Approval (from Municipality) *</Typography>
        <input
          type="file"
          name="houseDesignApproval"
          accept=".pdf,.jpg,.png"
          onChange={onFileUpload}
          style={{ margin: "10px 0" }}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <Typography>Upload Neighbour Consent (if required)</Typography>
        <input
          type="file"
          name="neighbourConsent"
          accept=".pdf,.jpg,.png"
          onChange={onFileUpload}
          style={{ margin: "10px 0" }}
        />
      </Grid>
    </Box>
  );

  // Render Commercial Form
  const renderCommercialForm = () => (
    <Box sx={{ p: 2 }}>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mt: 3, color: "#1976d2", fontWeight: "bold" }}>
          Commercial Construction Information
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <Typography>Upload Initial Environmental Examination (IEE) Report (if applicable)</Typography>
        <input
          type="file"
          name="ieeReport"
          accept=".pdf"
          onChange={onFileUpload}
          style={{ margin: "10px 0" }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography>Upload Fire Safety Compliance Certificate *</Typography>
        <input
          type="file"
          name="fireSafetyCertificate"
          accept=".pdf,.jpg,.png"
          onChange={onFileUpload}
          style={{ margin: "10px 0" }}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <Typography>Upload Lift/Elevator Permit (if applicable)</Typography>
        <input
          type="file"
          name="liftPermit"
          accept=".pdf,.jpg,.png"
          onChange={onFileUpload}
          style={{ margin: "10px 0" }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography>Upload Parking Layout Plan *</Typography>
        <input
          type="file"
          name="parkingLayoutPlan"
          accept=".pdf,.jpg,.png"
          onChange={onFileUpload}
          style={{ margin: "10px 0" }}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Special Requirements (e.g., High-Capacity Elevators, Green Building Features)"
          fullWidth
          multiline
          rows={3}
          name="specialRequirements"
          value={formData.specialRequirements}
          onChange={onInputChange}
          sx={{ mb: 2 }}
        />
      </Grid>
    </Box>
  );

  // Render Renovation Form
  const renderRenovationForm = () => (
    <Box sx={{ p: 2 }}>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mt: 3, color: "#1976d2", fontWeight: "bold" }}>
          Renovation and Remodeling Information
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Type of Building (e.g., Residential, Commercial) *"
          fullWidth
          name="typeOfBuilding"
          value={formData.typeOfBuilding}
          onChange={onInputChange}
          required
          sx={{ mb: 2 }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Existing Building Details (e.g., Age, Current Floors) *"
          fullWidth
          name="existingBuildingDetails"
          value={formData.existingBuildingDetails}
          onChange={onInputChange}
          required
          sx={{ mb: 2 }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography>Upload Owner's Permission Letter (if not owned by client)</Typography>
        <input
          type="file"
          name="ownerPermissionLetter"
          accept=".pdf,.jpg,.png"
          onChange={onFileUpload}
          style={{ margin: "10px 0" }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography>Upload Existing Structure Analysis *</Typography>
        <input
          type="file"
          name="existingStructureAnalysis"
          accept=".pdf"
          onChange={onFileUpload}
          style={{ margin: "10px 0" }}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <Typography>Upload Renovation Plan (Signed by Licensed Engineer) *</Typography>
        <input
          type="file"
          name="renovationPlan"
          accept=".pdf,.jpg,.png"
          onChange={onFileUpload}
          style={{ margin: "10px 0" }}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <Typography>Upload No Objection Letter (NOC) from Municipality (if major structural change)</Typography>
        <input
          type="file"
          name="nocMunicipality"
          accept=".pdf,.jpg,.png"
          onChange={onFileUpload}
          style={{ margin: "10px 0" }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography>Upload Waste Management Plan *</Typography>
        <input
          type="file"
          name="wasteManagementPlan"
          accept=".pdf,.jpg,.png"
          onChange={onFileUpload}
          style={{ margin: "10px 0" }}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Estimated Area to Renovate (sq. ft. or sq. m.) *"
          fullWidth
          name="areaToRenovate"
          value={formData.areaToRenovate}
          onChange={onInputChange}
          required
          sx={{ mb: 2 }}
        />
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
          label="Special Requirements (e.g., Retrofitting, Accessibility Features)"
          fullWidth
          multiline
          rows={3}
          name="specialRequirements"
          value={formData.specialRequirements}
          onChange={onInputChange}
          sx={{ mb: 2 }}
        />
      </Grid>
    </Box>
  );

  // Render the form based on subService
  const renderSubServiceForm = () => {
    if (!subService) return null;

    return (
      <>
        {renderCommonFields()}
        {subService === "Residential Construction" && renderResidentialForm()}
        {subService === "Commercial Construction" && renderCommercialForm()}
        {subService === "Renovation and Remodeling Services" && renderRenovationForm()}
      </>
    );
  };

  return <>{renderSubServiceForm()}</>;
};

export default BuildingConstructionForm;