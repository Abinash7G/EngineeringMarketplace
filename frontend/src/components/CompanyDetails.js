//ClientFrontend
import React from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Box,
  Divider,
  Avatar,
  Paper,
} from "@mui/material";
import CDConsultingInquiryForm from "./CDConsultingInquiryForm";
import { LocationOn, Phone, Email } from "@mui/icons-material"; // Icons for contact details

const CompanyDetails = () => {
  // Static Data for Testing
  const company = {
    companyName: "Boy Construction",
    email: "contact@boyconstruction.com",
    phoneNumber: "123-456-7890",
    address: "123 Main St, City, Country",
    logo: "https://via.placeholder.com/200", // Placeholder Image
    aboutUs:
      "Boy Construction is a leading construction company specializing in residential, commercial, and industrial projects. With over 20 years of experience, we are committed to delivering high-quality construction services and innovative engineering solutions.",
    services: [
      {
        id: 1,
        category: "Building Construction Services",
        subServices: [
          "Residential Construction",
          "Commercial Construction",
          "Industrial Construction",
          "Renovation and Remodeling Services",
        ],
      },
      {
        id: 2,
        category: "Engineering Consulting",
        subServices: [
          "Structural Engineering",
          "Geotechnical Analysis",
          "Civil Design and Planning",
          "Environmental Impact Assessment",
        ],
      },
    ],
    projects: [
      {
        id: 1,
        name: "Skyline Tower",
        description: "50-floor residential building",
        year: "2023",
        image: "https://via.placeholder.com/200",
      },
      {
        id: 2,
        name: "Highway Expansion",
        description: "Road widening project",
        year: "2022",
        image: "https://via.placeholder.com/200",
      },
    ],
    team: [
      { id: 1, name: "John Doe", role: "Project Manager", avatar: "https://via.placeholder.com/150" },
      { id: 2, name: "Jane Smith", role: "Civil Engineer", avatar: "https://via.placeholder.com/150" },
    ],
  };

  return (
    <Container sx={{ mt: 6, mb: 6 }}>
      {/* Company Header Section */}
      <Box
        sx={{
          textAlign: "center",
          mb: 6,
          background: `linear-gradient(45deg, #1E3A8A, #F97316)`, // Blue and Orange gradient
          color: "white",
          py: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold" }}>
          {company.companyName}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontStyle: "italic" }}>
          Building the Future, One Project at a Time
        </Typography>
      </Box>

      {/* Company Details Card */}
      <Card sx={{ mb: 6, textAlign: "center", boxShadow: 3 }}>
        <CardMedia component="img" height="300" image={company.logo} alt={company.companyName} />
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
            <LocationOn sx={{ mr: 1, color: "#F97316" }} /> {/* Orange icon */}
            <Typography variant="h6" sx={{ color: "#374151" }}>
              {company.address}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
            <Phone sx={{ mr: 1, color: "#F97316" }} /> {/* Orange icon */}
            <Typography variant="h6" sx={{ color: "#374151" }}>
              {company.phoneNumber}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Email sx={{ mr: 1, color: "#F97316" }} /> {/* Orange icon */}
            <Typography variant="h6" sx={{ color: "#374151" }}>
              {company.email}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* About Us Section */}
      <Typography variant="h4" sx={{ mt: 6, mb: 3, fontWeight: "bold", color: "#1E3A8A" }}>
        About Us
      </Typography>
      <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 2, backgroundColor: "#F3F4F6" }}>
        <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#374151" }}>
          {company.aboutUs}
        </Typography>
      </Paper>

      {/* Services Section */}
      <Typography variant="h4" sx={{ mt: 6, mb: 3, fontWeight: "bold", color: "#1E3A8A" }}>
        Services Offered
      </Typography>
      <Grid container spacing={4}>
        {company.services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <Card
              sx={{
                height: "100%",
                boxShadow: 3,
                transition: "transform 0.3s ease-in-out",
                "&:hover": { transform: "scale(1.05)" },
                backgroundColor: "#F3F4F6",
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#1E3A8A" }}>
                  {service.category}
                </Typography>
                <Divider sx={{ mb: 2, borderColor: "#F97316" }} /> {/* Orange divider */}
                {service.subServices.map((subService, index) => (
                  <Typography key={index} variant="body2" sx={{ mb: 1, color: "#374151" }}>
                    • {subService}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Previous Projects Section */}
      {company.projects.length > 0 && (
        <>
          <Typography variant="h4" sx={{ mt: 6, mb: 3, fontWeight: "bold", color: "#1E3A8A" }}>
            Previous Projects
          </Typography>
          <Grid container spacing={4}>
            {company.projects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Card
                  sx={{
                    boxShadow: 3,
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": { transform: "scale(1.05)" },
                    backgroundColor: "#F3F4F6",
                  }}
                >
                  <CardMedia component="img" height="200" image={project.image} alt={project.name} />
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#1E3A8A" }}>
                      {project.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#374151" }}>
                      {project.description}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, color: "#374151" }}>
                      Year: {project.year}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Team Members Section */}
      <Typography variant="h4" sx={{ mt: 6, mb: 3, fontWeight: "bold", color: "#1E3A8A" }}>
        Our Team
      </Typography>
      <Grid container spacing={4}>
        {company.team.map((member) => (
          <Grid item xs={12} sm={6} md={4} key={member.id}>
            <Card
              sx={{
                boxShadow: 3,
                transition: "transform 0.3s ease-in-out",
                "&:hover": { transform: "scale(1.05)" },
                backgroundColor: "#F3F4F6",
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Avatar src={member.avatar} sx={{ width: 100, height: 100, margin: "0 auto 16px" }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#1E3A8A" }}>
                  {member.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#374151" }}>
                  Role: {member.role}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Consulting Inquiry Form */}
      <CDConsultingInquiryForm />
    </Container>
  );
};

export default CompanyDetails;