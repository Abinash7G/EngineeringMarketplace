// // PostConstructionMaintenanceForm.js
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

// const PostConstructionMaintenanceForm = ({ companyId, onClose, subServices }) => {
//   const [formData, setFormData] = useState({
//     full_name: '',
//     location: '',
//     email: '',
//     phone_number: '',
//     sub_service: '',
//     maintenance_type: '',
//     maintenance_details: '',
//     special_requirements: '',
//     preferred_service_time: '',
//     maintenance_photos: [],
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     setFormData({ ...formData, [name]: Array.from(files) });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('access_token');
//       const formDataToSend = new FormData();
//       formDataToSend.append('category', 'Post-Construction Maintenance');
//       for (const key in formData) {
//         if (key === 'maintenance_photos') {
//           formData.maintenance_photos.forEach((file) => {
//             formDataToSend.append('maintenance_photos', file);
//           });
//         } else if (formData[key]) {
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
//         Post-Construction Maintenance Inquiry Form
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
//           label="Type of Maintenance Needed"
//           name="maintenance_type"
//           value={formData.maintenance_type}
//           onChange={handleChange}
//           fullWidth
//           sx={{ mb: 2 }}
//           required
//         />
//         <TextField
//           label="Maintenance Details"
//           name="maintenance_details"
//           value={formData.maintenance_details}
//           onChange={handleChange}
//           fullWidth
//           multiline
//           rows={4}
//           sx={{ mb: 2 }}
//           required
//         />
//         <TextField
//           label="Upload Photos (if any)"
//           name="maintenance_photos"
//           type="file"
//           onChange={handleFileChange}
//           fullWidth
//           sx={{ mb: 2 }}
//           InputLabelProps={{ shrink: true }}
//           inputProps={{ multiple: true }}
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

// export default PostConstructionMaintenanceForm;
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