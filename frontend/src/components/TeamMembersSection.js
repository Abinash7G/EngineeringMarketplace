import React, { useState, useEffect } from "react";
import { 
  Paper, 
  Typography, 
  Grid, 
  TextField, 
  Button, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton, 
  CircularProgress, 
  Avatar,
  Modal // Added Modal import here
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const TeamMembersSection = ({ token: propToken, companyId: propCompanyId }) => {
  const companyId = propCompanyId || localStorage.getItem("company_id");
  const token = propToken || localStorage.getItem("access_token");

  const [teamMember, setTeamMember] = useState({ name: "", role: "", avatar: null });
  const [teamMembers, setTeamMembers] = useState([]); // State for fetched team members
  const [openModal, setOpenModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null); // For editing
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch team members on mount
  useEffect(() => {
    if (!companyId || !token) {
      setError("Missing Company ID or Authentication Token. Please log in again.");
      return;
    }

    const fetchTeamMembers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/company-info/${companyId}/team/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeamMembers(response.data.map(member => ({
          ...member,
          avatar: member.avatar ? `http://127.0.0.1:8000${member.avatar}` : null // Adjust URL based on backend
        })));
      } catch (error) {
        console.error("Error fetching team members:", error.response?.data || error.message);
        setError(`Failed to fetch team members: ${error.response?.data?.error || error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamMembers();
  }, [companyId, token]);

  // Open modal for adding/editing
  const handleOpenModal = (member = null) => {
    setSelectedMember(member);
    setTeamMember(member || { name: "", role: "", avatar: null });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedMember(null);
    setTeamMember({ name: "", role: "", avatar: null });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      setTeamMember((prev) => ({ ...prev, avatar: file }));
    }
  };

  const handleSubmitTeamMember = async () => {
    if (!teamMember.name || !teamMember.role || !teamMember.avatar) {
      alert("Please fill in all fields for the team member.");
      return;
    }

    if (!companyId || !token) {
      setError("Missing Company ID or Authentication Token. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", teamMember.name);
      formData.append("role", teamMember.role);
      if (teamMember.avatar instanceof File) formData.append("avatar", teamMember.avatar);

      if (selectedMember) {
        // Update existing team member
        const response = await axios.put(`http://127.0.0.1:8000/company-info/${companyId}/team/${selectedMember.id}/`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`, 
            "Content-Type": "multipart/form-data" 
          },
        });
        setTeamMembers(teamMembers.map(m => m.id === selectedMember.id ? {
          ...response.data,
          avatar: response.data.avatar ? `http://127.0.0.1:8000${response.data.avatar}` : null
        } : m));
      } else {
        // Create new team member
        const response = await axios.post(`http://127.0.0.1:8000/company-info/${companyId}/team/`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`, 
            "Content-Type": "multipart/form-data" 
          },
        });
        setTeamMembers([...teamMembers, {
          ...response.data,
          avatar: response.data.avatar ? `http://127.0.0.1:8000${response.data.avatar}` : null
        }]);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving team member:", error.response?.data || error.message);
      setError(`Failed to save team member: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeamMember = async (memberId) => {
    if (!companyId || !token) {
      setError("Missing Company ID or Authentication Token. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:8000/company-info/${companyId}/team/${memberId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeamMembers(teamMembers.filter(m => m.id !== memberId));
    } catch (error) {
      console.error("Error deleting team member:", error.response?.data || error.message);
      setError(`Failed to delete team member: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Add Team Members</Typography>
        <Button variant="contained" sx={{ backgroundColor: "#007BFF", color: "#fff" }} onClick={() => handleOpenModal()}>
          ADD TEAM MEMBER
        </Button>
      </Box>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Avatar</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>
                  {member.avatar && <Avatar src={member.avatar} alt={member.name} />}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenModal(member)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteTeamMember(member.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MODAL */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper', boxShadow: 24, p: 4, minWidth: 400, borderRadius: 2
        }}>
          <Typography variant="h6" fontWeight="bold">Add/Edit Team Member</Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Name" value={teamMember.name} onChange={(e) => setTeamMember({ ...teamMember, name: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Role" value={teamMember.role} onChange={(e) => setTeamMember({ ...teamMember, role: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold">Upload Avatar</Typography>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {teamMember.avatar && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">Preview:</Typography>
                  <Avatar
                    src={teamMember.avatar instanceof File ? URL.createObjectURL(teamMember.avatar) : teamMember.avatar}
                    alt="Avatar Preview"
                    sx={{ width: 100, height: 100, borderRadius: "50%" }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button variant="contained" color="error" onClick={handleCloseModal}>CANCEL</Button>
            <Button variant="contained" color="primary" onClick={handleSubmitTeamMember} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : selectedMember ? "UPDATE TEAM MEMBER" : "ADD TEAM MEMBER"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Paper>
  );
};

export default TeamMembersSection;