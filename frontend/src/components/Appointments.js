import React, { useState } from "react";
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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const Appointments = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      clientName: "John Doe",
      serviceName: "Residential Construction",
      date: "Feb 15, 2025",
      time: "10:00 AM",
      status: "Pending",
      notes: "Discuss project scope and site inspection.",
    },
    {
      id: 2,
      clientName: "Jane Smith",
      serviceName: "Geotechnical Analysis",
      date: "Feb 16, 2025",
      time: "2:00 PM",
      status: "Confirmed",
      notes: "Bring soil test reports.",
    },
  ]);

  const [open, setOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);

  const handleOpen = (appointment = null) => {
    setCurrentAppointment(appointment);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentAppointment(null);
  };

  const handleSave = () => {
    if (currentAppointment?.id) {
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === currentAppointment.id ? currentAppointment : appt
        )
      );
    } else {
      setAppointments((prev) => [
        ...prev,
        {
          ...currentAppointment,
          id: prev.length + 1,
          status: "Pending",
        },
      ]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setAppointments((prev) => prev.filter((appt) => appt.id !== id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentAppointment((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Appointments
      </Typography>

      {/* Add Appointment Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen(null)}
        sx={{ mb: 3 }}
      >
        Add New Appointment
      </Button>

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
                <TableCell>{appt.clientName}</TableCell>
                <TableCell>{appt.serviceName}</TableCell>
                <TableCell>{appt.date}</TableCell>
                <TableCell>{appt.time}</TableCell>
                <TableCell>{appt.status}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(appt)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(appt.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Appointment Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {currentAppointment?.id ? "Edit Appointment" : "Add New Appointment"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Client Name"
            name="clientName"
            fullWidth
            margin="normal"
            value={currentAppointment?.clientName || ""}
            onChange={handleChange}
          />
          <TextField
            label="Service Name"
            name="serviceName"
            fullWidth
            margin="normal"
            value={currentAppointment?.serviceName || ""}
            onChange={handleChange}
          />
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
          <TextField
            label="Notes"
            name="notes"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={currentAppointment?.notes || ""}
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
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Canceled">Canceled</MenuItem>
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
    </Container>
  );
};

export default Appointments;
