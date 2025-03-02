import React from "react";
import { Paper, Typography, Grid, TextField, Button, Box, List, ListItem, ListItemAvatar, ListItemText, Divider, Avatar } from "@mui/material";
import axios from "axios";

const TeamMembersSection = ({ company, setCompany, teamMember, setTeamMember, handleImageUpload }) => {
  const addTeamMember = () => {
    if (!teamMember.name || !teamMember.role || !teamMember.avatar) {
      alert("Please fill in all fields for the team member.");
      return;
    }
    setCompany((prev) => ({
      ...prev,
      team: [...prev.team, { id: prev.team.length + 1, ...teamMember }],
    }));
    setTeamMember({ name: "", role: "", avatar: "" });
  };

  const deleteTeamMember = async (memberId) => {
    const companyInfoId = localStorage.getItem("company_info_id");
    if (!companyInfoId) {
      setCompany((prev) => ({
        ...prev,
        team: prev.team.filter((member) => member.id !== memberId),
      }));
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(
        `http://127.0.0.1:8000/companyInfo/${companyInfoId}/team/${memberId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompany((prev) => ({
        ...prev,
        team: prev.team.filter((member) => member.id !== memberId),
      }));
    } catch (error) {
      console.error("Error deleting team member:", error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4, border: "1px solid #e0e0e0", borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>Add Team Members</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Name" value={teamMember.name} onChange={(e) => setTeamMember({ ...teamMember, name: e.target.value })} variant="outlined" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Role" value={teamMember.role} onChange={(e) => setTeamMember({ ...teamMember, role: e.target.value })} variant="outlined" />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>Upload Avatar</Typography>
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (image) => setTeamMember({ ...teamMember, avatar: image }))} style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "4px", width: "100%" }} />
          {teamMember.avatar && <Box sx={{ mt: 2 }}><Typography variant="body2">Preview:</Typography><img src={teamMember.avatar} alt="Avatar Preview" style={{ width: 100, height: 100, borderRadius: "50%" }} /></Box>}
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={addTeamMember} sx={{ backgroundColor: "#007BFF", color: "#fff" }}>Add Team Member</Button>
        </Grid>
        {company.team.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>Team Members</Typography>
            <List>
              {company.team.map((member) => (
                <React.Fragment key={member.id}>
                  <ListItem>
                    <ListItemAvatar><Avatar src={member.avatar} alt={member.name} /></ListItemAvatar>
                    <ListItemText primary={member.name} secondary={`Role: ${member.role}`} />
                    <Button color="error" onClick={() => deleteTeamMember(member.id)}>Delete</Button>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}
      </Grid>
    </Paper>
  );
};

export default TeamMembersSection;