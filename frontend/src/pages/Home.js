import React, { useEffect, useState } from "react";
import API from "../services/api";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel CSS
import { Carousel } from "react-responsive-carousel";

const Home = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Make a request to the API to get a message
    API.get("/api/services/")
      .then((response) => setMessage(response.data.message))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div style={styles.container}>
      {/* Hero Section with Carousel */}
      <header style={styles.heroSection}>
      <Carousel //hello
  autoPlay
  infiniteLoop
  showThumbs={false}
  showStatus={false}
  interval={3000}
>
  <div>
    <img src="/image/image_one.jpg" alt="Slide 1" style={styles.carouselImage} />
  </div>
  <div>
    <img src="/image/image_two.jpg" alt="Slide 2" style={styles.carouselImage} />
  </div>
  <div>
    <img src="/image/image_three.jpg" alt="Slide 3" style={styles.carouselImage} />
  </div>
  <div>
    <img src="/image/image_four.jpg" alt="Slide 4" style={styles.carouselImage} />
  </div>
  <div>
    <img src="/image/image_five.jpg" alt="Slide 5" style={styles.carouselImage} />
  </div>
</Carousel>

        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Welcome to Engineering Construction Marketplace
          </h1>
          <p style={styles.heroDescription}>
            {message ||
              "Connecting Clients, Companies, and Suppliers for Seamless Construction Services."}
          </p>
          <button
            style={styles.ctaButton}
            onMouseOver={(e) =>
              (e.target.style = { ...styles.ctaButton, ...styles.ctaButtonHover })
            }
            onMouseOut={(e) => (e.target.style = styles.ctaButton)}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Services Section */}
      <section style={styles.servicesSection}>
        <h2 style={styles.servicesTitle}>Our Core Services</h2>
        <div style={styles.servicesList}>
          <div style={styles.serviceCard}>
            <h3 style={styles.serviceCardTitle}>Survey Instrument Rental</h3>
            <p style={styles.serviceCardDescription}>
              Rent instruments like theodolites, laser levels, and GPS devices.
            </p>
          </div>
          <div style={styles.serviceCard}>
            <h3 style={styles.serviceCardTitle}>Engineering Consulting</h3>
            <p style={styles.serviceCardDescription}>
              Book consultations for structural analysis, design, and inspections.
            </p>
          </div>
          <div style={styles.serviceCard}>
            <h3 style={styles.serviceCardTitle}>Building Construction</h3>
            <p style={styles.serviceCardDescription}>
              Request residential or commercial construction services.
            </p>
          </div>
          <div style={styles.serviceCard}>
            <h3 style={styles.serviceCardTitle}>Post-Construction Maintenance</h3>
            <p style={styles.serviceCardDescription}>
              Schedule plumbing, electrical, and other maintenance services.
            </p>
          </div>
          <div style={styles.serviceCard}>
            <h3 style={styles.serviceCardTitle}>Safety and Training</h3>
            <p style={styles.serviceCardDescription}>
              Join safety training sessions and receive certifications.
            </p>
          </div>
          <div style={styles.serviceCard}>
            <h3 style={styles.serviceCardTitle}>Material Procurement</h3>
            <p style={styles.serviceCardDescription}>
              Order construction materials like cement, steel, and tools.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerLinks}>
          <a href="/terms" style={styles.footerLink}>
            Terms and Conditions
          </a>
          <a href="/about" style={styles.footerLink}>
            About Us
          </a>
        </div>
        <p style={styles.footerText}>
          © 2024 Engineering Construction Marketplace. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

// CSS Styles
const styles = {
  container: {
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  heroSection: {
    position: "relative",
    textAlign: "center",
    color: "white",
  },
  heroContent: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1,
  },
  carouselImage: {
    width: "100%",
    height: "500px",
    objectFit: "cover",
  },
  heroTitle: {
    fontSize: "2.5rem",
    marginBottom: "10px",
  },
  heroDescription: {
    fontSize: "1.2rem",
    marginBottom: "20px",
  },
  ctaButton: {
    backgroundColor: "white",
    color: "#0073e6",
    border: "none",
    padding: "10px 20px",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "5px",
    transition: "background-color 0.3s, color 0.3s",
  },
  ctaButtonHover: {
    backgroundColor: "#005bb5",
    color: "white",
  },
  servicesSection: {
    padding: "40px 20px",
    backgroundColor: "#f9f9f9",
  },
  servicesTitle: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  servicesList: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  serviceCard: {
    background: "white",
    border: "1px solid #ddd",
    padding: "20px",
    width: "300px",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s",
  },
  serviceCardTitle: {
    fontSize: "1.5rem",
    marginBottom: "10px",
  },
  serviceCardDescription: {
    fontSize: "1rem",
    color: "#555",
  },
  footer: {
    background: "#0073e6",
    color: "white",
    padding: "10px 20px",
  },
  footerText: {
    margin: 0,
    fontSize: "0.9rem",
  },
  footerLinks: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "10px",
  },
  footerLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "1rem",
    transition: "color 0.3s",
  },
};

export default Home;
