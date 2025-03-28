// // SafetyAndTrainingForm.js
// import React, { useState } from 'react';
// import {
//   Box,
//   TextField,
//   Button,
//   MenuItem,
//   Typography,
//   CircularProgress,
// } from '@mui/material';
// import axios from 'axios';

// const SafetyAndTrainingForm = ({ companyId, onClose, subServices }) => {
//   const [formData, setFormData] = useState({
//     full_name: '',
//     location: '',
//     email: '',
//     phone_number: '',
//     sub_service: '',
//     training_type: '',
//     number_of_participants: '',
//     special_requirements: '',
//     preferred_service_time: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('access_token');
//       const formDataToSend = new FormData();
//       formDataToSend.append('category', 'Safety and Training Services');
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

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" sx={{ mb: 3, color: 'primary.main' }}>
//         Safety and Training Inquiry Form
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
//         <TextField
//           select
//           label="Training Type"
//           name="training_type"
//           value={formData.training_type}
//           onChange={handleChange}
//           fullWidth
//           sx={{ mb: 2 }}
//           required
//         >
//           <MenuItem value="Workplace Safety">Workplace Safety</MenuItem>
//           <MenuItem value="Equipment Handling">Equipment Handling</MenuItem>
//           <MenuItem value="Emergency Response">Emergency Response</MenuItem>
//         </TextField>
//         <TextField
//           label="Number of Participants"
//           name="number_of_participants"
//           type="number"
//           value={formData.number_of_participants}
//           onChange={handleChange}
//           fullWidth
//           sx={{ mb: 2 }}
//           required
//         />
//         <TextField
//           label="Special Requirements (if any)"
//           name="special_requirements"
//           value={formData.special_requirements}
//           onChange={handleChange}
//           fullWidth
//           multiline
//           rows={4}
//           sx={{ mb: 2 }}
//         />
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

// export default SafetyAndTrainingForm;
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