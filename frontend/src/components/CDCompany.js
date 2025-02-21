import React, { useState, useEffect } from "react"; 
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Rating,
  Divider,
  Avatar
} from "@mui/material";
import { Star, LocationOn, ArrowForward, Phone } from "@mui/icons-material";
import { Link } from "react-router-dom";

const CDCompany = () => {
  // 1) State to hold fetched companies from Django (approved only)
  const [fetchedCompanies, setFetchedCompanies] = useState([]);

  // 2) On mount, fetch your approved companies
  useEffect(() => {
    // Example endpoint: adjust URL/port as needed
    fetch("http://127.0.0.1:8000/company-registration-list/")
      .then((res) => res.json())
      .then((data) => {
        // data should be an array of objects: [{id, company_name, location, ...}, ...]
        // Transform to match our existing shape:
        const transformed = data.map((item) => ({
          id: item.id,
          name: item.company_name,
          location: item.location,
          rating: 4.0, // or item.rating if your API returns a rating
          logo: "https://via.placeholder.com/48", // placeholder or real image
        }));
        setFetchedCompanies(transformed);
      })
      .catch((err) => console.error("Error fetching approved companies:", err));
  }, []);

  const finalCompanies = [...fetchedCompanies];

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {finalCompanies.map((company) => (
          <Grid item xs={12} sm={6} md={4} key={company.id}>
            <Card
              sx={{
                borderRadius: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                backgroundColor: "background.paper",
                backgroundImage: "linear-gradient(to bottom right, #ffffff 0%, #f8f9fa 100%)",
                '&:hover': {
                  transform: "translateY(-4px)",
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                {/* Company Header with Logo */}
                <Box sx={{ 
                  display: "flex",
                  alignItems: "center",
                  mb: 2
                }}>
                  <Avatar 
                    src={company.logo}
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      mr: 2,
                      bgcolor: "primary.main",
                      '& img': { p: 1 } 
                    }}
                  />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700,
                      fontSize: { xs: '1.1rem', sm: '1.2rem' },
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {company.name}
                  </Typography>
                </Box>

                {/* Location */}
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    mt: 1.5,
                    fontSize: "0.9rem"
                  }}
                >
                  <LocationOn sx={{ fontSize: 20, mr: 1, color: "error.main" }} />
                  {company.location}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Services (Renamed to "View Details") */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    View Details
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    endIcon={<ArrowForward />}
                    sx={{ 
                      mt: 1,
                      borderRadius: 1,
                      '&:hover': { backgroundColor: "action.hover" }
                    }}
                    component={Link}         // <-- Make this button act like a Link
                    to="/companydetails"
                  >
                    View Details
                  </Button>
                </Box>

                {/* Rating */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography variant="body1" sx={{ mr: 1, fontWeight: 500 }}>
                    Rating:
                  </Typography>
                  <Rating
                    name="company-rating"
                    value={company.rating}
                    precision={0.5}
                    readOnly
                    icon={<Star fontSize="inherit" sx={{ color: "gold" }} />}
                    emptyIcon={<Star fontSize="inherit" sx={{ color: "text.disabled" }} />}
                  />
                  <Typography variant="body1" sx={{ ml: 1, fontWeight: 500 }}>
                    {company.rating}/5
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Removed the "Previous Projects" section and its button */}

                {/* Contact Button */}
                <Box sx={{ mt: "auto", pt: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Phone />}
                    sx={{ 
                      borderRadius: 1,
                      py: 1,
                      textTransform: "none",
                      fontWeight: 500
                    }}
                  >
                    Contact Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CDCompany;
