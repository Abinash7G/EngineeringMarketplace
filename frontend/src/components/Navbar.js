import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaTools } from "react-icons/fa";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  InputBase,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dropdownVisible = Boolean(anchorEl);

  const handleDropdownOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#007BFF" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            color: "white",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ERsathii
        </Typography>

        {/* Center Menu */}
        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          <Button component={Link} to="/" sx={navLinkStyles}>
            Home
          </Button>
          <Button
            onClick={handleDropdownOpen}
            endIcon={<FaTools />}
            sx={navLinkStyles}
          >
            Services
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={dropdownVisible}
            onClose={handleDropdownClose}
            MenuListProps={{
              onMouseLeave: handleDropdownClose,
            }}
            sx={{
              mt: 2,
              "& .MuiPaper-root": {
                borderRadius: 2,
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <MenuItem
              component={Link}
              to="/survey-instrument"
              onClick={handleDropdownClose}
              sx={dropdownStyles}
            >
              Survey Instrument Rentals
            </MenuItem>
            <MenuItem
              component={Link}
              to="/engineering-consulting"
              onClick={handleDropdownClose}
              sx={dropdownStyles}
            >
              Engineering Consulting
            </MenuItem>
            <MenuItem
              component={Link}
              to="/building-construction"
              onClick={handleDropdownClose}
              sx={dropdownStyles}
            >
              Building Construction
            </MenuItem>
            <MenuItem
              component={Link}
              to="/post-maintenance"
              onClick={handleDropdownClose}
              sx={dropdownStyles}
            >
              Post-Construction Maintenance
            </MenuItem>
            <MenuItem
              component={Link}
              to="/material-marketplace"
              onClick={handleDropdownClose}
              sx={dropdownStyles}
            >
              Material Marketplace
            </MenuItem>
          </Menu>
          <Button component={Link} to="/about" sx={navLinkStyles}>
            About Us
          </Button>
          <Button component={Link} to="/contact" sx={navLinkStyles}>
            Contact
          </Button>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "white",
              padding: "2px 10px",
              borderRadius: "5px",
            }}
          >
            <IconButton size="small" sx={{ padding: 0 }}>
              <SearchIcon />
            </IconButton>
            <InputBase
              placeholder="Search..."
              sx={{
                ml: 1,
                fontSize: "1rem",
                width: "150px",
              }}
            />
          </Box>
          <Button
            component={Link}
            to="/signup"
            variant="contained"
            color="primary"
            sx={{ textTransform: "none" }}
          >
            Signup
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Login
          </Button>
          <Button
            component={Link}
            to="/company-registration"
            variant="contained"
            color="warning"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Register as Company
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const navLinkStyles = {
  color: "white",
  textDecoration: "none",
  textTransform: "none",
  fontWeight: "bold",
  "&:hover": {
    textDecoration: "underline",
  },
};

const dropdownStyles = {
  textDecoration: "none",
  color: "#007BFF",
  fontWeight: "normal",
  "&:hover": {
    backgroundColor: "rgba(0, 123, 255, 0.1)",
  },
};

export default Navbar;
