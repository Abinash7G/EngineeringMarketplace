import React from "react";
import {
  TextField,
  Grid,
  // FormControl,
  // InputLabel,
  // Select,
  // MenuItem,
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