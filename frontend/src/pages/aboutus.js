import React from 'react';
import { Container, Typography, Box, Grid, Button, Card, CardContent } from '@mui/material';
import { styled } from '@mui/system';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedIcon from '@mui/icons-material/Verified';
import HandshakeIcon from '@mui/icons-material/Handshake';

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '400px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: 'url("https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', // Replace with your construction-related image URL
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: '#fff',
  textAlign: 'center',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)', // Overlay for better text readability
  },
}));

const HeroContent = styled(Box)({
  position: 'relative',
  zIndex: 1,
});

const Section = styled(Box)(({ theme }) => ({
  padding: '60px 0',
}));

const ValueCard = styled(Card)(({ theme }) => ({
  padding: '20px',
  height: '100%',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '16px',
  '& svg': {
    fontSize: '40px',
    color: '#1976d2',
  },
}));

const CTAButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
  padding: '12px 30px',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  '&:hover': {
    background: 'linear-gradient(45deg, #1565c0 30%, #2196f3 90%)',
  },
}));

const AboutUsPage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '2.5rem', md: '4rem' } }}>
            About Nepal Builders
          </Typography>
          <Typography variant="h5" sx={{ maxWidth: '800px', margin: '0 auto', fontSize: { xs: '1rem', md: '1.5rem' } }}>
            Connecting clients with verified construction firms across Nepal since 2020. Our mission is to transform the construction industry through transparency, quality assurance, and innovative solutions.
          </Typography>
        </HeroContent>
      </HeroSection>

      {/* Our Story */}
      <Section>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
            Our Story
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
            <strong>Nepal Builders</strong> was founded with a clear vision: to bring transparency and efficiency to Nepal’s construction industry. After witnessing the challenges faced by both clients and construction companies in finding each other and managing projects efficiently, we created this marketplace platform. Starting with just a handful of verified companies in Kathmandu, we’ve grown to support construction projects across all seven provinces of Nepal, connecting thousands of clients with qualified construction professionals.
          </Typography>
        </Container>
      </Section>

      {/* Our Values */}
      <Section sx={{ backgroundColor: '#f5f5f5' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
            Our Values
          </Typography>
          <Grid container spacing={4} sx={{ mt: 3 }}>
            <Grid item xs={12} sm={4}>
              <ValueCard>
                <CardContent>
                  <IconWrapper>
                    <SecurityIcon />
                  </IconWrapper>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                    Transparency
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.6 }}>
                    We believe in clear communication and honest business practices throughout the construction process.
                  </Typography>
                </CardContent>
              </ValueCard>
            </Grid>
            <Grid item xs={12} sm={4}>
              <ValueCard>
                <CardContent>
                  <IconWrapper>
                    <VerifiedIcon />
                  </IconWrapper>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                    Quality
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.6 }}>
                    We verify all companies on our platform to ensure they meet our strict quality and reliability standards.
                  </Typography>
                </CardContent>
              </ValueCard>
            </Grid>
            <Grid item xs={12} sm={4}>
              <ValueCard>
                <CardContent>
                  <IconWrapper>
                    <HandshakeIcon />
                  </IconWrapper>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                    Partnership
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.6 }}>
                    We foster meaningful relationships between clients and construction professionals for successful projects.
                  </Typography>
                </CardContent>
              </ValueCard>
            </Grid>
          </Grid>
        </Container>
      </Section>

      {/* Call to Action */}
      <Section>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333', fontSize: '1.5rem' }}>
            Join Us in Building a Better Future
          </Typography>
          <CTAButton variant="contained" href="/signup">
            Get Started
          </CTAButton>
        </Container>
      </Section>
    </Box>
  );
};

export default AboutUsPage;