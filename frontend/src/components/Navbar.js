import React from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  InputBase,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar position="static" sx={{ backgroundColor: "#007BFF", boxShadow: "none" }}>
      <Toolbar
        sx={{
          width: "100%",
          margin: 0,
          padding: 0, // Remove all padding to make elements flush
          minHeight: "48px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Logo - Totally Left */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            color: "white",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: { xs: "1rem", sm: "1.25rem" },
            marginLeft: "0px", // Ensure no margin on the left
            paddingLeft: "10px", // Small padding for slight breathing room
          }}
        >
          ERsathii
        </Typography>

        {/* Center Menu - Hidden on mobile */}
        {!isMobile && (
          <Box sx={{ display: "flex", gap: { xs: 3, sm: 5 }, alignItems: "center", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            <Button
              component={Link}
              to="/"
              sx={{
                color: "white",
                textTransform: "none",
                fontSize: "0.9rem",
                padding: "4px 8px",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/about"
              sx={{
                color: "white",
                textTransform: "none",
                fontSize: "0.9rem",
                padding: "4px 8px",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              About Us
            </Button>
          </Box>
        )}

        {/* Right Section - Totally Right */}
        <Box
          sx={{
            display: "flex",
            gap: { xs: 1, sm: 2.5 },
            alignItems: "center",
            flexWrap: "wrap",
            marginRight: "0px", // Ensure no margin on the right
            paddingRight: "10px", // Small padding for slight breathing room
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "white",
              padding: "4px 8px",
              borderRadius: "20px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <IconButton size="small" sx={{ padding: 0 }}>
              <SearchIcon sx={{ color: "#007BFF", fontSize: "1.2rem" }} />
            </IconButton>
            <InputBase
              placeholder="Search..."
              sx={{
                ml: 0.5,
                fontSize: "0.85rem",
                width: { xs: "60px", sm: "80px" },
                color: "#555",
              }}
            />
          </Box>
          {!isMobile && (
            <>
              <Button
                component={Link}
                to="/signup"
                sx={{
                  color: "white",
                  textTransform: "none",
                  fontSize: "0.85rem",
                  padding: "4px 12px",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                }}
              >
                Sign Up
              </Button>
              <Button
                component={Link}
                to="/login"
                sx={{
                  color: "white",
                  textTransform: "none",
                  fontSize: "0.85rem",
                  padding: "4px 12px",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                }}
              >
                Login
              </Button>
            </>
          )}
          <Button
            component={Link}
            to="/companyregistration"
            variant="contained"
            sx={{
              backgroundColor: "#ff8c00",
              color: "white",
              textTransform: "none",
              padding: { xs: "4px 8px", sm: "4px 12px" },
              borderRadius: "20px",
              fontSize: { xs: "0.75rem", sm: "0.85rem" },
              "&:hover": { backgroundColor: "#ff4500" },
            }}
          >
            Register as Company
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;