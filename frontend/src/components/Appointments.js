import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit, Delete, Description as DescriptionIcon } from "@mui/icons-material";
import axios from "axios";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [openAgreementDialog, setOpenAgreementDialog] = useState(false);
  const [agreementData, setAgreementData] = useState({
    company_representative_name: "",
    service_charge: "",
    additional_terms: "",
    appointment_id: null,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Fetch appointments from the backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://127.0.0.1:8000/company-appointments/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(response.data);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
        setSnackbar({ open: true, message: "Failed to fetch appointments", severity: "error" });
      }
    };
    fetchAppointments();
  }, []);

  // Open dialog and populate fields
  const handleOpen = (appointment) => {
    if (appointment) {
      const date = new Date(appointment.appointment_date).toISOString().split("T")[0];
      const time = new Date(appointment.appointment_date).toTimeString().slice(0, 5);
      setCurrentAppointment({ ...appointment, date, time });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentAppointment(null);
  };

  // Save updated appointment
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const appointmentDate = new Date(`${currentAppointment.date}T${currentAppointment.time}`).toISOString();
      await axios.patch(
        `http://127.0.0.1:8000/api/appointments/${currentAppointment.id}/update/`,
        { appointment_date: appointmentDate, status: currentAppointment.status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh appointments
      const response = await axios.get("http://127.0.0.1:8000/company-appointments/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(response.data);
      setSnackbar({ open: true, message: "Appointment updated successfully", severity: "success" });
      handleClose();
    } catch (err) {
      console.error("Failed to update appointment", err);
      setSnackbar({ open: true, message: "Failed to update appointment", severity: "error" });
    }
  };

  // Delete appointment
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        const token = localStorage.getItem("access_token");
        await axios.delete(`http://127.0.0.1:8000/api/appointments/${id}/delete/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments((prev) => prev.filter((appt) => appt.id !== id));
        setSnackbar({ open: true, message: "Appointment deleted successfully", severity: "success" });
      } catch (err) {
        console.error("Failed to delete appointment", err);
        setSnackbar({ open: true, message: "Failed to delete appointment", severity: "error" });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentAppointment((prev) => ({ ...prev, [name]: value }));
  };

  // Open agreement generation dialog
  const handleOpenAgreementDialog = (appointment) => {
    setAgreementData({
      ...agreementData,
      appointment_id: appointment.id,
      company_representative_name: "", // Allow manual input
    });
    setOpenAgreementDialog(true);
  };

  const handleCloseAgreementDialog = () => {
    setOpenAgreementDialog(false);
    setAgreementData({
      company_representative_name: "",
      service_charge: "",
      additional_terms: "",
      appointment_id: null,
    });
  };

  const handleAgreementChange = (e) => {
    const { name, value } = e.target;
    setAgreementData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateAgreement = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        `http://127.0.0.1:8000/generate-agreement/${agreementData.appointment_id}/`,
        {
          company_representative_name: agreementData.company_representative_name,
          service_charge: agreementData.service_charge,
          additional_terms: agreementData.additional_terms,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({ open: true, message: response.data.message || "Agreement generated and sent to the client!", severity: "success" });
      handleCloseAgreementDialog();
    } catch (err) {
      console.error("Failed to generate agreement", err);
      const errorMessage = err.response?.data?.error || "Failed to generate agreement";
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Appointments
      </Typography>

      {/* Appointments Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client Name</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appt) => (
              <TableRow key={appt.id}>
                <TableCell>{appt.inquiry.full_name}</TableCell>
                <TableCell>{appt.inquiry.sub_service}</TableCell>
                <TableCell>{new Date(appt.appointment_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {new Date(appt.appointment_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </TableCell>
                <TableCell>{appt.status}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(appt)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(appt.id)}>
                    <Delete />
                  </IconButton>
                  {appt.status === "Completed" && (
                    <IconButton color="primary" onClick={() => handleOpenAgreementDialog(appt)}>
                      <DescriptionIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Appointment Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Appointment</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Inquiry Details</Typography>
          <Typography>Client Name: {currentAppointment?.inquiry.full_name}</Typography>
          <Typography>Service: {currentAppointment?.inquiry.sub_service}</Typography>
          <Typography>Location: {currentAppointment?.inquiry.location}</Typography>
          <Typography>Email: {currentAppointment?.inquiry.email}</Typography>
          <Typography>Phone: {currentAppointment?.inquiry.phone_number}</Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>Appointment Details</Typography>
          <TextField
            label="Date"
            name="date"
            fullWidth
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={currentAppointment?.date || ""}
            onChange={handleChange}
          />
          <TextField
            label="Time"
            name="time"
            fullWidth
            margin="normal"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={currentAppointment?.time || ""}
            onChange={handleChange}
          />
          <Select
            label="Status"
            name="status"
            fullWidth
            margin="normal"
            value={currentAppointment?.status || "Pending"}
            onChange={handleChange}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Confirmed">Confirmed</MenuItem>
            <MenuItem value="No-Show">No-Show</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Generate Agreement Dialog */}
      <Dialog open={openAgreementDialog} onClose={handleCloseAgreementDialog}>
        <DialogTitle>Generate Agreement</DialogTitle>
        <DialogContent>
          <TextField
            label="Company Representative Name"
            name="company_representative_name"
            fullWidth
            margin="normal"
            value={agreementData.company_representative_name}
            onChange={handleAgreementChange}
            required
          />
          <TextField
            label="Service Charge (Rs.)"
            name="service_charge"
            fullWidth
            margin="normal"
            type="number"
            value={agreementData.service_charge}
            onChange={handleAgreementChange}
            required
          />
          <TextField
            label="Additional Terms (Optional)"
            name="additional_terms"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={agreementData.additional_terms}
            onChange={handleAgreementChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAgreementDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleGenerateAgreement} color="primary">
            Generate and Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Appointments;