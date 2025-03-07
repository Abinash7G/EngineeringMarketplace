// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Typography,
//   Card,
//   CardContent,
//   CardMedia,
//   Grid,
//   Box,
//   Divider,
//   Avatar,
//   Paper,
//   List,
//   ListItem,
//   ListItemText,
// } from "@mui/material";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import CDConsultingInquiryForm from "./CDConsultingInquiryForm";
// import { LocationOn, Phone, Email } from "@mui/icons-material";

// // Utility function to check token expiration
// const isTokenExpired = (token) => {
//   try {
//     const decoded = JSON.parse(atob(token.split('.')[1]));
//     return Date.now() >= decoded.exp * 1000;
//   } catch (err) {
//     return true; // Treat as expired if we can't decode
//   }
// };

// // Utility function for handling auth errors
// const handleAuthError = () => {
//   console.log("Authentication error occurred. Redirecting or logging out...");
//   // Add your auth error handling logic here (e.g., redirect to login)
// };

// const CompanyDetails = () => {
//   const { id } = useParams();
//   const [companyInfo, setCompanyInfo] = useState(null);
//   const [projects, setProjects] = useState([]);
//   const [teamMembers, setTeamMembers] = useState([]);
//   const [companyServices, setCompanyServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch company info
//   const fetchCompanyInfo = async () => {
//     try {
//       const response = await axios.get(`http://127.0.0.1:8000/get-company-info/${id}/`);
//       console.log("Company Info:", response.data);
//       setCompanyInfo(response.data);
//     } catch (err) {
//       console.error("Error fetching company info:", err.response?.data || err.message);
//       throw new Error(`Failed to fetch company info: ${err.response?.data?.error || err.message}`);
//     }
//   };

//   // Fetch projects
//   const fetchProjects = async () => {
//     try {
//       const response = await axios.get(`http://127.0.0.1:8000/get-company-projects/${id}/`);
//       console.log("Projects:", response.data);
//       setProjects(response.data);
//     } catch (err) {
//       console.error("Error fetching projects:", err.response?.data || err.message);
//       setProjects([]); // Fallback to empty
//     }
//   };

//   // Fetch team members
//   const fetchTeamMembers = async () => {
//     try {
//       const response = await axios.get(`http://127.0.0.1:8000/get-company-team-members/${id}/`);
//       console.log("Team Members:", response.data);
//       setTeamMembers(response.data);
//     } catch (err) {
//       console.error("Error fetching team members:", err.response?.data || err.message);
//       setTeamMembers([]); // Fallback to empty
//     }
//   };

//   // Fetch services with token handling
//   const fetchCompanyServices = async () => {
//     try {
//       let token = localStorage.getItem("access_token");
//       const refreshToken = localStorage.getItem("refresh_token");

//       if (!token) {
//         console.warn("No token found, skipping services fetch.");
//         setCompanyServices([]); // Fallback to empty if no token
//         return;
//       }

//       // Check if token is expired
//       if (isTokenExpired(token) && refreshToken) {
//         console.log("Token expired, attempting to refresh...");
//         try {
//           const refreshResponse = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
//             refresh: refreshToken,
//           });
//           token = refreshResponse.data.access;
//           localStorage.setItem("access_token", token);
//           console.log("Token refreshed successfully.");
//         } catch (refreshError) {
//           console.error("Failed to refresh token:", refreshError.response?.data || refreshError.message);
//           handleAuthError();
//           setCompanyServices([]); // Fallback to empty if refresh fails
//           return;
//         }
//       }

//       // Fetch services with the valid or refreshed token
//       const response = await axios.get(`http://127.0.0.1:8000/api/company-services/${id}/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("Company Services Response (Basic):", response.data);

//       const filteredServices = response.data.map((service, index) => ({
//         id: index + 1,
//         category: service.category || "Unknown",
//         sub_service: service.sub_service || "Unknown",
//       }));
//       setCompanyServices(filteredServices);
//     } catch (error) {
//       console.error("Error fetching services:", error.response?.data || error.message);
//       if (error.response?.status === 401) {
//         handleAuthError();
//       }
//       setCompanyServices([]); // Fallback to empty on error
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         await fetchCompanyInfo();
//         await Promise.all([fetchProjects(), fetchTeamMembers(), fetchCompanyServices()]);
//       } catch (err) {
//         setError(err.message || "Failed to load company details.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id]);

//   if (loading) {
//     return (
//       <Container sx={{ mt: 6, mb: 6, textAlign: "center" }}>
//         <Typography variant="h5">Loading...</Typography>
//       </Container>
//     );
//   }

//   if (error || !companyInfo) {
//     return (
//       <Container sx={{ mt: 6, mb: 6, textAlign: "center" }}>
//         <Typography variant="h5" color="error">{error || "Company not found."}</Typography>
//       </Container>
//     );
//   }

//   return (
//     <Container sx={{ mt: 6, mb: 6 }}>
//       {/* Header */}
//       <Box
//         sx={{
//           textAlign: "center",
//           mb: 6,
//           background: "linear-gradient(45deg, #1E3A8A, #F97316)",
//           color: "white",
//           py: 4,
//           borderRadius: 2,
//         }}
//       >
//         <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold" }}>
//           {companyInfo.company_name || "Unknown Company"}
//         </Typography>
//         <Typography variant="subtitle1" sx={{ fontStyle: "italic" }}>
//           Building the Future, One Project at a Time
//         </Typography>
//       </Box>

//       {/* Company Details */}
//       <Card sx={{ mb: 6, textAlign: "center", boxShadow: 3, p: 2 }}>
//         <CardMedia
//           component="img"
//           height="200"
//           image={companyInfo.logo ? `http://127.0.0.1:8000${companyInfo.logo}` : "https://via.placeholder.com/200"}
//           alt={companyInfo.company_name || "Company Logo"}
//           sx={{ margin: "0 auto", maxWidth: "100%" }}
//         />
//         <CardContent>
//           <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
//             <LocationOn sx={{ mr: 1, color: "#F97316" }} />
//             <Typography variant="body1" sx={{ color: "#374151" }}>
//               {companyInfo.address || "N/A"}
//             </Typography>
//           </Box>
//           <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
//             <Phone sx={{ mr: 1, color: "#F97316" }} />
//             <Typography variant="body1" sx={{ color: "#374151" }}>
//               {companyInfo.phone_number || "N/A"}
//             </Typography>
//           </Box>
//           <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
//             <Email sx={{ mr: 1, color: "#F97316" }} />
//             <Typography variant="body1" sx={{ color: "#374151" }}>
//               {companyInfo.company_email || "N/A"}
//             </Typography>
//           </Box>
//         </CardContent>
//       </Card>

//       {/* About Us */}
//       <Typography variant="h5" sx={{ mt: 6, mb: 3, fontWeight: "bold", color: "#1E3A8A" }}>
//         About Us
//       </Typography>
//       <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 2, backgroundColor: "#F3F4F6" }}>
//         <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#374151" }}>
//           {companyInfo.about_us || "No about us information available."}
//         </Typography>
//       </Paper>

//       {/* Services Offered */}
//       <Typography variant="h5" sx={{ mt: 6, mb: 3, fontWeight: "bold", color: "#1E3A8A" }}>
//         Services
//       </Typography>
//       <Grid container spacing={3}>
//         {companyServices.length > 0 ? (
//           Array.from(new Set(companyServices.map((s) => s.category))).map((category, index) => {
//             const categoryServices = companyServices.filter((s) => s.category === category);
//             return (
//               <Grid item xs={12} sm={6} key={category}>
//                 <Paper
//                   elevation={1}
//                   sx={{
//                     p: 2,
//                     border: "1px solid #e0e0e0",
//                     borderRadius: 2,
//                     backgroundColor: "#fff",
//                     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//                   }}
//                 >
//                   <Typography
//                     variant="h6"
//                     sx={{
//                       mb: 2,
//                       fontWeight: "bold",
//                       color: "#1E90FF", // Blue header
//                       borderBottom: "2px solid #FFA500", // Orange underline
//                       pb: 1,
//                     }}
//                   >
//                     {category}
//                   </Typography>
//                   <List dense>
//                     {categoryServices.map((service) => (
//                       <ListItem key={service.id} sx={{ pl: 2, py: 0.5 }}>
//                         <ListItemText
//                           primary={
//                             <Typography variant="body2" sx={{ color: "#333" }}>
//                               • {service.sub_service}
//                             </Typography>
//                           }
//                         />
//                       </ListItem>
//                     ))}
//                   </List>
//                 </Paper>
//               </Grid>
//             );
//           })
//         ) : (
//           <Typography sx={{ mt: 2 }}>No services available.</Typography>
//         )}
//       </Grid>

//       {/* Previous Projects */}
//       {projects.length > 0 && (
//         <>
//           <Typography variant="h5" sx={{ mt: 6, mb: 3, fontWeight: "bold", color: "#1E3A8A" }}>
//             Previous Projects
//           </Typography>
//           <Grid container spacing={2}>
//             {projects.map((project) => (
//               <Grid item xs={12} sm={6} md={4} key={project.id}>
//                 <Card
//                   sx={{
//                     boxShadow: 3,
//                     backgroundColor: "#E0E7FF",
//                     borderLeft: "4px solid #F97316",
//                     p: 2,
//                   }}
//                 >
//                   <CardMedia
//                     component="img"
//                     height="150"
//                     image={project.image ? `http://127.0.0.1:8000${project.image}` : "https://via.placeholder.com/150"}
//                     alt={project.name}
//                   />
//                   <CardContent>
//                     <Typography
//                       variant="h6"
//                       gutterBottom
//                       sx={{ fontWeight: "bold", color: "#1E3A8A" }}
//                     >
//                       {project.name}
//                     </Typography>
//                     <Typography variant="body2" sx={{ color: "#374151" }}>
//                       Year: {project.year || "N/A"}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </>
//       )}

//       {/* Our Team */}
//       {teamMembers.length > 0 && (
//         <>
//           <Typography variant="h5" sx={{ mt: 6, mb: 3, fontWeight: "bold", color: "#1E3A8A" }}>
//             Our Team
//           </Typography>
//           <Grid container spacing={2}>
//             {teamMembers.map((member) => (
//               <Grid item xs={12} sm={6} md={4} key={member.id}>
//                 <Card
//                   sx={{
//                     boxShadow: 3,
//                     backgroundColor: "#E0E7FF",
//                     borderLeft: "4px solid #F97316",
//                     p: 2,
//                     textAlign: "center",
//                   }}
//                 >
//                   <CardContent>
//                     <Avatar
//                       src={member.avatar ? `http://127.0.0.1:8000${member.avatar}` : "https://via.placeholder.com/100"}
//                       sx={{ width: 100, height: 100, margin: "0 auto 16px" }}
//                     />
//                     <Typography
//                       variant="h6"
//                       gutterBottom
//                       sx={{ fontWeight: "bold", color: "#1E3A8A" }}
//                     >
//                       {member.name}
//                     </Typography>
//                     <Typography variant="body2" sx={{ color: "#374151" }}>
//                       Role: {member.role || "N/A"}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </>
//       )}

//       {/* Consulting Inquiry Form */}
//       <Typography variant="h5" sx={{ mt: 6, mb: 3, fontWeight: "bold", color: "#1E3A8A" }}>
//         Consulting Inquiry Form
//       </Typography>
//       <CDConsultingInquiryForm companyId={id} />
//     </Container>
//   );
// };

// export default CompanyDetails;

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate for navbar
import axios from "axios";
import CDConsultingInquiryForm from "./CDConsultingInquiryForm";
import ClientNavbar from "./ClientNavbar"; // Import the ClientNavbar
import { LocationOn, Phone, Email } from "@mui/icons-material";

// Utility function to check token expiration
const isTokenExpired = (token) => {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= decoded.exp * 1000;
  } catch (err) {
    return true;
  }
};

// Utility function for handling auth errors
const handleAuthError = () => {
  console.log("Authentication error occurred. Redirecting or logging out...");
};

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // For navigating to profile
  const [companyInfo, setCompanyInfo] = useState(null);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [companyServices, setCompanyServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist] = useState([]); // Placeholder for wishlist data

  // Fetch company info
  const fetchCompanyInfo = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/get-company-info/${id}/`);
      setCompanyInfo(response.data);
    } catch (err) {
      throw new Error(`Failed to fetch company info: ${err.response?.data?.error || err.message}`);
    }
  };

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/get-company-projects/${id}/`);
      setProjects(response.data);
    } catch (err) {
      setProjects([]);
    }
  };

  // Fetch team members
  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/get-company-team-members/${id}/`);
      setTeamMembers(response.data);
    } catch (err) {
      setTeamMembers([]);
    }
  };

  // Fetch services with token handling
  const fetchCompanyServices = async () => {
    try {
      let token = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      if (!token) {
        setCompanyServices([]);
        return;
      }

      if (isTokenExpired(token) && refreshToken) {
        try {
          const refreshResponse = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
            refresh: refreshToken,
          });
          token = refreshResponse.data.access;
          localStorage.setItem("access_token", token);
        } catch (refreshError) {
          handleAuthError();
          setCompanyServices([]);
          return;
        }
      }

      const response = await axios.get(`http://127.0.0.1:8000/api/company-services/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredServices = response.data.map((service, index) => ({
        id: index + 1,
        category: service.category || "Unknown",
        sub_service: service.sub_service || "Unknown",
      }));
      setCompanyServices(filteredServices);
    } catch (error) {
      if (error.response?.status === 401) handleAuthError();
      setCompanyServices([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchCompanyInfo();
        await Promise.all([fetchProjects(), fetchTeamMembers(), fetchCompanyServices()]);
      } catch (err) {
        setError(err.message || "Failed to load company details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleNavigateToProfile = () => {
    navigate("/client/profile");
  };

  if (loading) {
    return (
      <Container sx={{ mt: 12, mb: 6, textAlign: "center" }}>
        <Typography variant="h5">Loading...</Typography>
      </Container>
    );
  }

  if (error || !companyInfo) {
    return (
      <Container sx={{ mt: 12, mb: 6, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          {error || "Company not found."}
        </Typography>
      </Container>
    );
  }

  return (
    <>
      {/* Navbar */}
      <ClientNavbar wishlist={wishlist} onNavigateToProfile={handleNavigateToProfile} />

      <Container sx={{ mt: 12, mb: 6 }}>
        {/* Header */}
        <Box
          sx={{
            textAlign: "center",
            mb: 6,
            background: "linear-gradient(90deg, #1E3A8A, #F97316)", // Gradient matching the image
            color: "white",
            py: 6,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold" }}>
            {companyInfo.company_name || "Unknown Company"}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontStyle: "italic" }}>
            Building the Future, One Project at a Time
          </Typography>
        </Box>

        {/* Company Details */}
        <Card sx={{ mb: 6, boxShadow: 3, p: 2, borderRadius: 2, textAlign: "center" }}>
          <CardMedia
            component="img"
            height="200"
            image={
              companyInfo.logo
                ? `http://127.0.0.1:8000${companyInfo.logo}`
                : "https://via.placeholder.com/200"
            }
            alt={companyInfo.company_name || "Company Logo"}
            sx={{ objectFit: "contain", margin: "0 auto", maxWidth: "100%" }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/200";
            }}
          />
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
              <LocationOn sx={{ mr: 1, color: "#F97316" }} />
              <Typography variant="body1" sx={{ color: "#374151" }}>
                {companyInfo.address || "N/A"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
              <Phone sx={{ mr: 1, color: "#F97316" }} />
              <Typography variant="body1" sx={{ color: "#374151" }}>
                {companyInfo.phone_number || "N/A"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Email sx={{ mr: 1, color: "#F97316" }} />
              <Typography variant="body1" sx={{ color: "#374151" }}>
                {companyInfo.company_email || "N/A"}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* About Us */}
        <Typography variant="h5" sx={{ mt: 6, mb: 3, fontWeight: "bold", color: "#1E3A8A" }}>
          About Us
        </Typography>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 6,
            borderRadius: 2,
            backgroundColor: "#F3F4F6",
            border: "1px solid #E0E0E0",
          }}
        >
          <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#374151" }}>
            {companyInfo.about_us || "No about us information available."}
          </Typography>
        </Paper>

        {/* Services Offered */}
        <Typography variant="h5" sx={{ mt: 6, mb: 3, fontWeight: "bold", color: "#1E3A8A" }}>
          Services
        </Typography>
        <Grid container spacing={3}>
          {companyServices.length > 0 ? (
            Array.from(new Set(companyServices.map((s) => s.category))).map((category, index) => {
              const categoryServices = companyServices.filter((s) => s.category === category);
              return (
                <Grid item xs={12} sm={6} key={category}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "#fff",
                      transition: "transform 0.3s",
                      "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontWeight: "bold",
                        color: "#1E90FF",
                        borderBottom: "2px solid #F97316", // Orange underline
                        pb: 1,
                      }}
                    >
                      {category}
                    </Typography>
                    <List dense>
                      {categoryServices.map((service) => (
                        <ListItem key={service.id} sx={{ pl: 2, py: 0.5 }}>
                          <ListItemText
                            primary={
                              <Typography variant="body2" sx={{ color: "#333" }}>
                                <Box
                                  component="span"
                                  sx={{ color: "#F97316", mr: 1 }}
                                >
                                  •
                                </Box>
                                {service.sub_service}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              );
            })
          ) : (
            <Typography sx={{ mt: 2 }}>No services available.</Typography>
          )}
        </Grid>

        {/* Previous Projects */}
        {projects.length > 0 && (
          <>
            <Typography
              variant="h5"
              sx={{ mt: 6, mb: 3, fontWeight: "bold", color: "#1E3A8A" }}
            >
              Previous Projects
            </Typography>
            <Grid container spacing={3}>
              {projects.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project.id}>
                  <Card
                    sx={{
                      boxShadow: 3,
                      backgroundColor: "#E0E7FF",
                      borderLeft: "4px solid #F97316",
                      transition: "transform 0.3s",
                      "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={
                        project.image
                          ? `http://127.0.0.1:8000${project.image}`
                          : "https://via.placeholder.com/200"
                      }
                      alt={project.name}
                      sx={{ objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/200";
                      }}
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: "bold", color: "#1E3A8A" }}
                      >
                        {project.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#374151", mb: 1 }}
                      >
                        {project.description || "No description available."}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#374151" }}>
                        Year: {project.year || "N/A"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Our Team */}
        {teamMembers.length > 0 && (
          <>
            <Typography
              variant="h5"
              sx={{ mt: 6, mb: 3, fontWeight: "bold", color: "#1E3A8A" }}
            >
              Our Team
            </Typography>
            <Grid container spacing={3}>
              {teamMembers.map((member) => (
                <Grid item xs={12} sm={6} md={4} key={member.id}>
                  <Card
                    sx={{
                      boxShadow: 3,
                      backgroundColor: "#E0E7FF",
                      borderLeft: "4px solid #F97316",
                      textAlign: "center",
                      transition: "transform 0.3s",
                      "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
                    }}
                  >
                    <CardContent>
                      <Avatar
                        src={
                          member.avatar
                            ? `http://127.0.0.1:8000${member.avatar}`
                            : "https://via.placeholder.com/100"
                        }
                        sx={{
                          width: 120,
                          height: 120,
                          margin: "0 auto 16px",
                          border: "4px solid #F97316",
                        }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/100";
                        }}
                      />
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: "bold", color: "#1E3A8A" }}
                      >
                        {member.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#374151" }}>
                        Role: {member.role || "N/A"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Consulting Inquiry Form */}
        <Typography
          variant="h5"
          sx={{ mt: 6, mb: 3, fontWeight: "bold", color: "#1E3A8A" }}
        >
          Consulting Inquiry Form
        </Typography>
        <CDConsultingInquiryForm companyId={id} />
      </Container>
    </>
  );
};

export default CompanyDetails;