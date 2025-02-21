import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const styles = {
  carouselImage: {
    height: "500px",
    objectFit: "cover",
    position: "relative",
  },
  overlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "80%",
  },
};

const CDBanner = () => {
  return (
    <Box sx={{ mb: 3 }}>
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={3000}
      >
        <div>
          <img src="/image/image_one.jpg" alt="Slide 1" style={styles.carouselImage} />
          <Box sx={styles.overlay}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Welcome to Our Construction Platform
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              We connect you with top, <strong>verified</strong> construction companies.
            </Typography>
            <Button variant="contained" color="secondary">
              Learn More
            </Button>
          </Box>
        </div>
        <div>
          <img src="/image/image_two.jpg" alt="Slide 2" style={styles.carouselImage} />
          <Box sx={styles.overlay}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Quality Building Services
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Find the best services for your construction needs.
            </Typography>
            <Button variant="contained" color="secondary">
              Explore Services
            </Button>
          </Box>
        </div>
        <div>
          <img src="/image/image_three.jpg" alt="Slide 3" style={styles.carouselImage} />
          <Box sx={styles.overlay}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Premium Construction Supplies
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Get high-quality supplies for your projects.
            </Typography>
            <Button variant="contained" color="secondary">
              Shop Now
            </Button>
          </Box>
        </div>
        <div>
          <img src="/image/image_four.jpg" alt="Slide 4" style={styles.carouselImage} />
          <Box sx={styles.overlay}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Survey Instrument Rentals
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Rent the latest survey instruments for your projects.
            </Typography>
            <Button variant="contained" color="secondary">
              Rent Now
            </Button>
          </Box>
        </div>
      </Carousel>
    </Box>
  );
};

export default CDBanner;