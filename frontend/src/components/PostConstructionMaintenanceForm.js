import React from "react";
import {
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

const PostConstructionMaintenanceForm = ({
  formData,
  onInputChange,
  onCheckboxChange,
  onFileUpload,
  subService,
}) => {
  return (
    <>
      <Grid item xs={12}>
        <TextField
          label="Type of Maintenance Needed *"
          fullWidth
          name="maintenanceType"
          value={formData.maintenanceType}
          onChange={onInputChange}
          required
          sx={{ mb: 2 }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Maintenance Details *"
          fullWidth
          multiline
          rows={3}
          name="maintenanceDetails"
          value={formData.maintenanceDetails}
          onChange={onInputChange}
          required
          sx={{ mb: 2 }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography>Upload Photos of the Issue (optional)</Typography>
        <input
          type="file"
          name="maintenancePhotos"
          accept=".pdf,.jpg,.png"
          onChange={onFileUpload}
          style={{ margin: "10px 0" }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mt: 3, color: "#1976d2", fontWeight: "bold" }}>
          Preferred Date and Time
        </Typography>
        <TextField
          label="Preferred Date *"
          type="date"
          fullWidth
          name="preferredDate"
          value={formData.preferredDate}
          onChange={onInputChange}
          InputLabelProps={{ shrink: true }}
          required
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Preferred Time *</InputLabel>
          <Select
            name="preferredTime"
            value={formData.preferredTime}
            onChange={onInputChange}
            sx={{ borderRadius: 1 }}
          >
            <MenuItem value="">Select Time</MenuItem>
            <MenuItem value="Morning">Morning</MenuItem>
            <MenuItem value="Afternoon">Afternoon</MenuItem>
            <MenuItem value="Specific Time">Specific Time</MenuItem>
          </Select>
        </FormControl>
        {formData.preferredTime === "Specific Time" && (
          <TextField
            label="Specific Time *"
            type="time"
            fullWidth
            name="specificTime"
            value={formData.specificTime}
            onChange={onInputChange}
            InputLabelProps={{ shrink: true }}
            required
            sx={{ mb: 2 }}
          />
        )}
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              name="paymentAgreed"
              checked={formData.paymentAgreed}
              onChange={onCheckboxChange}
            />
          }
          label="I agree to pay the maintenance fee upon booking. (Note: You will receive a scheduled time via email after payment.)"
        />
      </Grid>
    </>
  );
};

export default PostConstructionMaintenanceForm;