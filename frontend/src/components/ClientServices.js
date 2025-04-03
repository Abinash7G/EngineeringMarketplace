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
// } from '@mui/material';
// import {
//   Person as PersonIcon,
//   LocationOn as LocationOnIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   Category as CategoryIcon,
//   Build as BuildIcon,
// } from '@mui/icons-material';
// import axios from 'axios';

// const ClientServices = () => {
//   const theme = useTheme();
//   const [inquiries, setInquiries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [openDetails, setOpenDetails] = useState(false);
//   const [selectedInquiry, setSelectedInquiry] = useState(null);

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
//       console.log('Fetched inquiries:', response.data); // Check this in browser console
      
//       // Ensure we're working with an array
//       const receivedInquiries = Array.isArray(response.data) ? response.data : [];
      
//       // Sort inquiries by created_at in descending order (newest first)
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
//     console.log('Selected inquiry:', inquiry); // Debug: Log selected inquiry
//     setSelectedInquiry(inquiry);
//     setOpenDetails(true);
//   };

//   const handleCloseDetails = () => {
//     setOpenDetails(false);
//     setSelectedInquiry(null);
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
//           <Link href={fileUrl} target="_blank" sx={{ color: theme.palette.secondary.main }}>
//             View/Download
//           </Link>
//         </Box>
//       )
//     );

//     const data = inquiry.service_data || {};

//     return (
//       <Box sx={{ mt: 2 }}>
//         <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>
//           {inquiry.category || 'Unknown Category'} Details
//         </Typography>
//         {inquiry.category === 'Engineering Consulting' && (
//           <>
//             {renderField('Type of Building', data.type_of_building)}
//             {renderField('Building Purpose', data.building_purpose)}
//             {renderField('Number of Floors', data.num_floors)}
//             {renderField('Land Area', data.land_area)}
//             {renderField('Architectural Style', data.architectural_style)}
//             {renderField('Other Architectural Style', data.architectural_style_other)}
//             {renderField('Budget Estimate', data.budget_estimate)}
//             {renderField('Special Requirements', data.special_requirements)}
//             {renderFileField('Site Plan', data.site_plan)}
//             {renderFileField('Architectural Plan', data.architectural_plan)}
//             {renderFileField('Soil Test Report', data.soil_test_report)}
//             {renderFileField('Foundation Design', data.foundation_design)}
//             {renderFileField('Electrical Plan', data.electrical_plan)}
//             {renderFileField('Plumbing Plan', data.plumbing_plan)}
//             {renderFileField('HVAC Plan', data.hvac_plan)}
//             {renderFileField('Construction Permit', data.construction_permit)}
//             {renderFileField('Cost Estimation', data.cost_estimation)}
//           </>
//         )}
//         {inquiry.category === 'Building Construction Services' && (
//           <>
//             {renderFileField('Lalpurja', data.lalpurja)}
//             {renderFileField('Napi Naksa', data.napi_naksa)}
//             {renderFileField('Tax Clearance', data.tax_clearance)}
//             {renderFileField('Approved Building Drawings', data.approved_building_drawings)}
//             {inquiry.sub_service === 'Residential Construction' && (
//               <>
//                 {renderFileField('Soil Test Report', data.soil_test_report)}
//                 {renderFileField('Structural Stability Certificate', data.structural_stability_certificate)}
//                 {renderFileField('House Design Approval', data.house_design_approval)}
//                 {renderFileField('Neighbour Consent', data.neighbour_consent)}
//               </>
//             )}
//             {inquiry.sub_service === 'Commercial Construction' && (
//               <>
//                 {renderFileField('IEE Report', data.iee_report)}
//                 {renderFileField('Fire Safety Certificate', data.fire_safety_certificate)}
//                 {renderFileField('Lift Permit', data.lift_permit)}
//                 {renderFileField('Parking Layout Plan', data.parking_layout_plan)}
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
//                 {renderFileField('Owner Permission Letter', data.owner_permission_letter)}
//                 {renderFileField('Existing Structure Analysis', data.existing_structure_analysis)}
//                 {renderFileField('Renovation Plan', data.renovation_plan)}
//                 {renderFileField('NOC from Municipality', data.noc_municipality)}
//                 {renderFileField('Waste Management Plan', data.waste_management_plan)}
//               </>
//             )}
//           </>
//         )}
//         {inquiry.category === 'Post-Construction Maintenance' && (
//           <>
//             {renderField('Maintenance Type', data.maintenance_type)}
//             {renderField('Maintenance Details', data.maintenance_details)}
//             {renderFileField('Maintenance Photos', data.maintenance_photos)}
//             {renderField('Preferred Date', data.preferred_date)}
//             {renderField('Preferred Time', data.preferred_time)}
//             {renderField('Payment Agreed', data.payment_agreed ? 'Yes' : 'No')}
//           </>
//         )}
//         {inquiry.category === 'Safety and Training Services' && (
//           <>
//             {renderField('Language Preference', data.language_preference)}
//             {renderField('Other Language', data.language_preference_other)}
//             {renderField('Training Date', data.training_date)}
//             {renderField('Training Time', data.training_time)}
//             {renderField('Training Agreement', data.training_agreement ? 'Yes' : 'No')}
//             {inquiry.certificate && (
//               <Box sx={{ mt: 2 }}>
//                 <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 1 }}>
//                   Certificate
//                 </Typography>
//                 {renderFileField('Your Certificate', inquiry.certificate)}
//               </Box>
//             )}
//             {!inquiry.certificate && inquiry.status === 'Completed' && (
//               <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 2 }}>
//                 Certificate not yet uploaded by the company.
//               </Typography>
//             )}
//           </>
//         )}
//         {!['Engineering Consulting', 'Building Construction Services', 'Post-Construction Maintenance', 'Safety and Training Services'].includes(inquiry.category) && (
//           <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
//             No additional details available for this category.
//           </Typography>
//         )}
//       </Box>
//     );
//   };

//   return (
//     <Box sx={{ p: 2 }}>
//       <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
//         <Typography variant="h4" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: 'bold' }}>
//           My Inquiries
//         </Typography>

//         {loading ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//             <CircularProgress size={60} />
//           </Box>
//         ) : error ? (
//           <Typography color="error" sx={{ p: 2, bgcolor: '#ffeeee', borderRadius: 2 }}>
//             {error}
//           </Typography>
//         ) : inquiries.length === 0 ? (
//           <Typography variant="h6" sx={{ p: 2, color: theme.palette.text.secondary }}>
//             No inquiries found
//           </Typography>
//         ) : (
//           <TableContainer component={Paper}>
//             <Table sx={{ minWidth: 650 }} aria-label="inquiries table">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Full Name</TableCell>
//                   <TableCell>Location</TableCell>
//                   <TableCell>Category</TableCell>
//                   <TableCell>Sub-Service</TableCell>
//                   <TableCell>Status</TableCell>
//                   <TableCell>Submitted At</TableCell>
//                   <TableCell>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {inquiries.map((inquiry) => (
//                   <TableRow key={inquiry.id}>
//                     <TableCell>{inquiry.full_name || 'N/A'}</TableCell>
//                     <TableCell>{inquiry.location || 'N/A'}</TableCell>
//                     <TableCell>{inquiry.category || 'N/A'}</TableCell>
//                     <TableCell>{inquiry.sub_service || 'N/A'}</TableCell>
//                     <TableCell>{inquiry.status || 'N/A'}</TableCell>
//                     <TableCell>{formatDate(inquiry.created_at)}</TableCell>
//                     <TableCell>
//                       <Button
//                         variant="outlined"
//                         color="primary"
//                         onClick={() => handleViewDetails(inquiry)}
//                         disabled={!inquiry.id}
//                       >
//                         View Details
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Paper>

//       {/* Details Dialog */}
//       <Dialog open={openDetails} onClose={handleCloseDetails} maxWidth="md" fullWidth>
//         <DialogTitle>Inquiry Details</DialogTitle>
//         <DialogContent>
//           {selectedInquiry && (
//             <Box sx={{ p: 2 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                 <PersonIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
//                 <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//                   {selectedInquiry.full_name || 'N/A'}
//                 </Typography>
//               </Box>
//               <Box sx={{ pl: 4 }}>
//                 <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                   <LocationOnIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
//                   {selectedInquiry.location || 'N/A'}
//                 </Typography>
//                 <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                   <EmailIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
//                   {selectedInquiry.email || 'N/A'}
//                 </Typography>
//                 <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                   <PhoneIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
//                   {selectedInquiry.phone_number || 'N/A'}
//                 </Typography>
//                 <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                   <CategoryIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
//                   <strong>Category:</strong> {selectedInquiry.category || 'N/A'}
//                 </Typography>
//                 <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                   <BuildIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
//                   <strong>Sub-Service:</strong> {selectedInquiry.sub_service || 'N/A'}
//                 </Typography>
//                 {renderDetails(selectedInquiry)}
//               </Box>
//             </Box>
//           )}
//         </DialogContent>
//       </Dialog>
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
} from '@mui/material';
import {
  Person as PersonIcon,
  LocationOn as LocationOnIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Category as CategoryIcon,
  Build as BuildIcon,
} from '@mui/icons-material';
import axios from 'axios';

const ClientServices = () => {
  const theme = useTheme();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

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
      
      // Ensure we're working with an array
      const receivedInquiries = Array.isArray(response.data) ? response.data : [];
      
      // Sort inquiries by created_at in descending order (newest first)
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
    console.log('Selected inquiry:', inquiry); // Debug: Log selected inquiry
    setSelectedInquiry(inquiry);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedInquiry(null);
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
          <Link href={fileUrl} target="_blank" sx={{ color: theme.palette.secondary.main }}>
            View/Download
          </Link>
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
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Added on {formatDate(comment.created_at)}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    };

    const data = inquiry.service_data || {};

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>
          {inquiry.category || 'Unknown Category'} Details
        </Typography>
        {inquiry.category === 'Engineering Consulting' && (
          <>
            {renderField('Type of Building', data.type_of_building)}
            {renderField('Building Purpose', data.building_purpose)}
            {renderField('Number of Floors', data.num_floors)}
            {renderField('Land Area', data.land_area)}
            {renderField('Architectural Style', data.architectural_style)}
            {renderField('Other Architectural Style', data.architectural_style_other)}
            {renderField('Budget Estimate', data.budget_estimate)}
            {renderField('Special Requirements', data.special_requirements)}
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
              </>
            )}
            {inquiry.sub_service === 'Commercial Construction' && (
              <>
                {renderFileField('IEE Report', data.iee_report)}
                {renderFileField('Fire Safety Certificate', data.fire_safety_certificate)}
                {renderFileField('Lift Permit', data.lift_permit)}
                {renderFileField('Parking Layout Plan', data.parking_layout_plan)}
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
            {renderField('Maintenance Type', data.maintenance_type)}
            {renderField('Maintenance Details', data.maintenance_details)}
            {renderFileField('Maintenance Photos', data.maintenance_photos)}
            {renderField('Preferred Date', data.preferred_date)}
            {renderField('Preferred Time', data.preferred_time)}
            {renderField('Payment Agreed', data.payment_agreed ? 'Yes' : 'No')}
            {/* Comments Section */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ 
                color: theme.palette.primary.main,
                fontWeight: 'bold',
                mb: 2
              }}>
                Comments
              </Typography>
              {renderComments()}
            </Box>
          </>
        )}
        {inquiry.category === 'Safety and Training Services' && (
          <>
            {renderField('Language Preference', data.language_preference)}
            {renderField('Other Language', data.language_preference_other)}
            {renderField('Training Date', data.training_date)}
            {renderField('Training Time', data.training_time)}
            {renderField('Training Agreement', data.training_agreement ? 'Yes' : 'No')}
            {inquiry.certificate && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 1 }}>
                  Certificate
                </Typography>
                {renderFileField('Your Certificate', inquiry.certificate)}
              </Box>
            )}
            {!inquiry.certificate && inquiry.status === 'Completed' && (
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 2 }}>
                Certificate not yet uploaded by the company.
              </Typography>
            )}
          </>
        )}
        {!['Engineering Consulting', 'Building Construction Services', 'Post-Construction Maintenance', 'Safety and Training Services'].includes(inquiry.category) && (
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            No additional details available for this category.
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
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
  );
};

export default ClientServices;