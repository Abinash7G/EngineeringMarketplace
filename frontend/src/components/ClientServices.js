// // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // import {
// // // // // // //   Box,
// // // // // // //   Paper,
// // // // // // //   Typography,
// // // // // // //   CircularProgress,
// // // // // // //   useTheme,
// // // // // // //   Table,
// // // // // // //   TableBody,
// // // // // // //   TableCell,
// // // // // // //   TableContainer,
// // // // // // //   TableHead,
// // // // // // //   TableRow,
// // // // // // //   Button,
// // // // // // //   Dialog,
// // // // // // //   DialogTitle,
// // // // // // //   DialogContent,
// // // // // // //   Link,
// // // // // // // } from '@mui/material';
// // // // // // // import {
// // // // // // //   Person as PersonIcon,
// // // // // // //   LocationOn as LocationOnIcon,
// // // // // // //   Email as EmailIcon,
// // // // // // //   Phone as PhoneIcon,
// // // // // // //   Category as CategoryIcon,
// // // // // // //   Build as BuildIcon,
// // // // // // // } from '@mui/icons-material';
// // // // // // // import axios from 'axios';
// // // // // // // import Footer from "../pages/footer"; // Adjust path if needed
// // // // // // // import ClientNavbar from "../components/ClientNavbar"; // Import ClientNavbar (adjust path as needed)

// // // // // // // const ClientServices = () => {
// // // // // // //   const theme = useTheme();
// // // // // // //   const [inquiries, setInquiries] = useState([]);
// // // // // // //   const [loading, setLoading] = useState(true);
// // // // // // //   const [error, setError] = useState('');
// // // // // // //   const [openDetails, setOpenDetails] = useState(false);
// // // // // // //   const [selectedInquiry, setSelectedInquiry] = useState(null);

// // // // // // //   const backendBaseUrl = 'http://127.0.0.1:8000'; // Backend base URL

// // // // // // //   const fetchClientInquiries = async () => {
// // // // // // //     setLoading(true);
// // // // // // //     try {
// // // // // // //       const token = localStorage.getItem('access_token');
// // // // // // //       if (!token) {
// // // // // // //         throw new Error('No access token found. Please log in.');
// // // // // // //       }
// // // // // // //       const response = await axios.get(`${backendBaseUrl}/api/client-inquiries/`, {
// // // // // // //         headers: { Authorization: `Bearer ${token}` },
// // // // // // //       });
// // // // // // //       console.log('Fetched inquiries:', response.data); // Debug: Log all inquiries
      
// // // // // // //       const receivedInquiries = Array.isArray(response.data) ? response.data : [];
// // // // // // //       const sortedInquiries = [...receivedInquiries].sort((a, b) => 
// // // // // // //         new Date(b.created_at) - new Date(a.created_at)
// // // // // // //       );
      
// // // // // // //       setInquiries(sortedInquiries);
// // // // // // //     } catch (err) {
// // // // // // //       console.error('Error fetching inquiries:', err);
// // // // // // //       setError(err.message || 'Failed to load inquiries');
// // // // // // //     } finally {
// // // // // // //       setLoading(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   useEffect(() => {
// // // // // // //     fetchClientInquiries();
// // // // // // //   }, []);

// // // // // // //   const formatDate = (dateString) => {
// // // // // // //     if (!dateString) return 'N/A';
// // // // // // //     try {
// // // // // // //       const options = {
// // // // // // //         year: 'numeric',
// // // // // // //         month: 'short',
// // // // // // //         day: '2-digit',
// // // // // // //         hour: '2-digit',
// // // // // // //         minute: '2-digit',
// // // // // // //         hour12: true,
// // // // // // //       };
// // // // // // //       return new Date(dateString).toLocaleString('en-US', options);
// // // // // // //     } catch (e) {
// // // // // // //       return 'Invalid Date';
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleViewDetails = (inquiry) => {
// // // // // // //     console.log('Selected inquiry:', inquiry);
// // // // // // //     setSelectedInquiry(inquiry);
// // // // // // //     setOpenDetails(true);
// // // // // // //   };

// // // // // // //   const handleCloseDetails = () => {
// // // // // // //     setOpenDetails(false);
// // // // // // //     setSelectedInquiry(null);
// // // // // // //   };

// // // // // // //   const handleNavigateToProfile = () => {
// // // // // // //     window.location.href = "/client/profile"; // Replace with your profile route
// // // // // // //   };

// // // // // // //   const renderDetails = (inquiry) => {
// // // // // // //     if (!inquiry) return <Typography>No inquiry selected.</Typography>;

// // // // // // //     const renderField = (label, value) => (
// // // // // // //       value && (
// // // // // // //         <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
// // // // // // //           <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px' }}>
// // // // // // //             {label}:
// // // // // // //           </Typography>
// // // // // // //           <Typography variant="body2">{value}</Typography>
// // // // // // //         </Box>
// // // // // // //       )
// // // // // // //     );

// // // // // // //     const renderFileField = (label, fileUrl) => (
// // // // // // //       fileUrl && (
// // // // // // //         <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
// // // // // // //           <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px' }}>
// // // // // // //             {label}:
// // // // // // //           </Typography>
// // // // // // //           <Link href={fileUrl} target="_blank" sx={{ color: theme.palette.secondary.main }}>
// // // // // // //             View/Download
// // // // // // //           </Link>
// // // // // // //         </Box>
// // // // // // //       )
// // // // // // //     );

// // // // // // //     const renderComments = () => {
// // // // // // //       if (!inquiry.comments || inquiry.comments.length === 0) {
// // // // // // //         return (
// // // // // // //           <Typography variant="body2" sx={{ pl: 2, mb: 2, color: theme.palette.text.secondary }}>
// // // // // // //             No comments yet.
// // // // // // //           </Typography>
// // // // // // //         );
// // // // // // //       }
// // // // // // //       return (
// // // // // // //         <Box sx={{ pl: 2, mb: 2 }}>
// // // // // // //           {inquiry.comments.map((comment) => (
// // // // // // //             <Box key={comment.id} sx={{ mb: 1 }}>
// // // // // // //               <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
// // // // // // //                 "{comment.comment_text}"
// // // // // // //               </Typography>
// // // // // // //               <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
// // // // // // //                 Added on {formatDate(comment.created_at)}
// // // // // // //               </Typography>
// // // // // // //             </Box>
// // // // // // //           ))}
// // // // // // //         </Box>
// // // // // // //       );
// // // // // // //     };

// // // // // // //     const data = inquiry.service_data || {};

// // // // // // //     return (
// // // // // // //       <Box sx={{ mt: 2 }}>
// // // // // // //         <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>
// // // // // // //           {inquiry.category || 'Unknown Category'} Details
// // // // // // //         </Typography>
// // // // // // //         {inquiry.category === 'Engineering Consulting' && (
// // // // // // //           <>
// // // // // // //             {renderField('Type of Building', data.type_of_building)}
// // // // // // //             {renderField('Building Purpose', data.building_purpose)}
// // // // // // //             {renderField('Number of Floors', data.num_floors)}
// // // // // // //             {renderField('Land Area', data.land_area)}
// // // // // // //             {renderField('Architectural Style', data.architectural_style)}
// // // // // // //             {renderField('Other Architectural Style', data.architectural_style_other)}
// // // // // // //             {renderField('Budget Estimate', data.budget_estimate)}
// // // // // // //             {renderField('Special Requirements', data.special_requirements)}
// // // // // // //             {renderFileField('Site Plan', data.site_plan)}
// // // // // // //             {renderFileField('Architectural Plan', data.architectural_plan)}
// // // // // // //             {renderFileField('Soil Test Report', data.soil_test_report)}
// // // // // // //             {renderFileField('Foundation Design', data.foundation_design)}
// // // // // // //             {renderFileField('Electrical Plan', data.electrical_plan)}
// // // // // // //             {renderFileField('Plumbing Plan', data.plumbing_plan)}
// // // // // // //             {renderFileField('HVAC Plan', data.hvac_plan)}
// // // // // // //             {renderFileField('Construction Permit', data.construction_permit)}
// // // // // // //             {renderFileField('Cost Estimation', data.cost_estimation)}
// // // // // // //           </>
// // // // // // //         )}
// // // // // // //         {inquiry.category === 'Building Construction Services' && (
// // // // // // //           <>
// // // // // // //             {renderFileField('Lalpurja', data.lalpurja)}
// // // // // // //             {renderFileField('Napi Naksa', data.napi_naksa)}
// // // // // // //             {renderFileField('Tax Clearance', data.tax_clearance)}
// // // // // // //             {renderFileField('Approved Building Drawings', data.approved_building_drawings)}
// // // // // // //             {inquiry.sub_service === 'Residential Construction' && (
// // // // // // //               <>
// // // // // // //                 {renderFileField('Soil Test Report', data.soil_test_report)}
// // // // // // //                 {renderFileField('Structural Stability Certificate', data.structural_stability_certificate)}
// // // // // // //                 {renderFileField('House Design Approval', data.house_design_approval)}
// // // // // // //                 {renderFileField('Neighbour Consent', data.neighbour_consent)}
// // // // // // //               </>
// // // // // // //             )}
// // // // // // //             {inquiry.sub_service === 'Commercial Construction' && (
// // // // // // //               <>
// // // // // // //                 {renderFileField('IEE Report', data.iee_report)}
// // // // // // //                 {renderFileField('Fire Safety Certificate', data.fire_safety_certificate)}
// // // // // // //                 {renderFileField('Lift Permit', data.lift_permit)}
// // // // // // //                 {renderFileField('Parking Layout Plan', data.parking_layout_plan)}
// // // // // // //                 {renderField('Special Requirements', data.commercial_special_requirements)}
// // // // // // //               </>
// // // // // // //             )}
// // // // // // //             {inquiry.sub_service === 'Renovation and Remodeling Services' && (
// // // // // // //               <>
// // // // // // //                 {renderField('Type of Building', data.type_of_building)}
// // // // // // //                 {renderField('Existing Building Details', data.existing_building_details)}
// // // // // // //                 {renderField('Area to Renovate', data.area_to_renovate)}
// // // // // // //                 {renderField('Budget Estimate', data.budget_estimate)}
// // // // // // //                 {renderField('Special Requirements', data.renovation_special_requirements)}
// // // // // // //                 {renderFileField('Owner Permission Letter', data.owner_permission_letter)}
// // // // // // //                 {renderFileField('Existing Structure Analysis', data.existing_structure_analysis)}
// // // // // // //                 {renderFileField('Renovation Plan', data.renovation_plan)}
// // // // // // //                 {renderFileField('NOC from Municipality', data.noc_municipality)}
// // // // // // //                 {renderFileField('Waste Management Plan', data.waste_management_plan)}
// // // // // // //               </>
// // // // // // //             )}
// // // // // // //           </>
// // // // // // //         )}
// // // // // // //         {inquiry.category === 'Post-Construction Maintenance' && (
// // // // // // //           <>
// // // // // // //             {renderField('Maintenance Type', data.maintenance_type)}
// // // // // // //             {renderField('Maintenance Details', data.maintenance_details)}
// // // // // // //             {renderFileField('Maintenance Photos', data.maintenance_photos)}
// // // // // // //             {renderField('Preferred Date', data.preferred_date)}
// // // // // // //             {renderField('Preferred Time', data.preferred_time)}
// // // // // // //             {renderField('Payment Agreed', data.payment_agreed ? 'Yes' : 'No')}
// // // // // // //             <Box sx={{ mt: 2 }}>
// // // // // // //               <Typography variant="h6" sx={{ 
// // // // // // //                 color: theme.palette.primary.main,
// // // // // // //                 fontWeight: 'bold',
// // // // // // //                 mb: 2
// // // // // // //               }}>
// // // // // // //                 Comments
// // // // // // //               </Typography>
// // // // // // //               {renderComments()}
// // // // // // //             </Box>
// // // // // // //           </>
// // // // // // //         )}
// // // // // // //         {inquiry.category === 'Safety and Training Services' && (
// // // // // // //           <>
// // // // // // //             {renderField('Language Preference', data.language_preference)}
// // // // // // //             {renderField('Other Language', data.language_preference_other)}
// // // // // // //             {renderField('Training Date', data.training_date)}
// // // // // // //             {renderField('Training Time', data.training_time)}
// // // // // // //             {renderField('Training Agreement', data.training_agreement ? 'Yes' : 'No')}
// // // // // // //             {inquiry.certificate && (
// // // // // // //               <Box sx={{ mt: 2 }}>
// // // // // // //                 <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 1 }}>
// // // // // // //                   Certificate
// // // // // // //                 </Typography>
// // // // // // //                 {renderFileField('Your Certificate', inquiry.certificate)}
// // // // // // //               </Box>
// // // // // // //             )}
// // // // // // //             {!inquiry.certificate && inquiry.status === 'Completed' && (
// // // // // // //               <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 2 }}>
// // // // // // //                 Certificate not yet uploaded by the company.
// // // // // // //               </Typography>
// // // // // // //             )}
// // // // // // //           </>
// // // // // // //         )}
// // // // // // //         {!['Engineering Consulting', 'Building Construction Services', 'Post-Construction Maintenance', 'Safety and Training Services'].includes(inquiry.category) && (
// // // // // // //           <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
// // // // // // //             No additional details available for this category.
// // // // // // //           </Typography>
// // // // // // //         )}
// // // // // // //       </Box>
// // // // // // //     );
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
// // // // // // //       {/* Add ClientNavbar at the top */}
// // // // // // //       <ClientNavbar
// // // // // // //         wishlist={[]} // Placeholder: Replace with actual wishlist data if available
// // // // // // //         cartItems={[]} // Placeholder: Replace with actual cart data if available
// // // // // // //         onNavigateToProfile={handleNavigateToProfile}
// // // // // // //       />

// // // // // // //       {/* Main content */}
// // // // // // //       <Box sx={{ p: 2, flex: 1, mt: 8 }}>
// // // // // // //         <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
// // // // // // //           <Typography variant="h4" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: 'bold' }}>
// // // // // // //             My Inquiries
// // // // // // //           </Typography>

// // // // // // //           {loading ? (
// // // // // // //             <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
// // // // // // //               <CircularProgress size={60} />
// // // // // // //             </Box>
// // // // // // //           ) : error ? (
// // // // // // //             <Typography color="error" sx={{ p: 2, bgcolor: '#ffeeee', borderRadius: 2 }}>
// // // // // // //               {error}
// // // // // // //             </Typography>
// // // // // // //           ) : inquiries.length === 0 ? (
// // // // // // //             <Typography variant="h6" sx={{ p: 2, color: theme.palette.text.secondary }}>
// // // // // // //               No inquiries found
// // // // // // //             </Typography>
// // // // // // //           ) : (
// // // // // // //             <TableContainer component={Paper}>
// // // // // // //               <Table sx={{ minWidth: 650 }} aria-label="inquiries table">
// // // // // // //                 <TableHead>
// // // // // // //                   <TableRow>
// // // // // // //                     <TableCell>Full Name</TableCell>
// // // // // // //                     <TableCell>Location</TableCell>
// // // // // // //                     <TableCell>Category</TableCell>
// // // // // // //                     <TableCell>Sub-Service</TableCell>
// // // // // // //                     <TableCell>Status</TableCell>
// // // // // // //                     <TableCell>Submitted At</TableCell>
// // // // // // //                     <TableCell>Actions</TableCell>
// // // // // // //                   </TableRow>
// // // // // // //                 </TableHead>
// // // // // // //                 <TableBody>
// // // // // // //                   {inquiries.map((inquiry) => (
// // // // // // //                     <TableRow key={inquiry.id}>
// // // // // // //                       <TableCell>{inquiry.full_name || 'N/A'}</TableCell>
// // // // // // //                       <TableCell>{inquiry.location || 'N/A'}</TableCell>
// // // // // // //                       <TableCell>{inquiry.category || 'N/A'}</TableCell>
// // // // // // //                       <TableCell>{inquiry.sub_service || 'N/A'}</TableCell>
// // // // // // //                       <TableCell>{inquiry.status || 'N/A'}</TableCell>
// // // // // // //                       <TableCell>{formatDate(inquiry.created_at)}</TableCell>
// // // // // // //                       <TableCell>
// // // // // // //                         <Button
// // // // // // //                           variant="outlined"
// // // // // // //                           color="primary"
// // // // // // //                           onClick={() => handleViewDetails(inquiry)}
// // // // // // //                           disabled={!inquiry.id}
// // // // // // //                         >
// // // // // // //                           View Details
// // // // // // //                         </Button>
// // // // // // //                       </TableCell>
// // // // // // //                     </TableRow>
// // // // // // //                   ))}
// // // // // // //                 </TableBody>
// // // // // // //               </Table>
// // // // // // //             </TableContainer>
// // // // // // //           )}
// // // // // // //         </Paper>

// // // // // // //         {/* Details Dialog */}
// // // // // // //         <Dialog open={openDetails} onClose={handleCloseDetails} maxWidth="md" fullWidth>
// // // // // // //           <DialogTitle>Inquiry Details</DialogTitle>
// // // // // // //           <DialogContent>
// // // // // // //             {selectedInquiry && (
// // // // // // //               <Box sx={{ p: 2 }}>
// // // // // // //                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
// // // // // // //                   <PersonIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
// // // // // // //                   <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
// // // // // // //                     {selectedInquiry.full_name || 'N/A'}
// // // // // // //                   </Typography>
// // // // // // //                 </Box>
// // // // // // //                 <Box sx={{ pl: 4 }}>
// // // // // // //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// // // // // // //                     <LocationOnIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// // // // // // //                     {selectedInquiry.location || 'N/A'}
// // // // // // //                   </Typography>
// // // // // // //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// // // // // // //                     <EmailIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// // // // // // //                     {selectedInquiry.email || 'N/A'}
// // // // // // //                   </Typography>
// // // // // // //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// // // // // // //                     <PhoneIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// // // // // // //                     {selectedInquiry.phone_number || 'N/A'}
// // // // // // //                   </Typography>
// // // // // // //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// // // // // // //                     <CategoryIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// // // // // // //                     <strong>Category:</strong> {selectedInquiry.category || 'N/A'}
// // // // // // //                   </Typography>
// // // // // // //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// // // // // // //                     <BuildIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// // // // // // //                     <strong>Sub-Service:</strong> {selectedInquiry.sub_service || 'N/A'}
// // // // // // //                   </Typography>
// // // // // // //                   {renderDetails(selectedInquiry)}
// // // // // // //                 </Box>
// // // // // // //               </Box>
// // // // // // //             )}
// // // // // // //           </DialogContent>
// // // // // // //         </Dialog>
// // // // // // //       </Box>

// // // // // // //       {/* Footer at the bottom */}
// // // // // // //       <Footer />
// // // // // // //     </Box>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default ClientServices;
// // // // // // import React, { useState, useEffect } from 'react';
// // // // // // import {
// // // // // //   Box,
// // // // // //   Paper,
// // // // // //   Typography,
// // // // // //   CircularProgress,
// // // // // //   useTheme,
// // // // // //   Table,
// // // // // //   TableBody,
// // // // // //   TableCell,
// // // // // //   TableContainer,
// // // // // //   TableHead,
// // // // // //   TableRow,
// // // // // //   Button,
// // // // // //   Dialog,
// // // // // //   DialogTitle,
// // // // // //   DialogContent,
// // // // // //   Link,
// // // // // //   TextField,
// // // // // //   Alert,
// // // // // // } from '@mui/material';
// // // // // // import {
// // // // // //   Person as PersonIcon,
// // // // // //   LocationOn as LocationOnIcon,
// // // // // //   Email as EmailIcon,
// // // // // //   Phone as PhoneIcon,
// // // // // //   Category as CategoryIcon,
// // // // // //   Build as BuildIcon,
// // // // // //   Visibility as VisibilityIcon,
// // // // // //   GetApp as DownloadIcon,
// // // // // // } from '@mui/icons-material';
// // // // // // import axios from 'axios';
// // // // // // import Footer from "../pages/footer"; // Adjust path if needed
// // // // // // import ClientNavbar from "../components/ClientNavbar"; // Import ClientNavbar (adjust path as needed)

// // // // // // const ClientServices = () => {
// // // // // //   const theme = useTheme();
// // // // // //   const [inquiries, setInquiries] = useState([]);
// // // // // //   const [loading, setLoading] = useState(true);
// // // // // //   const [error, setError] = useState('');
// // // // // //   const [openDetails, setOpenDetails] = useState(false);
// // // // // //   const [selectedInquiry, setSelectedInquiry] = useState(null);
// // // // // //   const [commentText, setCommentText] = useState('');
// // // // // //   const [commentStatus, setCommentStatus] = useState(null);

// // // // // //   const backendBaseUrl = 'http://127.0.0.1:8000'; // Backend base URL

// // // // // //   const fetchClientInquiries = async () => {
// // // // // //     setLoading(true);
// // // // // //     try {
// // // // // //       const token = localStorage.getItem('access_token');
// // // // // //       if (!token) {
// // // // // //         throw new Error('No access token found. Please log in.');
// // // // // //       }
// // // // // //       const response = await axios.get(`${backendBaseUrl}/api/client-inquiries/`, {
// // // // // //         headers: { Authorization: `Bearer ${token}` },
// // // // // //       });
// // // // // //       console.log('Fetched inquiries:', response.data); // Debug: Log all inquiries
      
// // // // // //       const receivedInquiries = Array.isArray(response.data) ? response.data : [];
// // // // // //       const sortedInquiries = [...receivedInquiries].sort((a, b) => 
// // // // // //         new Date(b.created_at) - new Date(a.created_at)
// // // // // //       );
      
// // // // // //       setInquiries(sortedInquiries);
// // // // // //     } catch (err) {
// // // // // //       console.error('Error fetching inquiries:', err);
// // // // // //       setError(err.message || 'Failed to load inquiries');
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   useEffect(() => {
// // // // // //     fetchClientInquiries();
// // // // // //   }, []);

// // // // // //   const formatDate = (dateString) => {
// // // // // //     if (!dateString) return 'N/A';
// // // // // //     try {
// // // // // //       const options = {
// // // // // //         year: 'numeric',
// // // // // //         month: 'short',
// // // // // //         day: '2-digit',
// // // // // //         hour: '2-digit',
// // // // // //         minute: '2-digit',
// // // // // //         hour12: true,
// // // // // //       };
// // // // // //       return new Date(dateString).toLocaleString('en-US', options);
// // // // // //     } catch (e) {
// // // // // //       return 'Invalid Date';
// // // // // //     }
// // // // // //   };

// // // // // //   const handleViewDetails = (inquiry) => {
// // // // // //     console.log('Selected inquiry:', inquiry);
// // // // // //     setSelectedInquiry(inquiry);
// // // // // //     setOpenDetails(true);
// // // // // //   };

// // // // // //   const handleCloseDetails = () => {
// // // // // //     setOpenDetails(false);
// // // // // //     setSelectedInquiry(null);
// // // // // //     setCommentText('');
// // // // // //     setCommentStatus(null);
// // // // // //   };

// // // // // //   const handleAddComment = async (inquiryId) => {
// // // // // //     if (!commentText) {
// // // // // //       setCommentStatus({ type: 'error', message: 'Please enter a comment' });
// // // // // //       return;
// // // // // //     }

// // // // // //     try {
// // // // // //       const token = localStorage.getItem('access_token');
// // // // // //       await axios.post(
// // // // // //         `${backendBaseUrl}/api/add-comment/${inquiryId}/`,
// // // // // //         { comment_text: commentText, company_response: '' },
// // // // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // // // //       );
// // // // // //       setCommentStatus({ type: 'success', message: 'Comment added successfully!' });
// // // // // //       setCommentText('');
// // // // // //       fetchClientInquiries();
// // // // // //     } catch (err) {
// // // // // //       setCommentStatus({
// // // // // //         type: 'error',
// // // // // //         message: err.response?.data?.error || 'Failed to add comment',
// // // // // //       });
// // // // // //     }
// // // // // //   };

// // // // // //   const handleNavigateToProfile = () => {
// // // // // //     window.location.href = "/client/profile"; // Replace with your profile route
// // // // // //   };

// // // // // //   const renderDetails = (inquiry) => {
// // // // // //     if (!inquiry) return <Typography>No inquiry selected.</Typography>;

// // // // // //     const renderField = (label, value) => (
// // // // // //       value && (
// // // // // //         <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
// // // // // //           <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px' }}>
// // // // // //             {label}:
// // // // // //           </Typography>
// // // // // //           <Typography variant="body2">{value}</Typography>
// // // // // //         </Box>
// // // // // //       )
// // // // // //     );

// // // // // //     const renderFileField = (label, fileUrl) => (
// // // // // //       fileUrl && (
// // // // // //         <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
// // // // // //           <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px' }}>
// // // // // //             {label}:
// // // // // //           </Typography>
// // // // // //           <Box sx={{ display: 'flex', gap: 1 }}>
// // // // // //             <Link href={fileUrl} target="_blank" sx={{ color: theme.palette.secondary.main }}>
// // // // // //               <VisibilityIcon sx={{ fontSize: 20, mr: 0.5 }} /> View
// // // // // //             </Link>
// // // // // //             <Link href={fileUrl} download sx={{ color: theme.palette.secondary.main }}>
// // // // // //               <DownloadIcon sx={{ fontSize: 20, mr: 0.5 }} /> Download
// // // // // //             </Link>
// // // // // //           </Box>
// // // // // //         </Box>
// // // // // //       )
// // // // // //     );

// // // // // //     const renderFileArrayField = (label, files) => (
// // // // // //       files && files.length > 0 && (
// // // // // //         <Box sx={{ mb: 1 }}>
// // // // // //           <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px', mb: 1 }}>
// // // // // //             {label}:
// // // // // //           </Typography>
// // // // // //           {files.map((file, index) => (
// // // // // //             <Box key={index} sx={{ display: 'flex', gap: 1, mb: 0.5, pl: 2 }}>
// // // // // //               <Link href={file} target="_blank" sx={{ color: theme.palette.secondary.main }}>
// // // // // //                 <VisibilityIcon sx={{ fontSize: 20, mr: 0.5 }} /> View {label} {index + 1}
// // // // // //               </Link>
// // // // // //               <Link href={file} download sx={{ color: theme.palette.secondary.main }}>
// // // // // //                 <DownloadIcon sx={{ fontSize: 20, mr: 0.5 }} /> Download
// // // // // //               </Link>
// // // // // //             </Box>
// // // // // //           ))}
// // // // // //         </Box>
// // // // // //       )
// // // // // //     );

// // // // // //     const renderComments = () => {
// // // // // //       if (!inquiry.comments || inquiry.comments.length === 0) {
// // // // // //         return (
// // // // // //           <Typography variant="body2" sx={{ pl: 2, mb: 2, color: theme.palette.text.secondary }}>
// // // // // //             No comments yet.
// // // // // //           </Typography>
// // // // // //         );
// // // // // //       }
// // // // // //       return (
// // // // // //         <Box sx={{ pl: 2, mb: 2 }}>
// // // // // //           {inquiry.comments.map((comment) => (
// // // // // //             <Box key={comment.id} sx={{ mb: 1 }}>
// // // // // //               <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
// // // // // //                 "{comment.comment_text}"
// // // // // //               </Typography>
// // // // // //               {comment.company_response && (
// // // // // //                 <Typography variant="body2" sx={{ pl: 2, color: theme.palette.text.secondary }}>
// // // // // //                   Company Response: {comment.company_response}
// // // // // //                 </Typography>
// // // // // //               )}
// // // // // //               <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
// // // // // //                 Added on {formatDate(comment.created_at)}
// // // // // //               </Typography>
// // // // // //             </Box>
// // // // // //           ))}
// // // // // //         </Box>
// // // // // //       );
// // // // // //     };

// // // // // //     const data = inquiry.service_data || {};

// // // // // //     return (
// // // // // //       <Box sx={{ mt: 2 }}>
// // // // // //         <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>
// // // // // //           {inquiry.category || 'Unknown Category'} Details
// // // // // //         </Typography>
// // // // // //         {inquiry.category === 'Engineering Consulting' && (
// // // // // //           <>
// // // // // //             {renderField('Type of Building', data.type_of_building)}
// // // // // //             {renderField('Building Purpose', data.building_purpose)}
// // // // // //             {renderField('Number of Floors', data.num_floors)}
// // // // // //             {renderField('Land Area', data.land_area)}
// // // // // //             {renderField('Architectural Style', data.architectural_style)}
// // // // // //             {renderField('Other Architectural Style', data.architectural_style_other)}
// // // // // //             {renderField('Budget Estimate', data.budget_estimate)}
// // // // // //             {renderField('Special Requirements', data.special_requirements)}
// // // // // //             {renderFileField('Site Plan', data.site_plan)}
// // // // // //             {renderFileField('Architectural Plan', data.architectural_plan)}
// // // // // //             {renderFileField('Soil Test Report', data.soil_test_report)}
// // // // // //             {renderFileField('Foundation Design', data.foundation_design)}
// // // // // //             {renderFileField('Electrical Plan', data.electrical_plan)}
// // // // // //             {renderFileField('Plumbing Plan', data.plumbing_plan)}
// // // // // //             {renderFileField('HVAC Plan', data.hvac_plan)}
// // // // // //             {renderFileField('Construction Permit', data.construction_permit)}
// // // // // //             {renderFileField('Cost Estimation', data.cost_estimation)}
// // // // // //           </>
// // // // // //         )}
// // // // // //         {inquiry.category === 'Building Construction Services' && (
// // // // // //           <>
// // // // // //             {renderFileField('Lalpurja', data.lalpurja)}
// // // // // //             {renderFileField('Napi Naksa', data.napi_naksa)}
// // // // // //             {renderFileField('Tax Clearance', data.tax_clearance)}
// // // // // //             {renderFileField('Approved Building Drawings', data.approved_building_drawings)}
// // // // // //             {inquiry.sub_service === 'Residential Construction' && (
// // // // // //               <>
// // // // // //                 {renderFileField('Soil Test Report', data.soil_test_report)}
// // // // // //                 {renderFileField('Structural Stability Certificate', data.structural_stability_certificate)}
// // // // // //                 {renderFileField('House Design Approval', data.house_design_approval)}
// // // // // //                 {renderFileField('Neighbour Consent', data.neighbour_consent)}
// // // // // //                 {/* Progression Details */}
// // // // // //                 {renderField('Permit Application Date', data.permit_application_date)}
// // // // // //                 {renderField('Permit Status', data.permit_status)}
// // // // // //                 {renderFileField('Permit Document', data.permit_document)}
// // // // // //                 {renderField('Construction Start Date', data.construction_start_date)}
// // // // // //                 {renderField('Construction Phase', data.construction_phase)}
// // // // // //                 {renderField('Progress Percentage', data.progress_percentage ? `${data.progress_percentage}%` : null)}
// // // // // //                 {renderFileArrayField('Progress Photos', data.progress_photos)}
// // // // // //                 {renderField('Inspection Dates', data.inspection_dates && data.inspection_dates.length > 0 ? data.inspection_dates.join(', ') : null)}
// // // // // //                 {renderFileArrayField('Inspection Reports', data.inspection_reports)}
// // // // // //                 {renderField('Completion Certificate Application Date', data.completion_certificate_application_date)}
// // // // // //                 {renderFileField('Completion Certificate', data.completion_certificate)}
// // // // // //                 {renderField('Handover Date', data.handover_date)}
// // // // // //                 {renderField('Warranty Details', data.warranty_details)}
// // // // // //               </>
// // // // // //             )}
// // // // // //             {inquiry.sub_service === 'Commercial Construction' && (
// // // // // //               <>
// // // // // //                 {renderFileField('IEE Report', data.iee_report)}
// // // // // //                 {renderFileField('Fire Safety Certificate', data.fire_safety_certificate)}
// // // // // //                 {renderFileField('Lift Permit', data.lift_permit)}
// // // // // //                 {renderFileField('Parking Layout Plan', data.parking_layout_plan)}
// // // // // //                 {renderField('Special Requirements', data.commercial_special_requirements)}
// // // // // //               </>
// // // // // //             )}
// // // // // //             {inquiry.sub_service === 'Renovation and Remodeling Services' && (
// // // // // //               <>
// // // // // //                 {renderField('Type of Building', data.type_of_building)}
// // // // // //                 {renderField('Existing Building Details', data.existing_building_details)}
// // // // // //                 {renderField('Area to Renovate', data.area_to_renovate)}
// // // // // //                 {renderField('Budget Estimate', data.budget_estimate)}
// // // // // //                 {renderField('Special Requirements', data.renovation_special_requirements)}
// // // // // //                 {renderFileField('Owner Permission Letter', data.owner_permission_letter)}
// // // // // //                 {renderFileField('Existing Structure Analysis', data.existing_structure_analysis)}
// // // // // //                 {renderFileField('Renovation Plan', data.renovation_plan)}
// // // // // //                 {renderFileField('NOC from Municipality', data.noc_municipality)}
// // // // // //                 {renderFileField('Waste Management Plan', data.waste_management_plan)}
// // // // // //               </>
// // // // // //             )}
// // // // // //           </>
// // // // // //         )}
// // // // // //         {inquiry.category === 'Post-Construction Maintenance' && (
// // // // // //           <>
// // // // // //             {renderField('Maintenance Type', data.maintenance_type)}
// // // // // //             {renderField('Maintenance Details', data.maintenance_details)}
// // // // // //             {renderFileField('Maintenance Photos', data.maintenance_photos)}
// // // // // //             {renderField('Preferred Date', data.preferred_date)}
// // // // // //             {renderField('Preferred Time', data.preferred_time)}
// // // // // //             {renderField('Payment Agreed', data.payment_agreed ? 'Yes' : 'No')}
// // // // // //           </>
// // // // // //         )}
// // // // // //         {inquiry.category === 'Safety and Training Services' && (
// // // // // //           <>
// // // // // //             {renderField('Language Preference', data.language_preference)}
// // // // // //             {renderField('Other Language', data.language_preference_other)}
// // // // // //             {renderField('Training Date', data.training_date)}
// // // // // //             {renderField('Training Time', data.training_time)}
// // // // // //             {renderField('Training Agreement', data.training_agreement ? 'Yes' : 'No')}
// // // // // //             {inquiry.certificate && (
// // // // // //               <Box sx={{ mt: 2 }}>
// // // // // //                 <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 1 }}>
// // // // // //                   Certificate
// // // // // //                 </Typography>
// // // // // //                 {renderFileField('Your Certificate', inquiry.certificate)}
// // // // // //               </Box>
// // // // // //             )}
// // // // // //             {!inquiry.certificate && inquiry.status === 'Completed' && (
// // // // // //               <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 2 }}>
// // // // // //                 Certificate not yet uploaded by the company.
// // // // // //               </Typography>
// // // // // //             )}
// // // // // //           </>
// // // // // //         )}
// // // // // //         {!['Engineering Consulting', 'Building Construction Services', 'Post-Construction Maintenance', 'Safety and Training Services'].includes(inquiry.category) && (
// // // // // //           <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
// // // // // //             No additional details available for this category.
// // // // // //           </Typography>
// // // // // //         )}
// // // // // //         {/* Comments Section */}
// // // // // //         <Box sx={{ mt: 2 }}>
// // // // // //           <Typography variant="h6" sx={{ 
// // // // // //             color: theme.palette.primary.main,
// // // // // //             fontWeight: 'bold',
// // // // // //             mb: 2
// // // // // //           }}>
// // // // // //             Comments
// // // // // //           </Typography>
// // // // // //           {renderComments()}
// // // // // //           <Box sx={{ display: 'flex', gap: 2, pl: 2 }}>
// // // // // //             <TextField
// // // // // //               label="Add Comment"
// // // // // //               multiline
// // // // // //               rows={3}
// // // // // //               value={commentText}
// // // // // //               onChange={(e) => setCommentText(e.target.value)}
// // // // // //               fullWidth
// // // // // //               sx={{ maxWidth: 500 }}
// // // // // //             />
// // // // // //             <Button
// // // // // //               variant="contained"
// // // // // //               color="primary"
// // // // // //               onClick={() => handleAddComment(inquiry.id)}
// // // // // //               disabled={!commentText}
// // // // // //             >
// // // // // //               Submit Comment
// // // // // //             </Button>
// // // // // //           </Box>
// // // // // //           {commentStatus && (
// // // // // //             <Alert severity={commentStatus.type} sx={{ mt: 2, pl: 2 }}>
// // // // // //               {commentStatus.message}
// // // // // //             </Alert>
// // // // // //           )}
// // // // // //         </Box>
// // // // // //       </Box>
// // // // // //     );
// // // // // //   };

// // // // // //   return (
// // // // // //     <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
// // // // // //       {/* Add ClientNavbar at the top */}
// // // // // //       <ClientNavbar
// // // // // //         wishlist={[]} // Placeholder: Replace with actual wishlist data if available
// // // // // //         cartItems={[]} // Placeholder: Replace with actual cart data if available
// // // // // //         onNavigateToProfile={handleNavigateToProfile}
// // // // // //       />

// // // // // //       {/* Main content */}
// // // // // //       <Box sx={{ p: 2, flex: 1, mt: 8 }}>
// // // // // //         <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
// // // // // //           <Typography variant="h4" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: 'bold' }}>
// // // // // //             My Inquiries
// // // // // //           </Typography>

// // // // // //           {loading ? (
// // // // // //             <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
// // // // // //               <CircularProgress size={60} />
// // // // // //             </Box>
// // // // // //           ) : error ? (
// // // // // //             <Typography color="error" sx={{ p: 2, bgcolor: '#ffeeee', borderRadius: 2 }}>
// // // // // //               {error}
// // // // // //             </Typography>
// // // // // //           ) : inquiries.length === 0 ? (
// // // // // //             <Typography variant="h6" sx={{ p: 2, color: theme.palette.text.secondary }}>
// // // // // //               No inquiries found
// // // // // //             </Typography>
// // // // // //           ) : (
// // // // // //             <TableContainer component={Paper}>
// // // // // //               <Table sx={{ minWidth: 650 }} aria-label="inquiries table">
// // // // // //                 <TableHead>
// // // // // //                   <TableRow>
// // // // // //                     <TableCell>Full Name</TableCell>
// // // // // //                     <TableCell>Location</TableCell>
// // // // // //                     <TableCell>Category</TableCell>
// // // // // //                     <TableCell>Sub-Service</TableCell>
// // // // // //                     <TableCell>Status</TableCell>
// // // // // //                     <TableCell>Submitted At</TableCell>
// // // // // //                     <TableCell>Actions</TableCell>
// // // // // //                   </TableRow>
// // // // // //                 </TableHead>
// // // // // //                 <TableBody>
// // // // // //                   {inquiries.map((inquiry) => (
// // // // // //                     <TableRow key={inquiry.id}>
// // // // // //                       <TableCell>{inquiry.full_name || 'N/A'}</TableCell>
// // // // // //                       <TableCell>{inquiry.location || 'N/A'}</TableCell>
// // // // // //                       <TableCell>{inquiry.category || 'N/A'}</TableCell>
// // // // // //                       <TableCell>{inquiry.sub_service || 'N/A'}</TableCell>
// // // // // //                       <TableCell>{inquiry.status || 'N/A'}</TableCell>
// // // // // //                       <TableCell>{formatDate(inquiry.created_at)}</TableCell>
// // // // // //                       <TableCell>
// // // // // //                         <Button
// // // // // //                           variant="outlined"
// // // // // //                           color="primary"
// // // // // //                           onClick={() => handleViewDetails(inquiry)}
// // // // // //                           disabled={!inquiry.id}
// // // // // //                         >
// // // // // //                           View Details
// // // // // //                         </Button>
// // // // // //                       </TableCell>
// // // // // //                     </TableRow>
// // // // // //                   ))}
// // // // // //                 </TableBody>
// // // // // //               </Table>
// // // // // //             </TableContainer>
// // // // // //           )}
// // // // // //         </Paper>

// // // // // //         {/* Details Dialog */}
// // // // // //         <Dialog open={openDetails} onClose={handleCloseDetails} maxWidth="md" fullWidth>
// // // // // //           <DialogTitle>Inquiry Details</DialogTitle>
// // // // // //           <DialogContent>
// // // // // //             {selectedInquiry && (
// // // // // //               <Box sx={{ p: 2 }}>
// // // // // //                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
// // // // // //                   <PersonIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
// // // // // //                   <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
// // // // // //                     {selectedInquiry.full_name || 'N/A'}
// // // // // //                   </Typography>
// // // // // //                 </Box>
// // // // // //                 <Box sx={{ pl: 4 }}>
// // // // // //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// // // // // //                     <LocationOnIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// // // // // //                     {selectedInquiry.location || 'N/A'}
// // // // // //                   </Typography>
// // // // // //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// // // // // //                     <EmailIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// // // // // //                     {selectedInquiry.email || 'N/A'}
// // // // // //                   </Typography>
// // // // // //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// // // // // //                     <PhoneIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// // // // // //                     {selectedInquiry.phone_number || 'N/A'}
// // // // // //                   </Typography>
// // // // // //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// // // // // //                     <CategoryIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// // // // // //                     <strong>Category:</strong> {selectedInquiry.category || 'N/A'}
// // // // // //                   </Typography>
// // // // // //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// // // // // //                     <BuildIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// // // // // //                     <strong>Sub-Service:</strong> {selectedInquiry.sub_service || 'N/A'}
// // // // // //                   </Typography>
// // // // // //                   {renderDetails(selectedInquiry)}
// // // // // //                 </Box>
// // // // // //               </Box>
// // // // // //             )}
// // // // // //           </DialogContent>
// // // // // //         </Dialog>
// // // // // //       </Box>

// // // // // //       {/* Footer at the bottom */}
// // // // // //       <Footer />
// // // // // //     </Box>
// // // // // //   );
// // // // // // };

// // // // // // export default ClientServices;
// // // // // import React, { useState, useEffect } from 'react';
// // // // // import {
// // // // //   Box,
// // // // //   Paper,
// // // // //   Typography,
// // // // //   CircularProgress,
// // // // //   useTheme,
// // // // //   Table,
// // // // //   TableBody,
// // // // //   TableCell,
// // // // //   TableContainer,
// // // // //   TableHead,
// // // // //   TableRow,
// // // // //   Button,
// // // // //   Dialog,
// // // // //   DialogTitle,
// // // // //   DialogContent,
// // // // //   Link,
// // // // //   TextField,
// // // // //   Alert,
// // // // // } from '@mui/material';
// // // // // import {
// // // // //   Person as PersonIcon,
// // // // //   LocationOn as LocationOnIcon,
// // // // //   Email as EmailIcon,
// // // // //   Phone as PhoneIcon,
// // // // //   Category as CategoryIcon,
// // // // //   Build as BuildIcon,
// // // // //   Visibility as VisibilityIcon,
// // // // //   GetApp as DownloadIcon,
// // // // // } from '@mui/icons-material';
// // // // // import axios from 'axios';
// // // // // import Footer from "../pages/footer"; // Adjust path if needed
// // // // // import ClientNavbar from "../components/ClientNavbar"; // Import ClientNavbar (adjust path as needed)

// // // // // const ClientServices = () => {
// // // // //   const theme = useTheme();
// // // // //   const [inquiries, setInquiries] = useState([]);
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [error, setError] = useState('');
// // // // //   const [openDetails, setOpenDetails] = useState(false);
// // // // //   const [selectedInquiry, setSelectedInquiry] = useState(null);
// // // // //   const [commentText, setCommentText] = useState('');
// // // // //   const [commentStatus, setCommentStatus] = useState(null);

// // // // //   const backendBaseUrl = 'http://127.0.0.1:8000'; // Backend base URL

// // // // //   const fetchClientInquiries = async () => {
// // // // //     setLoading(true);
// // // // //     try {
// // // // //       const token = localStorage.getItem('access_token');
// // // // //       if (!token) {
// // // // //         throw new Error('No access token found. Please log in.');
// // // // //       }
// // // // //       const response = await axios.get(`${backendBaseUrl}/api/client-inquiries/`, {
// // // // //         headers: { Authorization: `Bearer ${token}` },
// // // // //       });
// // // // //       console.log('Fetched inquiries:', response.data); // Debug: Log all inquiries
      
// // // // //       const receivedInquiries = Array.isArray(response.data) ? response.data : [];
// // // // //       const sortedInquiries = [...receivedInquiries].sort((a, b) => 
// // // // //         new Date(b.created_at) - new Date(a.created_at)
// // // // //       );
      
// // // // //       setInquiries(sortedInquiries);
// // // // //     } catch (err) {
// // // // //       console.error('Error fetching inquiries:', err);
// // // // //       setError(err.message || 'Failed to load inquiries');
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     fetchClientInquiries();
// // // // //   }, []);

// // // // //   const formatDate = (dateString) => {
// // // // //     if (!dateString) return 'N/A';
// // // // //     try {
// // // // //       const options = {
// // // // //         year: 'numeric',
// // // // //         month: 'short',
// // // // //         day: '2-digit',
// // // // //         hour: '2-digit',
// // // // //         minute: '2-digit',
// // // // //         hour12: true,
// // // // //       };
// // // // //       return new Date(dateString).toLocaleString('en-US', options);
// // // // //     } catch (e) {
// // // // //       return 'Invalid Date';
// // // // //     }
// // // // //   };

// // // // //   const handleViewDetails = (inquiry) => {
// // // // //     console.log('Selected inquiry:', inquiry);
// // // // //     setSelectedInquiry(inquiry);
// // // // //     setOpenDetails(true);
// // // // //   };

// // // // //   const handleCloseDetails = () => {
// // // // //     setOpenDetails(false);
// // // // //     setSelectedInquiry(null);
// // // // //     setCommentText('');
// // // // //     setCommentStatus(null);
// // // // //   };

// // // // //   const handleAddComment = async (inquiryId) => {
// // // // //     if (!commentText) {
// // // // //       setCommentStatus({ type: 'error', message: 'Please enter a comment' });
// // // // //       return;
// // // // //     }

// // // // //     try {
// // // // //       const token = localStorage.getItem('access_token');
// // // // //       await axios.post(
// // // // //         `${backendBaseUrl}/api/add-comment/${inquiryId}/`,
// // // // //         { comment_text: commentText, company_response: '' },
// // // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // // //       );
// // // // //       setCommentStatus({ type: 'success', message: 'Comment added successfully!' });
// // // // //       setCommentText('');
// // // // //       fetchClientInquiries();
// // // // //     } catch (err) {
// // // // //       setCommentStatus({
// // // // //         type: 'error',
// // // // //         message: err.response?.data?.error || 'Failed to add comment',
// // // // //       });
// // // // //     }
// // // // //   };

// // // // //   const handleNavigateToProfile = () => {
// // // // //     window.location.href = "/client/profile"; // Replace with your profile route
// // // // //   };

// // // // //   const renderDetails = (inquiry) => {
// // // // //     if (!inquiry) return <Typography>No inquiry selected.</Typography>;

// // // // //     const renderField = (label, value) => (
// // // // //       value && (
// // // // //         <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
// // // // //           <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px' }}>
// // // // //             {label}:
// // // // //           </Typography>
// // // // //           <Typography variant="body2">{value}</Typography>
// // // // //         </Box>
// // // // //       )
// // // // //     );

// // // // //     const renderFileField = (label, fileUrl) => (
// // // // //       fileUrl && (
// // // // //         <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
// // // // //           <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px' }}>
// // // // //             {label}:
// // // // //           </Typography>
// // // // //           <Box sx={{ display: 'flex', gap: 1 }}>
// // // // //             <Link href={fileUrl} target="_blank" sx={{ color: theme.palette.secondary.main }}>
// // // // //               <VisibilityIcon sx={{ fontSize: 20, mr: 0.5 }} /> View
// // // // //             </Link>
// // // // //             <Link href={fileUrl} download sx={{ color: theme.palette.secondary.main }}>
// // // // //               <DownloadIcon sx={{ fontSize: 20, mr: 0.5 }} /> Download
// // // // //             </Link>
// // // // //           </Box>
// // // // //         </Box>
// // // // //       )
// // // // //     );

// // // // //     const renderFileArrayField = (label, files) => (
// // // // //       files && files.length > 0 && (
// // // // //         <Box sx={{ mb: 1 }}>
// // // // //           <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px', mb: 1 }}>
// // // // //             {label}:
// // // // //           </Typography>
// // // // //           {files.map((file, index) => (
// // // // //             <Box key={index} sx={{ display: 'flex', gap: 1, mb: 0.5, pl: 2 }}>
// // // // //               <Link href={file} target="_blank" sx={{ color: theme.palette.secondary.main }}>
// // // // //                 <VisibilityIcon sx={{ fontSize: 20, mr: 0.5 }} /> View {label} {index + 1}
// // // // //               </Link>
// // // // //               <Link href={file} download sx={{ color: theme.palette.secondary.main }}>
// // // // //                 <DownloadIcon sx={{ fontSize: 20, mr: 0.5 }} /> Download
// // // // //               </Link>
// // // // //             </Box>
// // // // //           ))}
// // // // //         </Box>
// // // // //       )
// // // // //     );

// // // // //     const renderComments = () => {
// // // // //       if (!inquiry.comments || inquiry.comments.length === 0) {
// // // // //         return (
// // // // //           <Typography variant="body2" sx={{ pl: 2, mb: 2, color: theme.palette.text.secondary }}>
// // // // //             No comments yet.
// // // // //           </Typography>
// // // // //         );
// // // // //       }
// // // // //       return (
// // // // //         <Box sx={{ pl: 2, mb: 2 }}>
// // // // //           {inquiry.comments.map((comment) => (
// // // // //             <Box key={comment.id} sx={{ mb: 1 }}>
// // // // //               <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
// // // // //                 "{comment.comment_text}"
// // // // //               </Typography>
// // // // //               {comment.company_response && (
// // // // //                 <Typography variant="body2" sx={{ pl: 2, color: theme.palette.text.secondary }}>
// // // // //                   Company Response: {comment.company_response}
// // // // //                 </Typography>
// // // // //               )}
// // // // //               <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
// // // // //                 Added on {formatDate(comment.created_at)}
// // // // //               </Typography>
// // // // //             </Box>
// // // // //           ))}
// // // // //         </Box>
// // // // //       );
// // // // //     };

// // // // //     const data = inquiry.service_data || {};

// // // // //     return (
// // // // //       <Box sx={{ mt: 2 }}>
// // // // //         <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>
// // // // //           {inquiry.category || 'Unknown Category'} Details
// // // // //         </Typography>
// // // // //         {inquiry.category === 'Engineering Consulting' && (
// // // // //           <>
// // // // //             {renderField('Type of Building', data.type_of_building)}
// // // // //             {renderField('Building Purpose', data.building_purpose)}
// // // // //             {renderField('Number of Floors', data.num_floors)}
// // // // //             {renderField('Land Area', data.land_area)}
// // // // //             {renderField('Architectural Style', data.architectural_style)}
// // // // //             {renderField('Other Architectural Style', data.architectural_style_other)}
// // // // //             {renderField('Budget Estimate', data.budget_estimate)}
// // // // //             {renderField('Special Requirements', data.special_requirements)}
// // // // //             {renderFileField('Site Plan', data.site_plan)}
// // // // //             {renderFileField('Architectural Plan', data.architectural_plan)}
// // // // //             {renderFileField('Soil Test Report', data.soil_test_report)}
// // // // //             {renderFileField('Foundation Design', data.foundation_design)}
// // // // //             {renderFileField('Electrical Plan', data.electrical_plan)}
// // // // //             {renderFileField('Plumbing Plan', data.plumbing_plan)}
// // // // //             {renderFileField('HVAC Plan', data.hvac_plan)}
// // // // //             {renderFileField('Construction Permit', data.construction_permit)}
// // // // //             {renderFileField('Cost Estimation', data.cost_estimation)}
// // // // //           </>
// // // // //         )}
// // // // //         {inquiry.category === 'Building Construction Services' && (
// // // // //           <>
// // // // //             {renderFileField('Lalpurja', data.lalpurja)}
// // // // //             {renderFileField('Napi Naksa', data.napi_naksa)}
// // // // //             {renderFileField('Tax Clearance', data.tax_clearance)}
// // // // //             {renderFileField('Approved Building Drawings', data.approved_building_drawings)}
// // // // //             {inquiry.sub_service === 'Residential Construction' && (
// // // // //               <>
// // // // //                 {renderFileField('Soil Test Report', data.soil_test_report)}
// // // // //                 {renderFileField('Structural Stability Certificate', data.structural_stability_certificate)}
// // // // //                 {renderFileField('House Design Approval', data.house_design_approval)}
// // // // //                 {renderFileField('Neighbour Consent', data.neighbour_consent)}
// // // // //                 {/* Progression Details */}
// // // // //                 {renderField('Permit Application Date', data.permit_application_date)}
// // // // //                 {renderField('Permit Status', data.permit_status)}
// // // // //                 {renderFileField('Permit Document', data.permit_document)}
// // // // //                 {renderField('Construction Start Date', data.construction_start_date)}
// // // // //                 {renderField('Construction Phase', data.construction_phase)}
// // // // //                 {renderField('Progress Percentage', data.progress_percentage ? `${data.progress_percentage}%` : null)}
// // // // //                 {renderFileArrayField('Progress Photos', data.progress_photos)}
// // // // //                 {renderField('Inspection Dates', data.inspection_dates && data.inspection_dates.length > 0 ? data.inspection_dates.join(', ') : null)}
// // // // //                 {renderFileArrayField('Inspection Reports', data.inspection_reports)}
// // // // //                 {renderField('Completion Certificate Application Date', data.completion_certificate_application_date)}
// // // // //                 {renderFileField('Completion Certificate', data.completion_certificate)}
// // // // //                 {renderField('Handover Date', data.handover_date)}
// // // // //                 {renderField('Warranty Details', data.warranty_details)}
// // // // //               </>
// // // // //             )}
// // // // //             {inquiry.sub_service === 'Commercial Construction' && (
// // // // //               <>
// // // // //                 {renderFileField('IEE Report', data.iee_report)}
// // // // //                 {renderFileField('Fire Safety Certificate', data.fire_safety_certificate)}
// // // // //                 {renderFileField('Lift Permit', data.lift_permit)}
// // // // //                 {renderFileField('Parking Layout Plan', data.parking_layout_plan)}
// // // // //                 {renderField('Special Requirements', data.commercial_special_requirements)}
// // // // //               </>
// // // // //             )}
// // // // //             {inquiry.sub_service === 'Renovation and Remodeling Services' && (
// // // // //               <>
// // // // //                 {renderField('Type of Building', data.type_of_building)}
// // // // //                 {renderField('Existing Building Details', data.existing_building_details)}
// // // // //                 {renderField('Area to Renovate', data.area_to_renovate)}
// // // // //                 {renderField('Budget Estimate', data.budget_estimate)}
// // // // //                 {renderField('Special Requirements', data.renovation_special_requirements)}
// // // // //                 {renderFileField('Owner Permission Letter', data.owner_permission_letter)}
// // // // //                 {renderFileField('Existing Structure Analysis', data.existing_structure_analysis)}
// // // // //                 {renderFileField('Renovation Plan', data.renovation_plan)}
// // // // //                 {renderFileField('NOC from Municipality', data.noc_municipality)}
// // // // //                 {renderFileField('Waste Management Plan', data.waste_management_plan)}
// // // // //               </>
// // // // //             )}
// // // // //           </>
// // // // //         )}
// // // // //         {inquiry.category === 'Post-Construction Maintenance' && (
// // // // //           <>
// // // // //             {renderField('Maintenance Type', data.maintenance_type)}
// // // // //             {renderField('Maintenance Details', data.maintenance_details)}
// // // // //             {renderFileField('Maintenance Photos', data.maintenance_photos)}
// // // // //             {renderField('Preferred Date', data.preferred_date)}
// // // // //             {renderField('Preferred Time', data.preferred_time)}
// // // // //             {renderField('Payment Agreed', data.payment_agreed ? 'Yes' : 'No')}
// // // // //           </>
// // // // //         )}
// // // // //         {inquiry.category === 'Safety and Training Services' && (
// // // // //           <>
// // // // //             {renderField('Language Preference', data.language_preference)}
// // // // //             {renderField('Other Language', data.language_preference_other)}
// // // // //             {renderField('Training Date', data.training_date)}
// // // // //             {renderField('Training Time', data.training_time)}
// // // // //             {renderField('Training Agreement', data.training_agreement ? 'Yes' : 'No')}
// // // // //             {inquiry.certificate && (
// // // // //               <Box sx={{ mt: 2 }}>
// // // // //                 <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 1 }}>
// // // // //                   Certificate
// // // // //                 </Typography>
// // // // //                 {renderFileField('Your Certificate', inquiry.certificate)}
// // // // //               </Box>
// // // // //             )}
// // // // //             {!inquiry.certificate && inquiry.status === 'Completed' && (
// // // // //               <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 2 }}>
// // // // //                 Certificate not yet uploaded by the company.
// // // // //               </Typography>
// // // // //             )}
// // // // //           </>
// // // // //         )}
// // // // //         {!['Engineering Consulting', 'Building Construction Services', 'Post-Construction Maintenance', 'Safety and Training Services'].includes(inquiry.category) && (
// // // // //           <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
// // // // //             No additional details available for this category.
// // // // //           </Typography>
// // // // //         )}
// // // // //         {/* Comments Section */}
// // // // //         <Box sx={{ mt: 2 }}>
// // // // //           <Typography variant="h6" sx={{ 
// // // // //             color: theme.palette.primary.main,
// // // // //             fontWeight: 'bold',
// // // // //             mb: 2
// // // // //           }}>
// // // // //             Comments
// // // // //           </Typography>
// // // // //           {renderComments()}
// // // // //           <Box sx={{ display: 'flex', gap: 2, pl: 2 }}>
// // // // //             <TextField
// // // // //               label="Add Comment"
// // // // //               multiline
// // // // //               rows={3}
// // // // //               value={commentText}
// // // // //               onChange={(e) => setCommentText(e.target.value)}
// // // // //               fullWidth
// // // // //               sx={{ maxWidth: 500 }}
// // // // //             />
// // // // //             <Button
// // // // //               variant="contained"
// // // // //               color="primary"
// // // // //               onClick={() => handleAddComment(inquiry.id)}
// // // // //               disabled={!commentText}
// // // // //             >
// // // // //               Submit Comment
// // // // //             </Button>
// // // // //           </Box>
// // // // //           {commentStatus && (
// // // // //             <Alert severity={commentStatus.type} sx={{ mt: 2, pl: 2 }}>
// // // // //               {commentStatus.message}
// // // // //             </Alert>
// // // // //           )}
// // // // //         </Box>
// // // // //       </Box>
// // // // //     );
// // // // //   };

// // // // //   return (
// // // // //     <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
// // // // //       {/* Add ClientNavbar at the top */}
// // // // //       <ClientNavbar
// // // // //         wishlist={[]} // Placeholder: Replace with actual wishlist data if available
// // // // //         cartItems={[]} // Placeholder: Replace with actual cart data if available
// // // // //         onNavigateToProfile={handleNavigateToProfile}
// // // // //       />

// // // // //       {/* Main content */}
// // // // //       <Box sx={{ p: 2, flex: 1, mt: 8 }}>
// // // // //         <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
// // // // //           <Typography variant="h4" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: 'bold' }}>
// // // // //             My Inquiries
// // // // //           </Typography>

// // // // //           {loading ? (
// // // // //             <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
// // // // //               <CircularProgress size={60} />
// // // // //             </Box>
// // // // //           ) : error ? (
// // // // //             <Typography color="error" sx={{ p: 2, bgcolor: '#ffeeee', borderRadius: 2 }}>
// // // // //               {error}
// // // // //             </Typography>
// // // // //           ) : inquiries.length === 0 ? (
// // // // //             <Typography variant="h6" sx={{ p: 2, color: theme.palette.text.secondary }}>
// // // // //               No inquiries found
// // // // //             </Typography>
// // // // //           ) : (
// // // // //             <TableContainer component={Paper}>
// // // // //               <Table sx={{ minWidth: 650 }} aria-label="inquiries table">
// // // // //                 <TableHead>
// // // // //                   <TableRow>
// // // // //                     <TableCell>Full Name</TableCell>
// // // // //                     <TableCell>Location</TableCell>
// // // // //                     <TableCell>Category</TableCell>
// // // // //                     <TableCell>Sub-Service</TableCell>
// // // // //                     <TableCell>Status</TableCell>
// // // // //                     <TableCell>Submitted At</TableCell>
// // // // //                     <TableCell>Actions</TableCell>
// // // // //                   </TableRow>
// // // // //                 </TableHead>
// // // // //                 <TableBody>
// // // // //                   {inquiries.map((inquiry) => (
// // // // //                     <TableRow key={inquiry.id}>
// // // // //                       <TableCell>{inquiry.full_name || 'N/A'}</TableCell>
// // // // //                       <TableCell>{inquiry.location || 'N/A'}</TableCell>
// // // // //                       <TableCell>{inquiry.category || 'N/A'}</TableCell>
// // // // //                       <TableCell>{inquiry.sub_service || 'N/A'}</TableCell>
// // // // //                       <TableCell>{inquiry.status || 'N/A'}</TableCell>
// // // // //                       <TableCell>{formatDate(inquiry.created_at)}</TableCell>
// // // // //                       <TableCell>
// // // // //                         <Button
// // // // //                           variant="outlined"
// // // // //                           color="primary"
// // // // //                           onClick={() => handleViewDetails(inquiry)}
// // // // //                           disabled={!inquiry.id}
// // // // //                         >
// // // // //                           View Details
// // // // //                         </Button>
// // // // //                       </TableCell>
// // // // //                     </TableRow>
// // // // //                   ))}
// // // // //                 </TableBody>
// // // // //               </Table>
// // // // //             </TableContainer>
// // // // //           )}
// // // // //         </Paper>

// // // // //         {/* Details Dialog */}
// // // // //         <Dialog open={openDetails} onClose={handleCloseDetails} maxWidth="md" fullWidth>
// // // // //           <DialogTitle>Inquiry Details</DialogTitle>
// // // // //           <DialogContent>
// // // // //             {selectedInquiry && (
// // // // //               <Box sx={{ p: 2 }}>
// // // // //                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
// // // // //                   <PersonIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
// // // // //                   <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
// // // // //                     {selectedInquiry.full_name || 'N/A'}
// // // // //                   </Typography>
// // // // //                 </Box>
// // // // //                 <Box sx={{ pl: 4 }}>
// // // // //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// // // // //                     <LocationOnIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// // // // //                     {selectedInquiry.location || 'N/A'}
// // // // //                   </Typography>
// // // // //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// // // // //                     <EmailIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// // // // //                     {selectedInquiry.email || 'N/A'}
// // // // //                   </Typography>
// // // // //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// // // // //                     <PhoneIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// // // // //                     {selectedInquiry.phone_number || 'N/A'}
// // // // //                   </Typography>
// // // // //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// // // // //                     <CategoryIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// // // // //                     <strong>Category:</strong> {selectedInquiry.category || 'N/A'}
// // // // //                   </Typography>
// // // // //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// // // // //                     <BuildIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// // // // //                     <strong>Sub-Service:</strong> {selectedInquiry.sub_service || 'N/A'}
// // // // //                   </Typography>
// // // // //                   {renderDetails(selectedInquiry)}
// // // // //                 </Box>
// // // // //               </Box>
// // // // //             )}
// // // // //           </DialogContent>
// // // // //         </Dialog>
// // // // //       </Box>

// // // // //       {/* Footer at the bottom */}
// // // // //       <Footer />
// // // // //     </Box>
// // // // //   );
// // // // // };

// // // // // export default ClientServices;
// // // // import React, { useState, useEffect } from 'react';
// // // // import {
// // // //   Box,
// // // //   Paper,
// // // //   Typography,
// // // //   CircularProgress,
// // // //   useTheme,
// // // //   Table,
// // // //   TableBody,
// // // //   TableCell,
// // // //   TableContainer,
// // // //   TableHead,
// // // //   TableRow,
// // // //   Button,
// // // //   Dialog,
// // // //   DialogTitle,
// // // //   DialogContent,
// // // //   Link,
// // // //   TextField,
// // // //   Alert,
// // // // } from '@mui/material';
// // // // import {
// // // //   Person as PersonIcon,
// // // //   LocationOn as LocationOnIcon,
// // // //   Email as EmailIcon,
// // // //   Phone as PhoneIcon,
// // // //   Category as CategoryIcon,
// // // //   Build as BuildIcon,
// // // //   Visibility as VisibilityIcon,
// // // //   GetApp as DownloadIcon,
// // // // } from '@mui/icons-material';
// // // // import axios from 'axios';
// // // // import Footer from "../pages/footer"; // Adjust path if needed
// // // // import ClientNavbar from "../components/ClientNavbar"; // Import ClientNavbar (adjust path as needed)

// // // // const ClientServices = () => {
// // // //   const theme = useTheme();
// // // //   const [inquiries, setInquiries] = useState([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [error, setError] = useState('');
// // // //   const [openDetails, setOpenDetails] = useState(false);
// // // //   const [selectedInquiry, setSelectedInquiry] = useState(null);
// // // //   const [commentText, setCommentText] = useState('');
// // // //   const [commentStatus, setCommentStatus] = useState(null);

// // // //   const backendBaseUrl = 'http://127.0.0.1:8000'; // Backend base URL

// // // //   const fetchClientInquiries = async () => {
// // // //     setLoading(true);
// // // //     try {
// // // //       const token = localStorage.getItem('access_token');
// // // //       if (!token) {
// // // //         throw new Error('No access token found. Please log in.');
// // // //       }
// // // //       const response = await axios.get(`${backendBaseUrl}/api/client-inquiries/`, {
// // // //         headers: { Authorization: `Bearer ${token}` },
// // // //       });
// // // //       console.log('Fetched inquiries:', response.data); // Debug: Log all inquiries
      
// // // //       const receivedInquiries = Array.isArray(response.data) ? response.data : [];
// // // //       const sortedInquiries = [...receivedInquiries].sort((a, b) => 
// // // //         new Date(b.created_at) - new Date(a.created_at)
// // // //       );
      
// // // //       setInquiries(sortedInquiries);
// // // //     } catch (err) {
// // // //       console.error('Error fetching inquiries:', err);
// // // //       setError(err.message || 'Failed to load inquiries');
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     fetchClientInquiries();
// // // //   }, []);

// // // //   const formatDate = (dateString) => {
// // // //     if (!dateString) return 'N/A';
// // // //     try {
// // // //       const options = {
// // // //         year: 'numeric',
// // // //         month: 'short',
// // // //         day: '2-digit',
// // // //         hour: '2-digit',
// // // //         minute: '2-digit',
// // // //         hour12: true,
// // // //       };
// // // //       return new Date(dateString).toLocaleString('en-US', options);
// // // //     } catch (e) {
// // // //       return 'Invalid Date';
// // // //     }
// // // //   };

// // // //   const handleViewDetails = (inquiry) => {
// // // //     console.log('Selected inquiry:', inquiry);
// // // //     setSelectedInquiry(inquiry);
// // // //     setOpenDetails(true);
// // // //   };

// // // //   const handleCloseDetails = () => {
// // // //     setOpenDetails(false);
// // // //     setSelectedInquiry(null);
// // // //     setCommentText('');
// // // //     setCommentStatus(null);
// // // //   };

// // // //   const handleAddComment = async (inquiryId) => {
// // // //     if (!commentText) {
// // // //       setCommentStatus({ type: 'error', message: 'Please enter a comment' });
// // // //       return;
// // // //     }

// // // //     try {
// // // //       const token = localStorage.getItem('access_token');
// // // //       const response = await axios.post(
// // // //         `${backendBaseUrl}/api/add-comment/${inquiryId}/`,
// // // //         { comment_text: commentText, company_response: '' },
// // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // //       );
// // // //       setCommentStatus({ type: 'success', message: response.data.message || 'Comment added successfully!' });
// // // //       setCommentText('');
// // // //       fetchClientInquiries();
// // // //     } catch (err) {
// // // //       setCommentStatus({
// // // //         type: 'error',
// // // //         message: err.response?.data?.error || 'Failed to add comment',
// // // //       });
// // // //     }
// // // //   };

// // // //   const handleNavigateToProfile = () => {
// // // //     window.location.href = "/client/profile"; // Replace with your profile route
// // // //   };

// // // //   const renderDetails = (inquiry) => {
// // // //     if (!inquiry) return <Typography>No inquiry selected.</Typography>;

// // // //     const renderField = (label, value) => (
// // // //       value && (
// // // //         <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
// // // //           <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px' }}>
// // // //             {label}:
// // // //           </Typography>
// // // //           <Typography variant="body2">{value}</Typography>
// // // //         </Box>
// // // //       )
// // // //     );

// // // //     const renderFileField = (label, fileUrl) => (
// // // //       fileUrl && (
// // // //         <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
// // // //           <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px' }}>
// // // //             {label}:
// // // //           </Typography>
// // // //           <Box sx={{ display: 'flex', gap: 1 }}>
// // // //             <Link href={fileUrl} target="_blank" sx={{ color: theme.palette.secondary.main }}>
// // // //               <VisibilityIcon sx={{ fontSize: 20, mr: 0.5 }} /> View
// // // //             </Link>
// // // //             <Link href={fileUrl} download sx={{ color: theme.palette.secondary.main }}>
// // // //               <DownloadIcon sx={{ fontSize: 20, mr: 0.5 }} /> Download
// // // //             </Link>
// // // //           </Box>
// // // //         </Box>
// // // //       )
// // // //     );

// // // //     const renderFileArrayField = (label, files) => (
// // // //       files && files.length > 0 && (
// // // //         <Box sx={{ mb: 1 }}>
// // // //           <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px', mb: 1 }}>
// // // //             {label}:
// // // //           </Typography>
// // // //           {files.map((file, index) => (
// // // //             <Box key={index} sx={{ display: 'flex', gap: 1, mb: 0.5, pl: 2 }}>
// // // //               <Link href={file} target="_blank" sx={{ color: theme.palette.secondary.main }}>
// // // //                 <VisibilityIcon sx={{ fontSize: 20, mr: 0.5 }} /> View {label} {index + 1}
// // // //               </Link>
// // // //               <Link href={file} download sx={{ color: theme.palette.secondary.main }}>
// // // //                 <DownloadIcon sx={{ fontSize: 20, mr: 0.5 }} /> Download
// // // //               </Link>
// // // //             </Box>
// // // //           ))}
// // // //         </Box>
// // // //       )
// // // //     );

// // // //     const renderComments = () => {
// // // //       if (!inquiry.comments || inquiry.comments.length === 0) {
// // // //         return (
// // // //           <Typography variant="body2" sx={{ pl: 2, mb: 2, color: theme.palette.text.secondary }}>
// // // //             No comments yet.
// // // //           </Typography>
// // // //         );
// // // //       }
// // // //       return (
// // // //         <Box sx={{ pl: 2, mb: 2 }}>
// // // //           {inquiry.comments.map((comment) => (
// // // //             <Box key={comment.id} sx={{ mb: 1 }}>
// // // //               <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
// // // //                 "{comment.comment_text}"
// // // //               </Typography>
// // // //               {comment.company_response && (
// // // //                 <Typography variant="body2" sx={{ pl: 2, color: theme.palette.text.secondary }}>
// // // //                   Company Response: {comment.company_response}
// // // //                 </Typography>
// // // //               )}
// // // //               <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
// // // //                 Added on {formatDate(comment.created_at)}
// // // //               </Typography>
// // // //             </Box>
// // // //           ))}
// // // //         </Box>
// // // //       );
// // // //     };

// // // //     const data = inquiry.service_data || {};

// // // //     return (
// // // //       <Box sx={{ mt: 2 }}>
// // // //         <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>
// // // //           {inquiry.category || 'Unknown Category'} Details
// // // //         </Typography>
// // // //         {inquiry.category === 'Engineering Consulting' && (
// // // //           <>
// // // //             {renderField('Type of Building', data.type_of_building)}
// // // //             {renderField('Building Purpose', data.building_purpose)}
// // // //             {renderField('Number of Floors', data.num_floors)}
// // // //             {renderField('Land Area', data.land_area)}
// // // //             {renderField('Architectural Style', data.architectural_style)}
// // // //             {renderField('Other Architectural Style', data.architectural_style_other)}
// // // //             {renderField('Budget Estimate', data.budget_estimate)}
// // // //             {renderField('Special Requirements', data.special_requirements)}
// // // //             {renderFileField('Site Plan', data.site_plan)}
// // // //             {renderFileField('Architectural Plan', data.architectural_plan)}
// // // //             {renderFileField('Soil Test Report', data.soil_test_report)}
// // // //             {renderFileField('Foundation Design', data.foundation_design)}
// // // //             {renderFileField('Electrical Plan', data.electrical_plan)}
// // // //             {renderFileField('Plumbing Plan', data.plumbing_plan)}
// // // //             {renderFileField('HVAC Plan', data.hvac_plan)}
// // // //             {renderFileField('Construction Permit', data.construction_permit)}
// // // //             {renderFileField('Cost Estimation', data.cost_estimation)}
// // // //           </>
// // // //         )}
// // // //         {inquiry.category === 'Building Construction Services' && (
// // // //           <>
// // // //             {renderFileField('Lalpurja', data.lalpurja)}
// // // //             {renderFileField('Napi Naksa', data.napi_naksa)}
// // // //             {renderFileField('Tax Clearance', data.tax_clearance)}
// // // //             {renderFileField('Approved Building Drawings', data.approved_building_drawings)}
// // // //             {inquiry.sub_service === 'Residential Construction' && (
// // // //               <>
// // // //                 {renderFileField('Soil Test Report', data.soil_test_report)}
// // // //                 {renderFileField('Structural Stability Certificate', data.structural_stability_certificate)}
// // // //                 {renderFileField('House Design Approval', data.house_design_approval)}
// // // //                 {renderFileField('Neighbour Consent', data.neighbour_consent)}
// // // //                 {/* Progression Details */}
// // // //                 {renderField('Permit Application Date', data.permit_application_date)}
// // // //                 {renderField('Permit Status', data.permit_status)}
// // // //                 {renderFileField('Permit Document', data.permit_document)}
// // // //                 {renderField('Construction Start Date', data.construction_start_date)}
// // // //                 {renderField('Construction Phase', data.construction_phase)}
// // // //                 {renderField('Progress Percentage', data.progress_percentage ? `${data.progress_percentage}%` : null)}
// // // //                 {renderFileArrayField('Progress Photos', data.progress_photos)}
// // // //                 {renderField('Inspection Dates', data.inspection_dates && data.inspection_dates.length > 0 ? data.inspection_dates.join(', ') : null)}
// // // //                 {renderFileArrayField('Inspection Reports', data.inspection_reports)}
// // // //                 {renderField('Completion Certificate Application Date', data.completion_certificate_application_date)}
// // // //                 {renderFileField('Completion Certificate', data.completion_certificate)}
// // // //                 {renderField('Handover Date', data.handover_date)}
// // // //                 {renderField('Warranty Details', data.warranty_details)}
// // // //               </>
// // // //             )}
// // // //             {inquiry.sub_service === 'Commercial Construction' && (
// // // //               <>
// // // //                 {renderFileField('IEE Report', data.iee_report)}
// // // //                 {renderFileField('Fire Safety Certificate', data.fire_safety_certificate)}
// // // //                 {renderFileField('Lift Permit', data.lift_permit)}
// // // //                 {renderFileField('Parking Layout Plan', data.parking_layout_plan)}
// // // //                 {renderField('Special Requirements', data.commercial_special_requirements)}
// // // //               </>
// // // //             )}
// // // //             {inquiry.sub_service === 'Renovation and Remodeling Services' && (
// // // //               <>
// // // //                 {renderField('Type of Building', data.type_of_building)}
// // // //                 {renderField('Existing Building Details', data.existing_building_details)}
// // // //                 {renderField('Area to Renovate', data.area_to_renovate)}
// // // //                 {renderField('Budget Estimate', data.budget_estimate)}
// // // //                 {renderField('Special Requirements', data.renovation_special_requirements)}
// // // //                 {renderFileField('Owner Permission Letter', data.owner_permission_letter)}
// // // //                 {renderFileField('Existing Structure Analysis', data.existing_structure_analysis)}
// // // //                 {renderFileField('Renovation Plan', data.renovation_plan)}
// // // //                 {renderFileField('NOC from Municipality', data.noc_municipality)}
// // // //                 {renderFileField('Waste Management Plan', data.waste_management_plan)}
// // // //               </>
// // // //             )}
// // // //           </>
// // // //         )}
// // // //         {inquiry.category === 'Post-Construction Maintenance' && (
// // // //           <>
// // // //             {renderField('Maintenance Type', data.maintenance_type)}
// // // //             {renderField('Maintenance Details', data.maintenance_details)}
// // // //             {renderFileField('Maintenance Photos', data.maintenance_photos)}
// // // //             {renderField('Preferred Date', data.preferred_date)}
// // // //             {renderField('Preferred Time', data.preferred_time)}
// // // //             {renderField('Payment Agreed', data.payment_agreed ? 'Yes' : 'No')}
// // // //           </>
// // // //         )}
// // // //         {inquiry.category === 'Safety and Training Services' && (
// // // //           <>
// // // //             {renderField('Language Preference', data.language_preference)}
// // // //             {renderField('Other Language', data.language_preference_other)}
// // // //             {renderField('Training Date', data.training_date)}
// // // //             {renderField('Training Time', data.training_time)}
// // // //             {renderField('Training Agreement', data.training_agreement ? 'Yes' : 'No')}
// // // //             {inquiry.certificate && (
// // // //               <Box sx={{ mt: 2 }}>
// // // //                 <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 1 }}>
// // // //                   Certificate
// // // //                 </Typography>
// // // //                 {renderFileField('Your Certificate', inquiry.certificate)}
// // // //               </Box>
// // // //             )}
// // // //             {!inquiry.certificate && inquiry.status === 'Completed' && (
// // // //               <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 2 }}>
// // // //                 Certificate not yet uploaded by the company.
// // // //               </Typography>
// // // //             )}
// // // //           </>
// // // //         )}
// // // //         {!['Engineering Consulting', 'Building Construction Services', 'Post-Construction Maintenance', 'Safety and Training Services'].includes(inquiry.category) && (
// // // //           <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
// // // //             No additional details available for this category.
// // // //           </Typography>
// // // //         )}
// // // //         {/* Comments Section */}
// // // //         <Box sx={{ mt: 2 }}>
// // // //           <Typography variant="h6" sx={{ 
// // // //             color: theme.palette.primary.main,
// // // //             fontWeight: 'bold',
// // // //             mb: 2
// // // //           }}>
// // // //             Comments
// // // //           </Typography>
// // // //           {renderComments()}
// // // //           <Box sx={{ display: 'flex', gap: 2, pl: 2 }}>
// // // //             <TextField
// // // //               label="Add Comment"
// // // //               multiline
// // // //               rows={3}
// // // //               value={commentText}
// // // //               onChange={(e) => setCommentText(e.target.value)}
// // // //               fullWidth
// // // //               sx={{ maxWidth: 500 }}
// // // //             />
// // // //             <Button
// // // //               variant="contained"
// // // //               color="primary"
// // // //               onClick={() => handleAddComment(inquiry.id)}
// // // //               disabled={!commentText}
// // // //             >
// // // //               Submit Comment
// // // //             </Button>
// // // //           </Box>
// // // //           {commentStatus && (
// // // //             <Alert severity={commentStatus.type} sx={{ mt: 2, pl: 2 }}>
// // // //               {commentStatus.message}
// // // //             </Alert>
// // // //           )}
// // // //         </Box>
// // // //       </Box>
// // // //     );
// // // //   };

// // // //   return (
// // // //     <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
// // // //       {/* Add ClientNavbar at the top */}
// // // //       <ClientNavbar
// // // //         wishlist={[]} // Placeholder: Replace with actual wishlist data if available
// // // //         cartItems={[]} // Placeholder: Replace with actual cart data if available
// // // //         onNavigateToProfile={handleNavigateToProfile}
// // // //       />

// // // //       {/* Main content */}
// // // //       <Box sx={{ p: 2, flex: 1, mt: 8 }}>
// // // //         <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
// // // //           <Typography variant="h4" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: 'bold' }}>
// // // //             My Inquiries
// // // //           </Typography>

// // // //           {loading ? (
// // // //             <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
// // // //               <CircularProgress size={60} />
// // // //             </Box>
// // // //           ) : error ? (
// // // //             <Typography color="error" sx={{ p: 2, bgcolor: '#ffeeee', borderRadius: 2 }}>
// // // //               {error}
// // // //             </Typography>
// // // //           ) : inquiries.length === 0 ? (
// // // //             <Typography variant="h6" sx={{ p: 2, color: theme.palette.text.secondary }}>
// // // //               No inquiries found
// // // //             </Typography>
// // // //           ) : (
// // // //             <TableContainer component={Paper}>
// // // //               <Table sx={{ minWidth: 650 }} aria-label="inquiries table">
// // // //                 <TableHead>
// // // //                   <TableRow>
// // // //                     <TableCell>Full Name</TableCell>
// // // //                     <TableCell>Location</TableCell>
// // // //                     <TableCell>Category</TableCell>
// // // //                     <TableCell>Sub-Service</TableCell>
// // // //                     <TableCell>Status</TableCell>
// // // //                     <TableCell>Submitted At</TableCell>
// // // //                     <TableCell>Actions</TableCell>
// // // //                   </TableRow>
// // // //                 </TableHead>
// // // //                 <TableBody>
// // // //                   {inquiries.map((inquiry) => (
// // // //                     <TableRow key={inquiry.id}>
// // // //                       <TableCell>{inquiry.full_name || 'N/A'}</TableCell>
// // // //                       <TableCell>{inquiry.location || 'N/A'}</TableCell>
// // // //                       <TableCell>{inquiry.category || 'N/A'}</TableCell>
// // // //                       <TableCell>{inquiry.sub_service || 'N/A'}</TableCell>
// // // //                       <TableCell>{inquiry.status || 'N/A'}</TableCell>
// // // //                       <TableCell>{formatDate(inquiry.created_at)}</TableCell>
// // // //                       <TableCell>
// // // //                         <Button
// // // //                           variant="outlined"
// // // //                           color="primary"
// // // //                           onClick={() => handleViewDetails(inquiry)}
// // // //                           disabled={!inquiry.id}
// // // //                         >
// // // //                           View Details
// // // //                         </Button>
// // // //                       </TableCell>
// // // //                     </TableRow>
// // // //                   ))}
// // // //                 </TableBody>
// // // //               </Table>
// // // //             </TableContainer>
// // // //           )}
// // // //         </Paper>

// // // //         {/* Details Dialog */}
// // // //         <Dialog open={openDetails} onClose={handleCloseDetails} maxWidth="md" fullWidth>
// // // //           <DialogTitle>Inquiry Details</DialogTitle>
// // // //           <DialogContent>
// // // //             {selectedInquiry && (
// // // //               <Box sx={{ p: 2 }}>
// // // //                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
// // // //                   <PersonIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
// // // //                   <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
// // // //                     {selectedInquiry.full_name || 'N/A'}
// // // //                   </Typography>
// // // //                 </Box>
// // // //                 <Box sx={{ pl: 4 }}>
// // // //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// // // //                     <LocationOnIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// // // //                     {selectedInquiry.location || 'N/A'}
// // // //                   </Typography>
// // // //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// // // //                     <EmailIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// // // //                     {selectedInquiry.email || 'N/A'}
// // // //                   </Typography>
// // // //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// // // //                     <PhoneIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// // // //                     {selectedInquiry.phone_number || 'N/A'}
// // // //                   </Typography>
// // // //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// // // //                     <CategoryIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// // // //                     <strong>Category:</strong> {selectedInquiry.category || 'N/A'}
// // // //                   </Typography>
// // // //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// // // //                     <BuildIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// // // //                     <strong>Sub-Service:</strong> {selectedInquiry.sub_service || 'N/A'}
// // // //                   </Typography>
// // // //                   {renderDetails(selectedInquiry)}
// // // //                 </Box>
// // // //               </Box>
// // // //             )}
// // // //           </DialogContent>
// // // //         </Dialog>
// // // //       </Box>

// // // //       {/* Footer at the bottom */}
// // // //       <Footer />
// // // //     </Box>
// // // //   );
// // // // };

// // // // export default ClientServices;
// // // import React, { useState, useEffect } from 'react';
// // // import {
// // //   Box,
// // //   Paper,
// // //   Typography,
// // //   CircularProgress,
// // //   useTheme,
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableContainer,
// // //   TableHead,
// // //   TableRow,
// // //   Button,
// // //   Dialog,
// // //   DialogTitle,
// // //   DialogContent,
// // //   Link,
// // //   TextField,
// // //   Alert,
// // // } from '@mui/material';
// // // import {
// // //   Person as PersonIcon,
// // //   LocationOn as LocationOnIcon,
// // //   Email as EmailIcon,
// // //   Phone as PhoneIcon,
// // //   Category as CategoryIcon,
// // //   Build as BuildIcon,
// // //   Visibility as VisibilityIcon,
// // //   GetApp as DownloadIcon,
// // // } from '@mui/icons-material';
// // // import axios from 'axios';
// // // import Footer from "../pages/footer"; // Adjust path if needed
// // // import ClientNavbar from "../components/ClientNavbar"; // Adjust path if needed

// // // const ClientServices = () => {
// // //   const theme = useTheme();
// // //   const [inquiries, setInquiries] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState('');
// // //   const [openDetails, setOpenDetails] = useState(false);
// // //   const [selectedInquiry, setSelectedInquiry] = useState(null);
// // //   const [commentText, setCommentText] = useState('');
// // //   const [commentStatus, setCommentStatus] = useState(null);

// // //   const backendBaseUrl = 'http://127.0.0.1:8000'; // Backend base URL

// // //   const fetchClientInquiries = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const token = localStorage.getItem('access_token');
// // //       if (!token) {
// // //         throw new Error('No access token found. Please log in.');
// // //       }
// // //       const response = await axios.get(`${backendBaseUrl}/api/client-inquiries/`, {
// // //         headers: { Authorization: `Bearer ${token}` },
// // //       });
// // //       console.log('Fetched inquiries:', response.data); // Debug: Log all inquiries
      
// // //       const receivedInquiries = Array.isArray(response.data) ? response.data : [];
// // //       const sortedInquiries = [...receivedInquiries].sort((a, b) => 
// // //         new Date(b.created_at) - new Date(a.created_at)
// // //       );
      
// // //       setInquiries(sortedInquiries);
// // //     } catch (err) {
// // //       console.error('Error fetching inquiries:', err);
// // //       setError(err.message || 'Failed to load inquiries');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchClientInquiries();
// // //   }, []);

// // //   const formatDate = (dateString) => {
// // //     if (!dateString) return 'N/A';
// // //     try {
// // //       const options = {
// // //         year: 'numeric',
// // //         month: 'short',
// // //         day: '2-digit',
// // //         hour: '2-digit',
// // //         minute: '2-digit',
// // //         hour12: true,
// // //       };
// // //       return new Date(dateString).toLocaleString('en-US', options);
// // //     } catch (e) {
// // //       return 'Invalid Date';
// // //     }
// // //   };

// // //   const handleViewDetails = (inquiry) => {
// // //     console.log('Selected inquiry:', inquiry);
// // //     setSelectedInquiry(inquiry);
// // //     setOpenDetails(true);
// // //   };

// // //   const handleCloseDetails = () => {
// // //     setOpenDetails(false);
// // //     setSelectedInquiry(null);
// // //     setCommentText('');
// // //     setCommentStatus(null);
// // //   };

// // //   const handleAddComment = async (inquiryId) => {
// // //     if (!commentText) {
// // //       setCommentStatus({ type: 'error', message: 'Please enter a comment' });
// // //       return;
// // //     }

// // //     try {
// // //       const token = localStorage.getItem('access_token');
// // //       const response = await axios.post(
// // //         `${backendBaseUrl}/api/add-client-comment/${inquiryId}/`,
// // //         { comment_text: commentText, company_response: '' },
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       );
// // //       setCommentStatus({ type: 'success', message: response.data.message || 'Comment added successfully!' });
// // //       setCommentText('');
// // //       fetchClientInquiries();
// // //     } catch (err) {
// // //       setCommentStatus({
// // //         type: 'error',
// // //         message: err.response?.data?.error || 'Failed to add comment',
// // //       });
// // //     }
// // //   };

// // //   const handleNavigateToProfile = () => {
// // //     window.location.href = "/client/profile"; // Replace with your profile route
// // //   };

// // //   const renderDetails = (inquiry) => {
// // //     if (!inquiry) return <Typography>No inquiry selected.</Typography>;

// // //     const renderField = (label, value) => (
// // //       value && (
// // //         <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
// // //           <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px' }}>
// // //             {label}:
// // //           </Typography>
// // //           <Typography variant="body2">{value}</Typography>
// // //         </Box>
// // //       )
// // //     );

// // //     const renderFileField = (label, fileUrl) => (
// // //       fileUrl && (
// // //         <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
// // //           <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px' }}>
// // //             {label}:
// // //           </Typography>
// // //           <Box sx={{ display: 'flex', gap: 1 }}>
// // //             <Link href={fileUrl} target="_blank" sx={{ color: theme.palette.secondary.main }}>
// // //               <VisibilityIcon sx={{ fontSize: 20, mr: 0.5 }} /> View
// // //             </Link>
// // //             <Link href={fileUrl} download sx={{ color: theme.palette.secondary.main }}>
// // //               <DownloadIcon sx={{ fontSize: 20, mr: 0.5 }} /> Download
// // //             </Link>
// // //           </Box>
// // //         </Box>
// // //       )
// // //     );

// // //     const renderFileArrayField = (label, files) => (
// // //       files && files.length > 0 && (
// // //         <Box sx={{ mb: 1 }}>
// // //           <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px', mb: 1 }}>
// // //             {label}:
// // //           </Typography>
// // //           {files.map((file, index) => (
// // //             <Box key={index} sx={{ display: 'flex', gap: 1, mb: 0.5, pl: 2 }}>
// // //               <Link href={file} target="_blank" sx={{ color: theme.palette.secondary.main }}>
// // //                 <VisibilityIcon sx={{ fontSize: 20, mr: 0.5 }} /> View {label} {index + 1}
// // //               </Link>
// // //               <Link href={file} download sx={{ color: theme.palette.secondary.main }}>
// // //                 <DownloadIcon sx={{ fontSize: 20, mr: 0.5 }} /> Download
// // //               </Link>
// // //             </Box>
// // //           ))}
// // //         </Box>
// // //       )
// // //     );

// // //     const renderComments = () => {
// // //       if (!inquiry.comments || inquiry.comments.length === 0) {
// // //         return (
// // //           <Typography variant="body2" sx={{ pl: 2, mb: 2, color: theme.palette.text.secondary }}>
// // //             No comments yet.
// // //           </Typography>
// // //         );
// // //       }
// // //       return (
// // //         <Box sx={{ pl: 2, mb: 2 }}>
// // //           {inquiry.comments.map((comment) => (
// // //             <Box key={comment.id} sx={{ mb: 1 }}>
// // //               <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
// // //                 "{comment.comment_text}"
// // //               </Typography>
// // //               {comment.company_response && (
// // //                 <Typography variant="body2" sx={{ pl: 2, color: theme.palette.text.secondary }}>
// // //                   Company Response: {comment.company_response}
// // //                 </Typography>
// // //               )}
// // //               <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
// // //                 Added on {formatDate(comment.created_at)}
// // //               </Typography>
// // //             </Box>
// // //           ))}
// // //         </Box>
// // //       );
// // //     };

// // //     const data = inquiry.service_data || {};

// // //     return (
// // //       <Box sx={{ mt: 2 }}>
// // //         <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>
// // //           {inquiry.category || 'Unknown Category'} Details
// // //         </Typography>
// // //         {inquiry.category === 'Engineering Consulting' && (
// // //           <>
// // //             {renderField('Type of Building', data.type_of_building)}
// // //             {renderField('Building Purpose', data.building_purpose)}
// // //             {renderField('Number of Floors', data.num_floors)}
// // //             {renderField('Land Area', data.land_area)}
// // //             {renderField('Architectural Style', data.architectural_style)}
// // //             {renderField('Other Architectural Style', data.architectural_style_other)}
// // //             {renderField('Budget Estimate', data.budget_estimate)}
// // //             {renderField('Special Requirements', data.special_requirements)}
// // //             {renderFileField('Site Plan', data.site_plan)}
// // //             {renderFileField('Architectural Plan', data.architectural_plan)}
// // //             {renderFileField('Soil Test Report', data.soil_test_report)}
// // //             {renderFileField('Foundation Design', data.foundation_design)}
// // //             {renderFileField('Electrical Plan', data.electrical_plan)}
// // //             {renderFileField('Plumbing Plan', data.plumbing_plan)}
// // //             {renderFileField('HVAC Plan', data.hvac_plan)}
// // //             {renderFileField('Construction Permit', data.construction_permit)}
// // //             {renderFileField('Cost Estimation', data.cost_estimation)}
// // //           </>
// // //         )}
// // //         {inquiry.category === 'Building Construction Services' && (
// // //           <>
// // //             {renderFileField('Lalpurja', data.lalpurja)}
// // //             {renderFileField('Napi Naksa', data.napi_naksa)}
// // //             {renderFileField('Tax Clearance', data.tax_clearance)}
// // //             {renderFileField('Approved Building Drawings', data.approved_building_drawings)}
// // //             {inquiry.sub_service === 'Residential Construction' && (
// // //               <>
// // //                 {renderFileField('Soil Test Report', data.soil_test_report)}
// // //                 {renderFileField('Structural Stability Certificate', data.structural_stability_certificate)}
// // //                 {renderFileField('House Design Approval', data.house_design_approval)}
// // //                 {renderFileField('Neighbour Consent', data.neighbour_consent)}
// // //                 {/* Progression Details */}
// // //                 {renderField('Permit Application Date', data.permit_application_date)}
// // //                 {renderField('Permit Status', data.permit_status)}
// // //                 {renderFileField('Permit Document', data.permit_document)}
// // //                 {renderField('Construction Start Date', data.construction_start_date)}
// // //                 {renderField('Construction Phase', data.construction_phase)}
// // //                 {renderField('Progress Percentage', data.progress_percentage ? `${data.progress_percentage}%` : null)}
// // //                 {renderFileArrayField('Progress Photos', data.progress_photos)}
// // //                 {renderField('Inspection Dates', data.inspection_dates && data.inspection_dates.length > 0 ? data.inspection_dates.join(', ') : null)}
// // //                 {renderFileArrayField('Inspection Reports', data.inspection_reports)}
// // //                 {renderField('Completion Certificate Application Date', data.completion_certificate_application_date)}
// // //                 {renderFileField('Completion Certificate', data.completion_certificate)}
// // //                 {renderField('Handover Date', data.handover_date)}
// // //                 {renderField('Warranty Details', data.warranty_details)}
// // //               </>
// // //             )}
// // //             {inquiry.sub_service === 'Commercial Construction' && (
// // //               <>
// // //                 {renderFileField('IEE Report', data.iee_report)}
// // //                 {renderFileField('Fire Safety Certificate', data.fire_safety_certificate)}
// // //                 {renderFileField('Lift Permit', data.lift_permit)}
// // //                 {renderFileField('Parking Layout Plan', data.parking_layout_plan)}
// // //                 {renderField('Special Requirements', data.commercial_special_requirements)}
// // //               </>
// // //             )}
// // //             {inquiry.sub_service === 'Renovation and Remodeling Services' && (
// // //               <>
// // //                 {renderField('Type of Building', data.type_of_building)}
// // //                 {renderField('Existing Building Details', data.existing_building_details)}
// // //                 {renderField('Area to Renovate', data.area_to_renovate)}
// // //                 {renderField('Budget Estimate', data.budget_estimate)}
// // //                 {renderField('Special Requirements', data.renovation_special_requirements)}
// // //                 {renderFileField('Owner Permission Letter', data.owner_permission_letter)}
// // //                 {renderFileField('Existing Structure Analysis', data.existing_structure_analysis)}
// // //                 {renderFileField('Renovation Plan', data.renovation_plan)}
// // //                 {renderFileField('NOC from Municipality', data.noc_municipality)}
// // //                 {renderFileField('Waste Management Plan', data.waste_management_plan)}
// // //               </>
// // //             )}
// // //           </>
// // //         )}
// // //         {inquiry.category === 'Post-Construction Maintenance' && (
// // //           <>
// // //             {renderField('Maintenance Type', data.maintenance_type)}
// // //             {renderField('Maintenance Details', data.maintenance_details)}
// // //             {renderFileField('Maintenance Photos', data.maintenance_photos)}
// // //             {renderField('Preferred Date', data.preferred_date)}
// // //             {renderField('Preferred Time', data.preferred_time)}
// // //             {renderField('Payment Agreed', data.payment_agreed ? 'Yes' : 'No')}
// // //           </>
// // //         )}
// // //         {inquiry.category === 'Safety and Training Services' && (
// // //           <>
// // //             {renderField('Language Preference', data.language_preference)}
// // //             {renderField('Other Language', data.language_preference_other)}
// // //             {renderField('Training Date', data.training_date)}
// // //             {renderField('Training Time', data.training_time)}
// // //             {renderField('Training Agreement', data.training_agreement ? 'Yes' : 'No')}
// // //             {inquiry.certificate && (
// // //               <Box sx={{ mt: 2 }}>
// // //                 <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 1 }}>
// // //                   Certificate
// // //                 </Typography>
// // //                 {renderFileField('Your Certificate', inquiry.certificate)}
// // //               </Box>
// // //             )}
// // //             {!inquiry.certificate && inquiry.status === 'Completed' && (
// // //               <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 2 }}>
// // //                 Certificate not yet uploaded by the company.
// // //               </Typography>
// // //             )}
// // //           </>
// // //         )}
// // //         {!['Engineering Consulting', 'Building Construction Services', 'Post-Construction Maintenance', 'Safety and Training Services'].includes(inquiry.category) && (
// // //           <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
// // //             No additional details available for this category.
// // //           </Typography>
// // //         )}
// // //         {/* Comments Section */}
// // //         <Box sx={{ mt: 2 }}>
// // //           <Typography variant="h6" sx={{ 
// // //             color: theme.palette.primary.main,
// // //             fontWeight: 'bold',
// // //             mb: 2
// // //           }}>
// // //             Comments
// // //           </Typography>
// // //           {renderComments()}
// // //           <Box sx={{ display: 'flex', gap: 2, pl: 2 }}>
// // //             <TextField
// // //               label="Add Comment"
// // //               multiline
// // //               rows={3}
// // //               value={commentText}
// // //               onChange={(e) => setCommentText(e.target.value)}
// // //               fullWidth
// // //               sx={{ maxWidth: 500 }}
// // //             />
// // //             <Button
// // //               variant="contained"
// // //               color="primary"
// // //               onClick={() => handleAddComment(inquiry.id)}
// // //               disabled={!commentText}
// // //             >
// // //               Submit Comment
// // //             </Button>
// // //           </Box>
// // //           {commentStatus && (
// // //             <Alert severity={commentStatus.type} sx={{ mt: 2, pl: 2 }}>
// // //               {commentStatus.message}
// // //             </Alert>
// // //           )}
// // //         </Box>
// // //       </Box>
// // //     );
// // //   };

// // //   return (
// // //     <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
// // //       {/* Add ClientNavbar at the top */}
// // //       <ClientNavbar
// // //         wishlist={[]} // Placeholder: Replace with actual wishlist data if available
// // //         cartItems={[]} // Placeholder: Replace with actual cart data if available
// // //         onNavigateToProfile={handleNavigateToProfile}
// // //       />

// // //       {/* Main content */}
// // //       <Box sx={{ p: 2, flex: 1, mt: 8 }}>
// // //         <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
// // //           <Typography variant="h4" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: 'bold' }}>
// // //             My Inquiries
// // //           </Typography>

// // //           {loading ? (
// // //             <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
// // //               <CircularProgress size={60} />
// // //             </Box>
// // //           ) : error ? (
// // //             <Typography color="error" sx={{ p: 2, bgcolor: '#ffeeee', borderRadius: 2 }}>
// // //               {error}
// // //             </Typography>
// // //           ) : inquiries.length === 0 ? (
// // //             <Typography variant="h6" sx={{ p: 2, color: theme.palette.text.secondary }}>
// // //               No inquiries found
// // //             </Typography>
// // //           ) : (
// // //             <TableContainer component={Paper}>
// // //               <Table sx={{ minWidth: 650 }} aria-label="inquiries table">
// // //                 <TableHead>
// // //                   <TableRow>
// // //                     <TableCell>Full Name</TableCell>
// // //                     <TableCell>Location</TableCell>
// // //                     <TableCell>Category</TableCell>
// // //                     <TableCell>Sub-Service</TableCell>
// // //                     <TableCell>Status</TableCell>
// // //                     <TableCell>Submitted At</TableCell>
// // //                     <TableCell>Actions</TableCell>
// // //                   </TableRow>
// // //                 </TableHead>
// // //                 <TableBody>
// // //                   {inquiries.map((inquiry) => (
// // //                     <TableRow key={inquiry.id}>
// // //                       <TableCell>{inquiry.full_name || 'N/A'}</TableCell>
// // //                       <TableCell>{inquiry.location || 'N/A'}</TableCell>
// // //                       <TableCell>{inquiry.category || 'N/A'}</TableCell>
// // //                       <TableCell>{inquiry.sub_service || 'N/A'}</TableCell>
// // //                       <TableCell>{inquiry.status || 'N/A'}</TableCell>
// // //                       <TableCell>{formatDate(inquiry.created_at)}</TableCell>
// // //                       <TableCell>
// // //                         <Button
// // //                           variant="outlined"
// // //                           color="primary"
// // //                           onClick={() => handleViewDetails(inquiry)}
// // //                           disabled={!inquiry.id}
// // //                         >
// // //                           View Details
// // //                         </Button>
// // //                       </TableCell>
// // //                     </TableRow>
// // //                   ))}
// // //                 </TableBody>
// // //               </Table>
// // //             </TableContainer>
// // //           )}
// // //         </Paper>

// // //         {/* Details Dialog */}
// // //         <Dialog open={openDetails} onClose={handleCloseDetails} maxWidth="md" fullWidth>
// // //           <DialogTitle>Inquiry Details</DialogTitle>
// // //           <DialogContent>
// // //             {selectedInquiry && (
// // //               <Box sx={{ p: 2 }}>
// // //                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
// // //                   <PersonIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
// // //                   <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
// // //                     {selectedInquiry.full_name || 'N/A'}
// // //                   </Typography>
// // //                 </Box>
// // //                 <Box sx={{ pl: 4 }}>
// // //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// // //                     <LocationOnIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// // //                     {selectedInquiry.location || 'N/A'}
// // //                   </Typography>
// // //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// // //                     <EmailIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// // //                     {selectedInquiry.email || 'N/A'}
// // //                   </Typography>
// // //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// // //                     <PhoneIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// // //                     {selectedInquiry.phone_number || 'N/A'}
// // //                   </Typography>
// // //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// // //                     <CategoryIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// // //                     <strong>Category:</strong> {selectedInquiry.category || 'N/A'}
// // //                   </Typography>
// // //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// // //                     <BuildIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// // //                     <strong>Sub-Service:</strong> {selectedInquiry.sub_service || 'N/A'}
// // //                   </Typography>
// // //                   {renderDetails(selectedInquiry)}
// // //                 </Box>
// // //               </Box>
// // //             )}
// // //           </DialogContent>
// // //         </Dialog>
// // //       </Box>

// // //       {/* Footer at the bottom */}
// // //       <Footer />
// // //     </Box>
// // //   );
// // // };

// // // export default ClientServices;
// // import React, { useState, useEffect } from 'react';
// // import {
// //   Box,
// //   Paper,
// //   Typography,
// //   CircularProgress,
// //   useTheme,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Button,
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   Link,
// //   TextField,
// //   Alert,
// //   LinearProgress,
// // } from '@mui/material';
// // import {
// //   Person as PersonIcon,
// //   LocationOn as LocationOnIcon,
// //   Email as EmailIcon,
// //   Phone as PhoneIcon,
// //   Category as CategoryIcon,
// //   Build as BuildIcon,
// //   Visibility as VisibilityIcon,
// //   GetApp as DownloadIcon,
// // } from '@mui/icons-material';
// // import axios from 'axios';
// // import Footer from "../pages/footer"; // Adjust path if needed
// // import ClientNavbar from "../components/ClientNavbar"; // Adjust path if needed

// // const ClientServices = () => {
// //   const theme = useTheme();
// //   const [inquiries, setInquiries] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState('');
// //   const [openDetails, setOpenDetails] = useState(false);
// //   const [selectedInquiry, setSelectedInquiry] = useState(null);
// //   const [commentText, setCommentText] = useState('');
// //   const [commentStatus, setCommentStatus] = useState(null);

// //   const backendBaseUrl = 'http://127.0.0.1:8000'; // Backend base URL

// //   const fetchClientInquiries = async () => {
// //     setLoading(true);
// //     try {
// //       const token = localStorage.getItem('access_token');
// //       if (!token) {
// //         throw new Error('No access token found. Please log in.');
// //       }
// //       const response = await axios.get(`${backendBaseUrl}/api/client-inquiries/`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       console.log('Fetched inquiries:', response.data); // Debug: Log all inquiries
      
// //       const receivedInquiries = Array.isArray(response.data) ? response.data : [];
// //       const sortedInquiries = [...receivedInquiries].sort((a, b) => 
// //         new Date(b.created_at) - new Date(a.created_at)
// //       );
      
// //       setInquiries(sortedInquiries);
// //     } catch (err) {
// //       console.error('Error fetching inquiries:', err);
// //       setError(err.message || 'Failed to load inquiries');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchClientInquiries();
// //   }, []);

// //   const formatDate = (dateString) => {
// //     if (!dateString) return 'N/A';
// //     try {
// //       const options = {
// //         year: 'numeric',
// //         month: 'short',
// //         day: '2-digit',
// //         hour: '2-digit',
// //         minute: '2-digit',
// //         hour12: true,
// //       };
// //       return new Date(dateString).toLocaleString('en-US', options);
// //     } catch (e) {
// //       return 'Invalid Date';
// //     }
// //   };

// //   const handleViewDetails = (inquiry) => {
// //     console.log('Selected inquiry:', inquiry);
// //     setSelectedInquiry(inquiry);
// //     setOpenDetails(true);
// //   };

// //   const handleCloseDetails = () => {
// //     setOpenDetails(false);
// //     setSelectedInquiry(null);
// //     setCommentText('');
// //     setCommentStatus(null);
// //   };

// //   const handleAddComment = async (inquiryId) => {
// //     if (!commentText) {
// //       setCommentStatus({ type: 'error', message: 'Please enter a comment' });
// //       return;
// //     }

// //     try {
// //       const token = localStorage.getItem('access_token');
// //       const response = await axios.post(
// //         `${backendBaseUrl}/api/add-client-comment/${inquiryId}/`,
// //         { comment_text: commentText, company_response: '' },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       setCommentStatus({ type: 'success', message: response.data.message || 'Comment added successfully!' });
// //       setCommentText('');
// //       fetchClientInquiries();
// //     } catch (err) {
// //       setCommentStatus({
// //         type: 'error',
// //         message: err.response?.data?.error || 'Failed to add comment',
// //       });
// //     }
// //   };

// //   const handleNavigateToProfile = () => {
// //     window.location.href = "/client/profile"; // Replace with your profile route
// //   };

// //   const renderDetails = (inquiry) => {
// //     if (!inquiry) return <Typography>No inquiry selected.</Typography>;

// //     const renderField = (label, value) => (
// //       value && (
// //         <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
// //           <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px' }}>
// //             {label}:
// //           </Typography>
// //           <Typography variant="body2">{value}</Typography>
// //         </Box>
// //       )
// //     );

// //     const renderFileField = (label, fileUrl) => (
// //       fileUrl && (
// //         <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
// //           <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px' }}>
// //             {label}:
// //           </Typography>
// //           <Box sx={{ display: 'flex', gap: 1 }}>
// //             <Link href={fileUrl} target="_blank" sx={{ color: theme.palette.secondary.main }}>
// //               <VisibilityIcon sx={{ fontSize: 20, mr: 0.5 }} /> View
// //             </Link>
// //             <Link href={fileUrl} download sx={{ color: theme.palette.secondary.main }}>
// //               <DownloadIcon sx={{ fontSize: 20, mr: 0.5 }} /> Download
// //             </Link>
// //           </Box>
// //         </Box>
// //       )
// //     );

// //     const renderFileArrayField = (label, files) => (
// //       files && files.length > 0 && (
// //         <Box sx={{ mb: 1 }}>
// //           <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px', mb: 1 }}>
// //             {label}:
// //           </Typography>
// //           {files.map((file, index) => (
// //             <Box key={index} sx={{ display: 'flex', gap: 1, mb: 0.5, pl: 2 }}>
// //               <Link href={file} target="_blank" sx={{ color: theme.palette.secondary.main }}>
// //                 <VisibilityIcon sx={{ fontSize: 20, mr: 0.5 }} /> View {label} {index + 1}
// //               </Link>
// //               <Link href={file} download sx={{ color: theme.palette.secondary.main }}>
// //                 <DownloadIcon sx={{ fontSize: 20, mr: 0.5 }} /> Download
// //               </Link>
// //             </Box>
// //           ))}
// //         </Box>
// //       )
// //     );

// //     const renderComments = () => {
// //       if (!inquiry.comments || inquiry.comments.length === 0) {
// //         return (
// //           <Typography variant="body2" sx={{ pl: 2, mb: 2, color: theme.palette.text.secondary }}>
// //             No comments yet.
// //           </Typography>
// //         );
// //       }
// //       return (
// //         <Box sx={{ pl: 2, mb: 2 }}>
// //           {inquiry.comments.map((comment) => (
// //             <Box key={comment.id} sx={{ mb: 1 }}>
// //               <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
// //                 "{comment.comment_text}"
// //               </Typography>
// //               {comment.company_response && (
// //                 <Typography variant="body2" sx={{ pl: 2, color: theme.palette.text.secondary }}>
// //                   Company Response: {comment.company_response}
// //                 </Typography>
// //               )}
// //               <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
// //                 Added on {formatDate(comment.created_at)}
// //               </Typography>
// //             </Box>
// //           ))}
// //         </Box>
// //       );
// //     };

// //     const data = inquiry.service_data || {};

// //     return (
// //       <Box sx={{ mt: 2 }}>
// //         <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>
// //           {inquiry.category || 'Unknown Category'} Details
// //         </Typography>
// //         {/* Progress Overview */}
// //         {inquiry.category === 'Building Construction Services' && inquiry.sub_service === 'Residential Construction' && (
// //           <Box sx={{ mb: 3, p: 2, bgcolor: theme.palette.grey[100], borderRadius: 2 }}>
// //             <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
// //               Construction Progress
// //             </Typography>
// //             {renderField('Overall Status', inquiry.status)}
// //             {data.progress_percentage != null && (
// //               <Box sx={{ mb: 2 }}>
// //                 <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
// //                   Progress Percentage:
// //                 </Typography>
// //                 <LinearProgress
// //                   variant="determinate"
// //                   value={data.progress_percentage}
// //                   sx={{ height: 10, borderRadius: 5 }}
// //                 />
// //                 <Typography variant="body2" sx={{ mt: 1 }}>
// //                   {data.progress_percentage}% Complete
// //                 </Typography>
// //               </Box>
// //             )}
// //             {renderField('Construction Phase', data.construction_phase)}
// //             {renderField('Permit Status', data.permit_status)}
// //           </Box>
// //         )}
// //         {/* Documents */}
// //         <Box sx={{ mb: 3 }}>
// //           <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
// //             Documents
// //           </Typography>
// //           {inquiry.category === 'Engineering Consulting' && (
// //             <>
// //               {renderFileField('Site Plan', data.site_plan)}
// //               {renderFileField('Architectural Plan', data.architectural_plan)}
// //               {renderFileField('Soil Test Report', data.soil_test_report)}
// //               {renderFileField('Foundation Design', data.foundation_design)}
// //               {renderFileField('Electrical Plan', data.electrical_plan)}
// //               {renderFileField('Plumbing Plan', data.plumbing_plan)}
// //               {renderFileField('HVAC Plan', data.hvac_plan)}
// //               {renderFileField('Construction Permit', data.construction_permit)}
// //               {renderFileField('Cost Estimation', data.cost_estimation)}
// //             </>
// //           )}
// //           {inquiry.category === 'Building Construction Services' && (
// //             <>
// //               {renderFileField('Lalpurja', data.lalpurja)}
// //               {renderFileField('Napi Naksa', data.napi_naksa)}
// //               {renderFileField('Tax Clearance', data.tax_clearance)}
// //               {renderFileField('Approved Building Drawings', data.approved_building_drawings)}
// //               {inquiry.sub_service === 'Residential Construction' && (
// //                 <>
// //                   {renderFileField('Soil Test Report', data.soil_test_report)}
// //                   {renderFileField('Structural Stability Certificate', data.structural_stability_certificate)}
// //                   {renderFileField('House Design Approval', data.house_design_approval)}
// //                   {renderFileField('Neighbour Consent', data.neighbour_consent)}
// //                   {renderFileField('Permit Document', data.permit_document)}
// //                   {renderFileArrayField('Progress Photos', data.progress_photos)}
// //                   {renderFileArrayField('Inspection Reports', data.inspection_reports)}
// //                   {renderFileField('Completion Certificate', data.completion_certificate)}
// //                 </>
// //               )}
// //               {inquiry.sub_service === 'Commercial Construction' && (
// //                 <>
// //                   {renderFileField('IEE Report', data.iee_report)}
// //                   {renderFileField('Fire Safety Certificate', data.fire_safety_certificate)}
// //                   {renderFileField('Lift Permit', data.lift_permit)}
// //                   {renderFileField('Parking Layout Plan', data.parking_layout_plan)}
// //                 </>
// //               )}
// //               {inquiry.sub_service === 'Renovation and Remodeling Services' && (
// //                 <>
// //                   {renderFileField('Owner Permission Letter', data.owner_permission_letter)}
// //                   {renderFileField('Existing Structure Analysis', data.existing_structure_analysis)}
// //                   {renderFileField('Renovation Plan', data.renovation_plan)}
// //                   {renderFileField('NOC from Municipality', data.noc_municipality)}
// //                   {renderFileField('Waste Management Plan', data.waste_management_plan)}
// //                 </>
// //               )}
// //             </>
// //           )}
// //           {inquiry.category === 'Post-Construction Maintenance' && (
// //             <>
// //               {renderFileField('Maintenance Photos', data.maintenance_photos)}
// //             </>
// //           )}
// //           {inquiry.category === 'Safety and Training Services' && inquiry.certificate && (
// //             <>
// //               {renderFileField('Certificate', inquiry.certificate)}
// //             </>
// //           )}
// //         </Box>
// //         {/* Additional Details */}
// //         {inquiry.category === 'Engineering Consulting' && (
// //           <Box sx={{ mb: 3 }}>
// //             <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
// //               Additional Details
// //             </Typography>
// //             {renderField('Type of Building', data.type_of_building)}
// //             {renderField('Building Purpose', data.building_purpose)}
// //             {renderField('Number of Floors', data.num_floors)}
// //             {renderField('Land Area', data.land_area)}
// //             {renderField('Architectural Style', data.architectural_style)}
// //             {renderField('Other Architectural Style', data.architectural_style_other)}
// //             {renderField('Budget Estimate', data.budget_estimate)}
// //             {renderField('Special Requirements', data.special_requirements)}
// //           </Box>
// //         )}
// //         {inquiry.category === 'Building Construction Services' && (
// //           <Box sx={{ mb: 3 }}>
// //             <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
// //               Additional Details
// //             </Typography>
// //             {inquiry.sub_service === 'Residential Construction' && (
// //               <>
// //                 {renderField('Permit Application Date', data.permit_application_date)}
// //                 {renderField('Construction Start Date', data.construction_start_date)}
// //                 {renderField('Inspection Dates', data.inspection_dates && data.inspection_dates.length > 0 ? data.inspection_dates.join(', ') : null)}
// //                 {renderField('Completion Certificate Application Date', data.completion_certificate_application_date)}
// //                 {renderField('Handover Date', data.handover_date)}
// //                 {renderField('Warranty Details', data.warranty_details)}
// //               </>
// //             )}
// //             {inquiry.sub_service === 'Commercial Construction' && (
// //               <>
// //                 {renderField('Special Requirements', data.commercial_special_requirements)}
// //               </>
// //             )}
// //             {inquiry.sub_service === 'Renovation and Remodeling Services' && (
// //               <>
// //                 {renderField('Type of Building', data.type_of_building)}
// //                 {renderField('Existing Building Details', data.existing_building_details)}
// //                 {renderField('Area to Renovate', data.area_to_renovate)}
// //                 {renderField('Budget Estimate', data.budget_estimate)}
// //                 {renderField('Special Requirements', data.renovation_special_requirements)}
// //               </>
// //             )}
// //           </Box>
// //         )}
// //         {inquiry.category === 'Post-Construction Maintenance' && (
// //           <Box sx={{ mb: 3 }}>
// //             <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
// //               Additional Details
// //             </Typography>
// //             {renderField('Maintenance Type', data.maintenance_type)}
// //             {renderField('Maintenance Details', data.maintenance_details)}
// //             {renderField('Preferred Date', data.preferred_date)}
// //             {renderField('Preferred Time', data.preferred_time)}
// //             {renderField('Payment Agreed', data.payment_agreed ? 'Yes' : 'No')}
// //           </Box>
// //         )}
// //         {inquiry.category === 'Safety and Training Services' && (
// //           <Box sx={{ mb: 3 }}>
// //             <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
// //               Additional Details
// //             </Typography>
// //             {renderField('Language Preference', data.language_preference)}
// //             {renderField('Other Language', data.language_preference_other)}
// //             {renderField('Training Date', data.training_date)}
// //             {renderField('Training Time', data.training_time)}
// //             {renderField('Training Agreement', data.training_agreement ? 'Yes' : 'No')}
// //             {!inquiry.certificate && inquiry.status === 'Completed' && (
// //               <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 2 }}>
// //                 Certificate not yet uploaded by the company.
// //               </Typography>
// //             )}
// //           </Box>
// //         )}
// //         {!['Engineering Consulting', 'Building Construction Services', 'Post-Construction Maintenance', 'Safety and Training Services'].includes(inquiry.category) && (
// //           <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
// //             No additional details available for this category.
// //           </Typography>
// //         )}
// //         {/* Comments Section */}
// //         <Box sx={{ mt: 2 }}>
// //           <Typography variant="h6" sx={{ 
// //             color: theme.palette.primary.main,
// //             fontWeight: 'bold',
// //             mb: 2
// //           }}>
// //             Comments
// //           </Typography>
// //           {renderComments()}
// //           <Box sx={{ display: 'flex', gap: 2, pl: 2 }}>
// //             <TextField
// //               label="Add Comment"
// //               multiline
// //               rows={3}
// //               value={commentText}
// //               onChange={(e) => setCommentText(e.target.value)}
// //               fullWidth
// //               sx={{ maxWidth: 500 }}
// //             />
// //             <Button
// //               variant="contained"
// //               color="primary"
// //               onClick={() => handleAddComment(inquiry.id)}
// //               disabled={!commentText}
// //             >
// //               Submit Comment
// //             </Button>
// //           </Box>
// //           {commentStatus && (
// //             <Alert severity={commentStatus.type} sx={{ mt: 2, pl: 2 }}>
// //               {commentStatus.message}
// //             </Alert>
// //           )}
// //         </Box>
// //       </Box>
// //     );
// //   };

// //   return (
// //     <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
// //       {/* Add ClientNavbar at the top */}
// //       <ClientNavbar
// //         wishlist={[]} // Placeholder: Replace with actual wishlist data if available
// //         cartItems={[]} // Placeholder: Replace with actual cart data if available
// //         onNavigateToProfile={handleNavigateToProfile}
// //       />

// //       {/* Main content */}
// //       <Box sx={{ p: 2, flex: 1, mt: 8 }}>
// //         <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
// //           <Typography variant="h4" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: 'bold' }}>
// //             My Inquiries
// //           </Typography>

// //           {loading ? (
// //             <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
// //               <CircularProgress size={60} />
// //             </Box>
// //           ) : error ? (
// //             <Typography color="error" sx={{ p: 2, bgcolor: '#ffeeee', borderRadius: 2 }}>
// //               {error}
// //             </Typography>
// //           ) : inquiries.length === 0 ? (
// //             <Typography variant="h6" sx={{ p: 2, color: theme.palette.text.secondary }}>
// //               No inquiries found
// //             </Typography>
// //           ) : (
// //             <TableContainer component={Paper}>
// //               <Table sx={{ minWidth: 650 }} aria-label="inquiries table">
// //                 <TableHead>
// //                   <TableRow>
// //                     <TableCell>Full Name</TableCell>
// //                     <TableCell>Location</TableCell>
// //                     <TableCell>Category</TableCell>
// //                     <TableCell>Sub-Service</TableCell>
// //                     <TableCell>Status</TableCell>
// //                     <TableCell>Submitted At</TableCell>
// //                     <TableCell>Actions</TableCell>
// //                   </TableRow>
// //                 </TableHead>
// //                 <TableBody>
// //                   {inquiries.map((inquiry) => (
// //                     <TableRow key={inquiry.id}>
// //                       <TableCell>{inquiry.full_name || 'N/A'}</TableCell>
// //                       <TableCell>{inquiry.location || 'N/A'}</TableCell>
// //                       <TableCell>{inquiry.category || 'N/A'}</TableCell>
// //                       <TableCell>{inquiry.sub_service || 'N/A'}</TableCell>
// //                       <TableCell>{inquiry.status || 'N/A'}</TableCell>
// //                       <TableCell>{formatDate(inquiry.created_at)}</TableCell>
// //                       <TableCell>
// //                         <Button
// //                           variant="outlined"
// //                           color="primary"
// //                           onClick={() => handleViewDetails(inquiry)}
// //                           disabled={!inquiry.id}
// //                         >
// //                           View Details
// //                         </Button>
// //                       </TableCell>
// //                     </TableRow>
// //                   ))}
// //                 </TableBody>
// //               </Table>
// //             </TableContainer>
// //           )}
// //         </Paper>

// //         {/* Details Dialog */}
// //         <Dialog open={openDetails} onClose={handleCloseDetails} maxWidth="md" fullWidth>
// //           <DialogTitle>Inquiry Details</DialogTitle>
// //           <DialogContent>
// //             {selectedInquiry && (
// //               <Box sx={{ p: 2 }}>
// //                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
// //                   <PersonIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
// //                   <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
// //                     {selectedInquiry.full_name || 'N/A'}
// //                   </Typography>
// //                 </Box>
// //                 <Box sx={{ pl: 4 }}>
// //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// //                     <LocationOnIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// //                     {selectedInquiry.location || 'N/A'}
// //                   </Typography>
// //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// //                     <EmailIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// //                     {selectedInquiry.email || 'N/A'}
// //                   </Typography>
// //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// //                     <PhoneIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// //                     {selectedInquiry.phone_number || 'N/A'}
// //                   </Typography>
// //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// //                     <CategoryIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// //                     <strong>Category:</strong> {selectedInquiry.category || 'N/A'}
// //                   </Typography>
// //                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// //                     <BuildIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
// //                     <strong>Sub-Service:</strong> {selectedInquiry.sub_service || 'N/A'}
// //                   </Typography>
// //                   {renderDetails(selectedInquiry)}
// //                 </Box>
// //               </Box>
// //             )}
// //           </DialogContent>
// //         </Dialog>
// //       </Box>

// //       {/* Footer at the bottom */}
// //       <Footer />
// //     </Box>
// //   );
// // };

// // export default ClientServices;
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   CircularProgress,
//   useTheme,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Link,
//   TextField,
//   Alert,
//   LinearProgress,
// } from '@mui/material';
// import {
//   Person as PersonIcon,
//   LocationOn as LocationOnIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   Category as CategoryIcon,
//   Build as BuildIcon,
//   Visibility as VisibilityIcon,
//   GetApp as DownloadIcon,
// } from '@mui/icons-material';
// import axios from 'axios';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import Footer from "../pages/footer"; // Adjust path if needed
// import ClientNavbar from "../components/ClientNavbar"; // Adjust path if needed

// // Register Chart.js components
// ChartJS.register(ArcElement, Tooltip, Legend);

// const ClientServices = () => {
//   const theme = useTheme();
//   const [inquiries, setInquiries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [openDetails, setOpenDetails] = useState(false);
//   const [selectedInquiry, setSelectedInquiry] = useState(null);
//   const [commentText, setCommentText] = useState('');
//   const [commentStatus, setCommentStatus] = useState(null);

//   const backendBaseUrl = 'http://127.0.0.1:8000'; // Backend base URL

//   const fetchClientInquiries = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('access_token');
//       if (!token) {
//         throw new Error('No access token found. Please log in.');
//       }
//       const response = await axios.get(`${backendBaseUrl}/api/client-inquiries/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log('Fetched inquiries:', response.data); // Debug: Log all inquiries
      
//       const receivedInquiries = Array.isArray(response.data) ? response.data : [];
//       const sortedInquiries = [...receivedInquiries].sort((a, b) => 
//         new Date(b.created_at) - new Date(a.created_at)
//       );
      
//       setInquiries(sortedInquiries);
//     } catch (err) {
//       console.error('Error fetching inquiries:', err);
//       setError(err.message || 'Failed to load inquiries');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchClientInquiries();
//   }, []);

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       const options = {
//         year: 'numeric',
//         month: 'short',
//         day: '2-digit',
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true,
//       };
//       return new Date(dateString).toLocaleString('en-US', options);
//     } catch (e) {
//       return 'Invalid Date';
//     }
//   };

//   const handleViewDetails = (inquiry) => {
//     console.log('Selected inquiry:', inquiry);
//     setSelectedInquiry(inquiry);
//     setOpenDetails(true);
//   };

//   const handleCloseDetails = () => {
//     setOpenDetails(false);
//     setSelectedInquiry(null);
//     setCommentText('');
//     setCommentStatus(null);
//   };

//   const handleAddComment = async (inquiryId) => {
//     if (!commentText) {
//       setCommentStatus({ type: 'error', message: 'Please enter a comment' });
//       return;
//     }

//     try {
//       const token = localStorage.getItem('access_token');
//       const response = await axios.post(
//         `${backendBaseUrl}/api/add-client-comment/${inquiryId}/`,
//         { comment_text: commentText, company_response: '' },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setCommentStatus({ type: 'success', message: response.data.message || 'Comment added successfully!' });
//       setCommentText('');
//       fetchClientInquiries();
//     } catch (err) {
//       setCommentStatus({
//         type: 'error',
//         message: err.response?.data?.error || 'Failed to add comment',
//       });
//     }
//   };

//   const handleNavigateToProfile = () => {
//     window.location.href = "/client/profile"; // Replace with your profile route
//   };

//   const renderDetails = (inquiry) => {
//     if (!inquiry) return <Typography>No inquiry selected.</Typography>;

//     const renderField = (label, value) => (
//       value && (
//         <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px' }}>
//             {label}:
//           </Typography>
//           <Typography variant="body2">{value}</Typography>
//         </Box>
//       )
//     );

//     const renderFileField = (label, fileUrl) => (
//       fileUrl && (
//         <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px' }}>
//             {label}:
//           </Typography>
//           <Box sx={{ display: 'flex', gap: 1 }}>
//             <Link href={fileUrl} target="_blank" sx={{ color: theme.palette.secondary.main }}>
//               <VisibilityIcon sx={{ fontSize: 20, mr: 0.5 }} /> View
//             </Link>
//             <Link href={fileUrl} download sx={{ color: theme.palette.secondary.main }}>
//               <DownloadIcon sx={{ fontSize: 20, mr: 0.5 }} /> Download
//             </Link>
//           </Box>
//         </Box>
//       )
//     );

//     const renderFileArrayField = (label, files) => (
//       files && files.length > 0 && (
//         <Box sx={{ mb: 1 }}>
//           <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px', mb: 1 }}>
//             {label}:
//           </Typography>
//           {files.map((file, index) => (
//             <Box key={index} sx={{ display: 'flex', gap: 1, mb: 0.5, pl: 2 }}>
//               <Link href={file} target="_blank" sx={{ color: theme.palette.secondary.main }}>
//                 <VisibilityIcon sx={{ fontSize: 20, mr: 0.5 }} /> View {label} {index + 1}
//               </Link>
//               <Link href={file} download sx={{ color: theme.palette.secondary.main }}>
//                 <DownloadIcon sx={{ fontSize: 20, mr: 0.5 }} /> Download
//               </Link>
//             </Box>
//           ))}
//         </Box>
//       )
//     );

//     const renderComments = () => {
//       if (!inquiry.comments || inquiry.comments.length === 0) {
//         return (
//           <Typography variant="body2" sx={{ pl: 2, mb: 2, color: theme.palette.text.secondary }}>
//             No comments yet.
//           </Typography>
//         );
//       }
//       return (
//         <Box sx={{ pl: 2, mb: 2 }}>
//           {inquiry.comments.map((comment) => (
//             <Box key={comment.id} sx={{ mb: 1 }}>
//               <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
//                 "{comment.comment_text}"
//               </Typography>
//               {comment.company_response && (
//                 <Typography variant="body2" sx={{ pl: 2, color: theme.palette.text.secondary }}>
//                   Company Response: {comment.company_response}
//                 </Typography>
//               )}
//               <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
//                 Added on {formatDate(comment.created_at)}
//               </Typography>
//             </Box>
//           ))}
//         </Box>
//       );
//     };

//     const data = inquiry.service_data || {};

//     // Pie chart data for progress_percentage
//     const pieChartData = {
//       labels: ['Completed', 'Remaining'],
//       datasets: [
//         {
//           data: data.progress_percentage != null ? [data.progress_percentage, 100 - data.progress_percentage] : [0, 100],
//           backgroundColor: [theme.palette.primary.main, theme.palette.grey[300]],
//           borderColor: [theme.palette.primary.dark, theme.palette.grey[500]],
//           borderWidth: 1,
//         },
//       ],
//     };

//     return (
//       <Box sx={{ mt: 2 }}>
//         <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>
//           {inquiry.category || 'Unknown Category'} Details
//         </Typography>
//         {/* Progress Overview */}
//         {inquiry.category === 'Building Construction Services' && inquiry.sub_service === 'Residential Construction' && (
//           <Box sx={{ mb: 3, p: 2, bgcolor: theme.palette.grey[100], borderRadius: 2 }}>
//             <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
//               Construction Progress
//             </Typography>
//             {renderField('Overall Status', inquiry.status)}
//             {data.progress_percentage != null && (
//               <Box sx={{ mb: 2, maxWidth: 300 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
//                   Progress Percentage:
//                 </Typography>
//                 <Pie data={pieChartData} options={{ maintainAspectRatio: false }} height={200} />
//                 <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
//                   {data.progress_percentage}% Complete
//                 </Typography>
//               </Box>
//             )}
//             {renderField('Construction Phase', data.construction_phase)}
//             {renderField('Permit Status', data.permit_status)}
//           </Box>
//         )}
//         {/* Documents */}
//         <Box sx={{ mb: 3 }}>
//           <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
//             Documents
//           </Typography>
//           {inquiry.category === 'Engineering Consulting' && (
//             <>
//               {renderFileField('Site Plan', data.site_plan)}
//               {renderFileField('Architectural Plan', data.architectural_plan)}
//               {renderFileField('Soil Test Report', data.soil_test_report)}
//               {renderFileField('Foundation Design', data.foundation_design)}
//               {renderFileField('Electrical Plan', data.electrical_plan)}
//               {renderFileField('Plumbing Plan', data.plumbing_plan)}
//               {renderFileField('HVAC Plan', data.hvac_plan)}
//               {renderFileField('Construction Permit', data.construction_permit)}
//               {renderFileField('Cost Estimation', data.cost_estimation)}
//             </>
//           )}
//           {inquiry.category === 'Building Construction Services' && (
//             <>
//               {renderFileField('Lalpurja', data.lalpurja)}
//               {renderFileField('Napi Naksa', data.napi_naksa)}
//               {renderFileField('Tax Clearance', data.tax_clearance)}
//               {renderFileField('Approved Building Drawings', data.approved_building_drawings)}
//               {inquiry.sub_service === 'Residential Construction' && (
//                 <>
//                   {renderFileField('Soil Test Report', data.soil_test_report)}
//                   {renderFileField('Structural Stability Certificate', data.structural_stability_certificate)}
//                   {renderFileField('House Design Approval', data.house_design_approval)}
//                   {renderFileField('Neighbour Consent', data.neighbour_consent)}
//                   {renderFileField('Permit Document', data.permit_document)}
//                   {renderFileArrayField('Progress Photos', data.progress_photos)}
//                   {renderFileArrayField('Inspection Reports', data.inspection_reports)}
//                   {renderFileField('Completion Certificate', data.completion_certificate)}
//                 </>
//               )}
//               {inquiry.sub_service === 'Commercial Construction' && (
//                 <>
//                   {renderFileField('IEE Report', data.iee_report)}
//                   {renderFileField('Fire Safety Certificate', data.fire_safety_certificate)}
//                   {renderFileField('Lift Permit', data.lift_permit)}
//                   {renderFileField('Parking Layout Plan', data.parking_layout_plan)}
//                 </>
//               )}
//               {inquiry.sub_service === 'Renovation and Remodeling Services' && (
//                 <>
//                   {renderFileField('Owner Permission Letter', data.owner_permission_letter)}
//                   {renderFileField('Existing Structure Analysis', data.existing_structure_analysis)}
//                   {renderFileField('Renovation Plan', data.renovation_plan)}
//                   {renderFileField('NOC from Municipality', data.noc_municipality)}
//                   {renderFileField('Waste Management Plan', data.waste_management_plan)}
//                 </>
//               )}
//             </>
//           )}
//           {inquiry.category === 'Post-Construction Maintenance' && (
//             <>
//               {renderFileField('Maintenance Photos', data.maintenance_photos)}
//             </>
//           )}
//           {inquiry.category === 'Safety and Training Services' && inquiry.certificate && (
//             <>
//               {renderFileField('Certificate', inquiry.certificate)}
//             </>
//           )}
//         </Box>
//         {/* Additional Details */}
//         {inquiry.category === 'Engineering Consulting' && (
//           <Box sx={{ mb: 3 }}>
//             <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
//               Additional Details
//             </Typography>
//             {renderField('Type of Building', data.type_of_building)}
//             {renderField('Building Purpose', data.building_purpose)}
//             {renderField('Number of Floors', data.num_floors)}
//             {renderField('Land Area', data.land_area)}
//             {renderField('Architectural Style', data.architectural_style)}
//             {renderField('Other Architectural Style', data.architectural_style_other)}
//             {renderField('Budget Estimate', data.budget_estimate)}
//             {renderField('Special Requirements', data.special_requirements)}
//           </Box>
//         )}
//         {inquiry.category === 'Building Construction Services' && (
//           <Box sx={{ mb: 3 }}>
//             <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
//               Additional Details
//             </Typography>
//             {inquiry.sub_service === 'Residential Construction' && (
//               <>
//                 {renderField('Permit Application Date', data.permit_application_date)}
//                 {renderField('Construction Start Date', data.construction_start_date)}
//                 {renderField('Inspection Dates', data.inspection_dates && data.inspection_dates.length > 0 ? data.inspection_dates.join(', ') : null)}
//                 {renderField('Completion Certificate Application Date', data.completion_certificate_application_date)}
//                 {renderField('Handover Date', data.handover_date)}
//                 {renderField('Warranty Details', data.warranty_details)}
//               </>
//             )}
//             {inquiry.sub_service === 'Commercial Construction' && (
//               <>
//                 {renderField('Special Requirements', data.commercial_special_requirements)}
//               </>
//             )}
//             {inquiry.sub_service === 'Renovation and Remodeling Services' && (
//               <>
//                 {renderField('Type of Building', data.type_of_building)}
//                 {renderField('Existing Building Details', data.existing_building_details)}
//                 {renderField('Area to Renovate', data.area_to_renovate)}
//                 {renderField('Budget Estimate', data.budget_estimate)}
//                 {renderField('Special Requirements', data.renovation_special_requirements)}
//               </>
//             )}
//           </Box>
//         )}
//         {inquiry.category === 'Post-Construction Maintenance' && (
//           <Box sx={{ mb: 3 }}>
//             <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
//               Additional Details
//             </Typography>
//             {renderField('Maintenance Type', data.maintenance_type)}
//             {renderField('Maintenance Details', data.maintenance_details)}
//             {renderField('Preferred Date', data.preferred_date)}
//             {renderField('Preferred Time', data.preferred_time)}
//             {renderField('Payment Agreed', data.payment_agreed ? 'Yes' : 'No')}
//           </Box>
//         )}
//         {inquiry.category === 'Safety and Training Services' && (
//           <Box sx={{ mb: 3 }}>
//             <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
//               Additional Details
//             </Typography>
//             {renderField('Language Preference', data.language_preference)}
//             {renderField('Other Language', data.language_preference_other)}
//             {renderField('Training Date', data.training_date)}
//             {renderField('Training Time', data.training_time)}
//             {renderField('Training Agreement', data.training_agreement ? 'Yes' : 'No')}
//             {!inquiry.certificate && inquiry.status === 'Completed' && (
//               <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 2 }}>
//                 Certificate not yet uploaded by the company.
//               </Typography>
//             )}
//           </Box>
//         )}
//         {!['Engineering Consulting', 'Building Construction Services', 'Post-Construction Maintenance', 'Safety and Training Services'].includes(inquiry.category) && (
//           <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
//             No additional details available for this category.
//           </Typography>
//         )}
//         {/* Comments Section */}
//         <Box sx={{ mt: 2 }}>
//           <Typography variant="h6" sx={{ 
//             color: theme.palette.primary.main,
//             fontWeight: 'bold',
//             mb: 2
//           }}>
//             Comments
//           </Typography>
//           {renderComments()}
//           <Box sx={{ display: 'flex', gap: 2, pl: 2 }}>
//             <TextField
//               label="Add Comment"
//               multiline
//               rows={3}
//               value={commentText}
//               onChange={(e) => setCommentText(e.target.value)}
//               fullWidth
//               sx={{ maxWidth: 500 }}
//             />
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => handleAddComment(inquiry.id)}
//               disabled={!commentText}
//             >
//               Submit Comment
//             </Button>
//           </Box>
//           {commentStatus && (
//             <Alert severity={commentStatus.type} sx={{ mt: 2, pl: 2 }}>
//               {commentStatus.message}
//             </Alert>
//           )}
//         </Box>
//       </Box>
//     );
//   };

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//       {/* Add ClientNavbar at the top */}
//       <ClientNavbar
//         wishlist={[]} // Placeholder: Replace with actual wishlist data if available
//         cartItems={[]} // Placeholder: Replace with actual cart data if available
//         onNavigateToProfile={handleNavigateToProfile}
//       />

//       {/* Main content */}
//       <Box sx={{ p: 2, flex: 1, mt: 8 }}>
//         <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
//           <Typography variant="h4" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: 'bold' }}>
//             My Inquiries
//           </Typography>

//           {loading ? (
//             <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//               <CircularProgress size={60} />
//             </Box>
//           ) : error ? (
//             <Typography color="error" sx={{ p: 2, bgcolor: '#ffeeee', borderRadius: 2 }}>
//               {error}
//             </Typography>
//           ) : inquiries.length === 0 ? (
//             <Typography variant="h6" sx={{ p: 2, color: theme.palette.text.secondary }}>
//               No inquiries found
//             </Typography>
//           ) : (
//             <TableContainer component={Paper}>
//               <Table sx={{ minWidth: 650 }} aria-label="inquiries table">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Full Name</TableCell>
//                     <TableCell>Location</TableCell>
//                     <TableCell>Category</TableCell>
//                     <TableCell>Sub-Service</TableCell>
//                     <TableCell>Status</TableCell>
//                     <TableCell>Submitted At</TableCell>
//                     <TableCell>Actions</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {inquiries.map((inquiry) => (
//                     <TableRow key={inquiry.id}>
//                       <TableCell>{inquiry.full_name || 'N/A'}</TableCell>
//                       <TableCell>{inquiry.location || 'N/A'}</TableCell>
//                       <TableCell>{inquiry.category || 'N/A'}</TableCell>
//                       <TableCell>{inquiry.sub_service || 'N/A'}</TableCell>
//                       <TableCell>{inquiry.status || 'N/A'}</TableCell>
//                       <TableCell>{formatDate(inquiry.created_at)}</TableCell>
//                       <TableCell>
//                         <Button
//                           variant="outlined"
//                           color="primary"
//                           onClick={() => handleViewDetails(inquiry)}
//                           disabled={!inquiry.id}
//                         >
//                           View Details
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )}
//         </Paper>

//         {/* Details Dialog */}
//         <Dialog open={openDetails} onClose={handleCloseDetails} maxWidth="md" fullWidth>
//           <DialogTitle>Inquiry Details</DialogTitle>
//           <DialogContent>
//             {selectedInquiry && (
//               <Box sx={{ p: 2 }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                   <PersonIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
//                   <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//                     {selectedInquiry.full_name || 'N/A'}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ pl: 4 }}>
//                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                     <LocationOnIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
//                     {selectedInquiry.location || 'N/A'}
//                   </Typography>
//                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                     <EmailIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
//                     {selectedInquiry.email || 'N/A'}
//                   </Typography>
//                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                     <PhoneIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
//                     {selectedInquiry.phone_number || 'N/A'}
//                   </Typography>
//                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                     <CategoryIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
//                     <strong>Category:</strong> {selectedInquiry.category || 'N/A'}
//                   </Typography>
//                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                     <BuildIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
//                     <strong>Sub-Service:</strong> {selectedInquiry.sub_service || 'N/A'}
//                   </Typography>
//                   {renderDetails(selectedInquiry)}
//                 </Box>
//               </Box>
//             )}
//           </DialogContent>
//         </Dialog>
//       </Box>

//       {/* Footer at the bottom */}
//       <Footer />
//     </Box>
//   );
// };

// export default ClientServices;
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Link,
  TextField,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  LocationOn as LocationOnIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Category as CategoryIcon,
  Build as BuildIcon,
  Visibility as VisibilityIcon,
  GetApp as DownloadIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Footer from "../pages/footer"; // Adjust path if needed
import ClientNavbar from "../components/ClientNavbar"; // Adjust path if needed

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ClientServices = () => {
  const theme = useTheme();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentStatus, setCommentStatus] = useState(null);

  const backendBaseUrl = 'http://127.0.0.1:8000'; // Backend base URL

  const fetchClientInquiries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found. Please log in.');
      }
      const response = await axios.get(`${backendBaseUrl}/api/client-inquiries/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched inquiries:', response.data); // Debug: Log all inquiries
      
      const receivedInquiries = Array.isArray(response.data) ? response.data : [];
      const sortedInquiries = [...receivedInquiries].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      
      setInquiries(sortedInquiries);
    } catch (err) {
      console.error('Error fetching inquiries:', err);
      setError(err.message || 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientInquiries();
    const interval = setInterval(fetchClientInquiries, 60000); // Poll every 60 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const options = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      return new Date(dateString).toLocaleString('en-US', options);
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const handleViewDetails = (inquiry) => {
    console.log('Selected inquiry:', inquiry);
    setSelectedInquiry(inquiry);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedInquiry(null);
    setCommentText('');
    setCommentStatus(null);
  };

  const handleAddComment = async (inquiryId) => {
    if (!commentText) {
      setCommentStatus({ type: 'error', message: 'Please enter a comment' });
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        `${backendBaseUrl}/api/add-client-comment/${inquiryId}/`,
        { comment_text: commentText, company_response: '' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentStatus({ type: 'success', message: response.data.message || 'Comment added successfully!' });
      setCommentText('');
      fetchClientInquiries();
    } catch (err) {
      setCommentStatus({
        type: 'error',
        message: err.response?.data?.error || 'Failed to add comment',
      });
    }
  };

  const handleNavigateToProfile = () => {
    window.location.href = "/client/profile"; // Replace with your profile route
  };

  const renderDetails = (inquiry) => {
    if (!inquiry) return <Typography>No inquiry selected.</Typography>;

    const renderField = (label, value) => (
      value && (
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px' }}>
            {label}:
          </Typography>
          <Typography variant="body2">{value}</Typography>
        </Box>
      )
    );

    const renderFileField = (label, fileUrl) => (
      fileUrl && (
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px' }}>
            {label}:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Link href={fileUrl} target="_blank" sx={{ color: theme.palette.secondary.main }}>
              <VisibilityIcon sx={{ fontSize: 20, mr: 0.5 }} /> View
            </Link>
            <Link href={fileUrl} download sx={{ color: theme.palette.secondary.main }}>
              <DownloadIcon sx={{ fontSize: 20, mr: 0.5 }} /> Download
            </Link>
          </Box>
        </Box>
      )
    );

    const renderFileArrayField = (label, files) => (
      files && files.length > 0 && (
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px', mb: 1 }}>
            {label}:
          </Typography>
          {files.map((file, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, mb: 0.5, pl: 2 }}>
              <Link href={file} target="_blank" sx={{ color: theme.palette.secondary.main }}>
                <VisibilityIcon sx={{ fontSize: 20, mr: 0.5 }} /> View {label} {index + 1}
              </Link>
              <Link href={file} download sx={{ color: theme.palette.secondary.main }}>
                <DownloadIcon sx={{ fontSize: 20, mr: 0.5 }} /> Download
              </Link>
            </Box>
          ))}
        </Box>
      )
    );

    const renderComments = () => {
      if (!inquiry.comments || inquiry.comments.length === 0) {
        return (
          <Typography variant="body2" sx={{ pl: 2, mb: 2, color: theme.palette.text.secondary }}>
            No comments yet.
          </Typography>
        );
      }
      return (
        <Box sx={{ pl: 2, mb: 2 }}>
          {inquiry.comments.map((comment) => (
            <Box key={comment.id} sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                "{comment.comment_text}"
              </Typography>
              {comment.company_response && (
                <Typography variant="body2" sx={{ pl: 2, color: theme.palette.text.secondary }}>
                  Company Response: {comment.company_response}
                </Typography>
              )}
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Added on {formatDate(comment.created_at)}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    };

    const data = inquiry.service_data || {};

    // Pie chart data for progress_percentage
    const pieChartData = {
      labels: ['Completed', 'Remaining'],
      datasets: [
        {
          data: data.progress_percentage != null ? [data.progress_percentage, 100 - data.progress_percentage] : [0, 100],
          backgroundColor: [theme.palette.primary.main, theme.palette.grey[300]],
          borderColor: [theme.palette.primary.dark, theme.palette.grey[500]],
          borderWidth: 1,
        },
      ],
    };

    // Pie chart options for proper labeling
    const pieChartOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            font: {
              size: 14,
            },
            color: theme.palette.text.primary,
          },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context) => `${context.label}: ${context.parsed}%`,
          },
        },
      },
    };

    return (
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>
          {inquiry.category || 'Unknown Category'} Details
        </Typography>
        {/* Progress Overview */}
        {inquiry.category === 'Building Construction Services' && inquiry.sub_service === 'Residential Construction' && (
          <Box sx={{ p: 2, bgcolor: theme.palette.grey[100], borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Construction Progress
            </Typography>
            {renderField('Overall Status', inquiry.status)}
            {data.progress_percentage != null && (
              <Box sx={{ mb: 2, maxWidth: 300, mx: 'auto' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center' }}>
                  Progress Percentage:
                </Typography>
                <Box sx={{ height: 200, display: 'flex', justifyContent: 'center' }}>
                  <Pie data={pieChartData} options={pieChartOptions} />
                </Box>
                <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                  {data.progress_percentage}% Complete
                </Typography>
              </Box>
            )}
            {renderField('Construction Phase', data.construction_phase)}
            {renderField('Permit Status', data.permit_status)}
          </Box>
        )}
        {/* Documents */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Documents
          </Typography>
          {inquiry.category === 'Engineering Consulting' && (
            <>
              {renderFileField('Site Plan', data.site_plan)}
              {renderFileField('Architectural Plan', data.architectural_plan)}
              {renderFileField('Soil Test Report', data.soil_test_report)}
              {renderFileField('Foundation Design', data.foundation_design)}
              {renderFileField('Electrical Plan', data.electrical_plan)}
              {renderFileField('Plumbing Plan', data.plumbing_plan)}
              {renderFileField('HVAC Plan', data.hvac_plan)}
              {renderFileField('Construction Permit', data.construction_permit)}
              {renderFileField('Cost Estimation', data.cost_estimation)}
            </>
          )}
          {inquiry.category === 'Building Construction Services' && (
            <>
              {renderFileField('Lalpurja', data.lalpurja)}
              {renderFileField('Napi Naksa', data.napi_naksa)}
              {renderFileField('Tax Clearance', data.tax_clearance)}
              {renderFileField('Approved Building Drawings', data.approved_building_drawings)}
              {inquiry.sub_service === 'Residential Construction' && (
                <>
                  {renderFileField('Soil Test Report', data.soil_test_report)}
                  {renderFileField('Structural Stability Certificate', data.structural_stability_certificate)}
                  {renderFileField('House Design Approval', data.house_design_approval)}
                  {renderFileField('Neighbour Consent', data.neighbour_consent)}
                  {renderFileField('Permit Document', data.permit_document)}
                  {renderFileArrayField('Progress Photos', data.progress_photos)}
                  {renderFileArrayField('Inspection Reports', data.inspection_reports)}
                  {renderFileField('Completion Certificate', data.completion_certificate)}
                </>
              )}
              {inquiry.sub_service === 'Commercial Construction' && (
                <>
                  {renderFileField('IEE Report', data.iee_report)}
                  {renderFileField('Fire Safety Certificate', data.fire_safety_certificate)}
                  {renderFileField('Lift Permit', data.lift_permit)}
                  {renderFileField('Parking Layout Plan', data.parking_layout_plan)}
                </>
              )}
              {inquiry.sub_service === 'Renovation and Remodeling Services' && (
                <>
                  {renderFileField('Owner Permission Letter', data.owner_permission_letter)}
                  {renderFileField('Existing Structure Analysis', data.existing_structure_analysis)}
                  {renderFileField('Renovation Plan', data.renovation_plan)}
                  {renderFileField('NOC from Municipality', data.noc_municipality)}
                  {renderFileField('Waste Management Plan', data.waste_management_plan)}
                </>
              )}
            </>
          )}
          {inquiry.category === 'Post-Construction Maintenance' && (
            <>
              {renderFileField('Maintenance Photos', data.maintenance_photos)}
            </>
          )}
          {inquiry.category === 'Safety and Training Services' && inquiry.certificate && (
            <>
              {renderFileField('Certificate', inquiry.certificate)}
            </>
          )}
        </Box>
        {/* Additional Details */}
        {inquiry.category === 'Engineering Consulting' && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Additional Details
            </Typography>
            {renderField('Type of Building', data.type_of_building)}
            {renderField('Building Purpose', data.building_purpose)}
            {renderField('Number of Floors', data.num_floors)}
            {renderField('Land Area', data.land_area)}
            {renderField('Architectural Style', data.architectural_style)}
            {renderField('Other Architectural Style', data.architectural_style_other)}
            {renderField('Budget Estimate', data.budget_estimate)}
            {renderField('Special Requirements', data.special_requirements)}
          </Box>
        )}
        {inquiry.category === 'Building Construction Services' && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Additional Details
            </Typography>
            {inquiry.sub_service === 'Residential Construction' && (
              <>
                {renderField('Permit Application Date', data.permit_application_date)}
                {renderField('Construction Start Date', data.construction_start_date)}
                {renderField('Inspection Dates', data.inspection_dates && data.inspection_dates.length > 0 ? data.inspection_dates.join(', ') : null)}
                {renderField('Completion Certificate Application Date', data.completion_certificate_application_date)}
                {renderField('Handover Date', data.handover_date)}
                {renderField('Warranty Details', data.warranty_details)}
              </>
            )}
            {inquiry.sub_service === 'Commercial Construction' && (
              <>
                {renderField('Special Requirements', data.commercial_special_requirements)}
              </>
            )}
            {inquiry.sub_service === 'Renovation and Remodeling Services' && (
              <>
                {renderField('Type of Building', data.type_of_building)}
                {renderField('Existing Building Details', data.existing_building_details)}
                {renderField('Area to Renovate', data.area_to_renovate)}
                {renderField('Budget Estimate', data.budget_estimate)}
                {renderField('Special Requirements', data.renovation_special_requirements)}
              </>
            )}
          </Box>
        )}
        {inquiry.category === 'Post-Construction Maintenance' && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Additional Details
            </Typography>
            {renderField('Maintenance Type', data.maintenance_type)}
            {renderField('Maintenance Details', data.maintenance_details)}
            {renderField('Preferred Date', data.preferred_date)}
            {renderField('Preferred Time', data.preferred_time)}
            {renderField('Payment Agreed', data.payment_agreed ? 'Yes' : 'No')}
          </Box>
        )}
        {inquiry.category === 'Safety and Training Services' && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Additional Details
            </Typography>
            {renderField('Language Preference', data.language_preference)}
            {renderField('Other Language', data.language_preference_other)}
            {renderField('Training Date', data.training_date)}
            {renderField('Training Time', data.training_time)}
            {renderField('Training Agreement', data.training_agreement ? 'Yes' : 'No')}
            {!inquiry.certificate && inquiry.status === 'Completed' && (
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 2 }}>
                Certificate not yet uploaded by the company.
              </Typography>
            )}
          </Box>
        )}
        {!['Engineering Consulting', 'Building Construction Services', 'Post-Construction Maintenance', 'Safety and Training Services'].includes(inquiry.category) && (
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            No additional details available for this category.
          </Typography>
        )}
        {/* Comments Section */}
        <Box>
          <Typography variant="h6" sx={{ 
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            mb: 2
          }}>
            Comments
          </Typography>
          {renderComments()}
          <Box sx={{ display: 'flex', gap: 2, pl: 2 }}>
            <TextField
              label="Add Comment"
              multiline
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              fullWidth
              sx={{ maxWidth: 500 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAddComment(inquiry.id)}
              disabled={!commentText}
            >
              Submit Comment
            </Button>
          </Box>
          {commentStatus && (
            <Alert severity={commentStatus.type} sx={{ mt: 2, pl: 2 }}>
              {commentStatus.message}
            </Alert>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Add ClientNavbar at the top */}
      <ClientNavbar
        wishlist={[]} // Placeholder: Replace with actual wishlist data if available
        cartItems={[]} // Placeholder: Replace with actual cart data if available
        onNavigateToProfile={handleNavigateToProfile}
      />

      {/* Main content */}
      <Box sx={{ p: 2, flex: 1, mt: 8 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
          <Typography variant="h4" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: 'bold' }}>
            My Inquiries
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={60} />
            </Box>
          ) : error ? (
            <Typography color="error" sx={{ p: 2, bgcolor: '#ffeeee', borderRadius: 2 }}>
              {error}
            </Typography>
          ) : inquiries.length === 0 ? (
            <Typography variant="h6" sx={{ p: 2, color: theme.palette.text.secondary }}>
              No inquiries found
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="inquiries table">
                <TableHead>
                  <TableRow>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Sub-Service</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Submitted At</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inquiries.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell>{inquiry.full_name || 'N/A'}</TableCell>
                      <TableCell>{inquiry.location || 'N/A'}</TableCell>
                      <TableCell>{inquiry.category || 'N/A'}</TableCell>
                      <TableCell>{inquiry.sub_service || 'N/A'}</TableCell>
                      <TableCell>{inquiry.status || 'N/A'}</TableCell>
                      <TableCell>{formatDate(inquiry.created_at)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleViewDetails(inquiry)}
                          disabled={!inquiry.id}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Details Dialog */}
        <Dialog open={openDetails} onClose={handleCloseDetails} maxWidth="md" fullWidth>
          <DialogTitle>Inquiry Details</DialogTitle>
          <DialogContent>
            {selectedInquiry && (
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {selectedInquiry.full_name || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ pl: 4 }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                    {selectedInquiry.location || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                    {selectedInquiry.email || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PhoneIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                    {selectedInquiry.phone_number || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CategoryIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                    <strong>Category:</strong> {selectedInquiry.category || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <BuildIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                    <strong>Sub-Service:</strong> {selectedInquiry.sub_service || 'N/A'}
                  </Typography>
                  {renderDetails(selectedInquiry)}
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>

      {/* Footer at the bottom */}
      <Footer />
    </Box>
  );
};

export default ClientServices;