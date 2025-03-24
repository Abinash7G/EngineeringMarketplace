import React, { useEffect, useState } from "react";
import API from "../services/api";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/system";

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#007BFF",
  color: "white",
  padding: "10px 20px",
  borderRadius: "5px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#005bb5",
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: "white",
  color: "#007BFF",
  border: "1px solid #007BFF",
  padding: "10px 20px",
  borderRadius: "5px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
}));

const ServiceCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  },
}));

const CompanyCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  },
  border: "1px solid #e0e0e0",
  borderRadius: "10px",
}));

const Home = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get("/api/services/")
      .then((response) => setMessage(response.data.message))
      .catch((error) => console.error(error));
  }, []);

  return (
    <Box sx={{ fontFamily: "Arial, sans-serif" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(90deg, #4a90e2, #50c9c3)", // Kept the blue gradient for the hero section
          padding: { xs: "40px 20px", md: "60px 20px" },
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6} sx={{ textAlign: "left" }}>
              <Typography variant="h3" sx={{ mb: 2, fontWeight: "bold" }}>
                Welcome to Engineering Construction Marketplace
              </Typography>
              <Typography variant="h6" sx={{ mb: 3 }}>
                {message ||
                  "Connecting Clients, Companies, and Suppliers for Seamless Construction Services."}
              </Typography>
              <StyledButton component={Link} to="/signup" >Get Started</StyledButton>
            </Grid>
            <Grid item xs={12} md={6}>
              <Carousel
                autoPlay
                infiniteLoop
                showThumbs={false}
                showStatus={false}
                interval={3000}
              >
                <div>
                  <img
                    src="/image/image_one.jpg"
                    alt="Slide 1"
                    style={{ width: "100%", height: "400px", objectFit: "cover", borderRadius: "10px" }}
                  />
                </div>
                <div>
                  <img
                    src="/image/image_two.jpg"
                    alt="Slide 2"
                    style={{ width: "100%", height: "400px", objectFit: "cover", borderRadius: "10px" }}
                  />
                </div>
                <div>
                  <img
                    src="/image/image_three.jpg"
                    alt="Slide 3"
                    style={{ width: "100%", height: "400px", objectFit: "cover", borderRadius: "10px" }}
                  />
                </div>
                <div>
                  <img
                    src="/image/image_four.jpg"
                    alt="Slide 4"
                    style={{ width: "100%", height: "400px", objectFit: "cover", borderRadius: "10px" }}
                  />
                </div>
                <div>
                  <img
                    src="/image/image_five.jpg"
                    alt="Slide 5"
                    style={{ width: "100%", height: "400px", objectFit: "cover", borderRadius: "10px" }}
                  />
                </div>
              </Carousel>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section with Hoverable Cards */}
      <Box sx={{ padding: "60px 20px", backgroundColor: "#f9f9f9" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{ mb: 2, fontWeight: "bold", textAlign: "center", color: "#007BFF" }} // Blue for heading
          >
            Our Core Services
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: "#555", textAlign: "center" }}>
            Browse through our comprehensive range of construction and engineering
            services designed to meet the diverse needs of projects across Nepal.
          </Typography>
          <Grid container spacing={4}>
            {[
              { icon: "📏", title: "Survey Instrument Rental", description: "Rent instruments like theodolites, laser levels, and GPS devices." },
              { icon: "🖥️", title: "Engineering Consulting", description: "Book consultations for structural analysis, design, and inspections." },
              { icon: "🏢", title: "Building Construction", description: "Request residential or commercial construction services." },
              { icon: "🔧", title: "Post-Construction Maintenance", description: "Schedule plumbing, electrical, and other maintenance services." },
              { icon: "🛡️", title: "Safety and Training", description: "Join safety training sessions and receive certifications." },
              { icon: "🛠️", title: "Material Procurement", description: "Order construction materials like cement, steel, and tools." },
            ].map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <ServiceCard>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                      {service.icon}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#555" }}>
                      {service.description}
                    </Typography>
                  </CardContent>
                </ServiceCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Companies Section with Cards */}
      <Box sx={{ padding: "60px 20px" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{ mb: 2, fontWeight: "bold", textAlign: "center", color: "#007BFF" }} // Blue for heading
          >
            Featured Companies
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: "#555", textAlign: "center" }}>
            These verified construction companies offer exceptional services and
            have received top ratings from clients across Nepal.
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                image: "/path-to-himalayan-builders.jpg",
                title: "Himalayan Builders Ltd.",
                description: "Specializing in earthquake-resistant construction for residential and commercial buildings.",
                rating: "⭐ 4.8/5 | 2 Services",
              },
              {
                image: "/path-to-kathmandu-engineering.jpg",
                title: "Kathmandu Engineering Group",
                description: "Expert consultants providing comprehensive engineering solutions for complex projects.",
                rating: "⭐ 4.6/5 | 2 Services",
              },
              {
                image: "path-to-nepal-safety.jpg",
                title: "Nepal Safety Experts",
                description: "Leading provider of construction safety training and certification in the region.",
                rating: "⭐ 4.9/5 | 1 Service",
              },
            ].map((company, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <CompanyCard>
                  <CardContent sx={{ textAlign: "center" }}>
                    <img
                      src={company.image}
                      alt={company.title}
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginBottom: "10px",
                      }}
                    />
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                      {company.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, color: "#555" }}>
                      {company.description}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#007BFF" }}>
                      {company.rating}
                    </Typography>
                  </CardContent>
                </CompanyCard>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <SecondaryButton>View All Companies</SecondaryButton>
          </Box>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box sx={{ backgroundColor: "#333", color: "white", padding: "40px 20px" }}> {/* Changed blue to dark gray */}
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{ mb: 2, fontWeight: "bold", textAlign: "center", color: "#007BFF" }} // Blue for heading
          >
            Join Our Growing Construction Marketplace
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
            Whether you're looking for construction services or you're a company
            offering them, create an account today to get started.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <StyledButton component={Link} to="/signup">Sign Up as Client</StyledButton>
            <SecondaryButton component={Link} to="/companyregistration">Sign Up as Company</SecondaryButton>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: "#333", color: "white", padding: "20px" }}> {/* Changed blue to dark gray */}
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mb: 2 }}>
            <Button href="/terms" sx={{ color: "white", textTransform: "none" }}>
              Terms and Conditions
            </Button>
            <Button href="/about" sx={{ color: "white", textTransform: "none" }}>
              About Us
            </Button>
          </Box>
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            © 2024 Engineering Construction Marketplace. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;