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

const SafetyTrainingForm = ({ formData, onInputChange, onCheckboxChange, subService }) => {
  return (
    <>
      <Grid item xs={12}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Language Preference *</InputLabel>
          <Select
            name="languagePreference"
            value={formData.languagePreference}
            onChange={onInputChange}
            sx={{ borderRadius: 1 }}
          >
            <MenuItem value="">Select Language</MenuItem>
            <MenuItem value="Nepali">Nepali</MenuItem>
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        {formData.languagePreference === "Other" && (
          <TextField
            label="Please Specify Language"
            fullWidth
            name="languagePreferenceOther"
            value={formData.languagePreferenceOther || ""}
            onChange={onInputChange}
            sx={{ mt: 2, mb: 2 }}
          />
        )}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mt: 3, color: "#1976d2", fontWeight: "bold" }}>
          Preferred Date and Time for Training
        </Typography>
        <TextField
          label="Training Date *"
          type="date"
          fullWidth
          name="trainingDate"
          value={formData.trainingDate}
          onChange={onInputChange}
          InputLabelProps={{ shrink: true }}
          required
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Training Time *</InputLabel>
          <Select
            name="trainingTime"
            value={formData.trainingTime}
            onChange={onInputChange}
            sx={{ borderRadius: 1 }}
          >
            <MenuItem value="">Select Time</MenuItem>
            <MenuItem value="Morning">Morning</MenuItem>
            <MenuItem value="Afternoon">Afternoon</MenuItem>
            <MenuItem value="Specific Time">Specific Time</MenuItem>
          </Select>
        </FormControl>
        {formData.trainingTime === "Specific Time" && (
          <TextField
            label="Specific Time *"
            type="time"
            fullWidth
            name="specificTrainingTime"
            value={formData.specificTrainingTime}
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
              name="trainingAgreement"
              checked={formData.trainingAgreement}
              onChange={onCheckboxChange}
            />
          }
          label="I agree to follow the instructions provided during training and understand that this is a safety-related course essential for work on-site."
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2" sx={{ mt: 2, color: "#666" }}>
          Note: Once enrolled and payment is completed, the trainee must complete the training session as scheduled. No refunds or rescheduling will be allowed without prior notice.
        </Typography>
      </Grid>
    </>
  );
};

export default SafetyTrainingForm;