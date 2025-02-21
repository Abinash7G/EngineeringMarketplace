import React, { useState } from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  TextField,
} from "@mui/material";

// Static data for testing
const staticInquiries = [
  {
    fullName: "John Doe",
    location: "Kathmandu, Nepal",
    email: "john.doe@example.com",
    phoneNumber: "123-456-7890",
    category: "Engineering Consulting",
    subService: "Structural Engineering",
    floorRequirements: "3 floors with a basement",
    floorDetails: "Each floor should have 4 bedrooms and 2 bathrooms.",
  },
  {
    fullName: "Jane Smith",
    location: "Pokhara, Nepal",
    email: "jane.smith@example.com",
    phoneNumber: "987-654-3210",
    category: "Building Construction Services",
    subService: "Residential Construction",
    floorRequirements: "2 floors with a garage",
    floorDetails: "Ground floor for parking and living area, first floor for bedrooms.",
  },
];

const InquiriesList = ({ inquiries = staticInquiries }) => {
  const [feedbackData, setFeedbackData] = useState({});
  const [activeFeedback, setActiveFeedback] = useState(null);

  const handleFeedbackChange = (id, value) => {
    setFeedbackData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitFeedback = (id) => {
    console.log(`Feedback for ${id}:`, feedbackData[id] || "");
    setActiveFeedback(null); // Hide feedback form after submission
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Client Inquiries
      </Typography>
      {inquiries.length === 0 ? (
        <Typography variant="body1">No inquiries submitted yet.</Typography>
      ) : (
        <List>
          {inquiries.map((inquiry, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Typography variant="h6" fontWeight="bold">
                      Name: {inquiry.fullName}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2">
                        <strong>Location:</strong> {inquiry.location}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Email:</strong> {inquiry.email}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Phone:</strong> {inquiry.phoneNumber}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Category:</strong> {inquiry.category}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Sub-Service:</strong> {inquiry.subService}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Floor Requirements:</strong>{" "}
                        {inquiry.floorRequirements}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Floor Details:</strong> {inquiry.floorDetails}
                      </Typography>

                      {/* Send Feedback Button */}
                      <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => setActiveFeedback(index)}
                      >
                        Send Feedback
                      </Button>

                      {/* Feedback Input Field */}
                      {activeFeedback === index && (
                        <div style={{ marginTop: "10px" }}>
                          <TextField
                            label="Your Feedback"
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            value={feedbackData[index] || ""}
                            onChange={(e) =>
                              handleFeedbackChange(index, e.target.value)
                            }
                          />
                          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleSubmitFeedback(index)}
                            >
                              Submit
                            </Button>
                            <Button
                              variant="text"
                              color="secondary"
                              onClick={() => setActiveFeedback(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default InquiriesList;
