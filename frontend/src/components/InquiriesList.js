import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Avatar,
  Link,
  useTheme,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Input,
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
import { useNavigate } from 'react-router-dom';

const InquiriesList = ({ inquiries: initialInquiries, lastInquiryCheck }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState(initialInquiries || []);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedShift, setSelectedShift] = useState('All');
  const [loading, setLoading] = useState(!initialInquiries);
  const [error, setError] = useState('');
  const [emailStatus, setEmailStatus] = useState(null);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [emailBody, setEmailBody] = useState('');
  const [certificateFile, setCertificateFile] = useState(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://127.0.0.1:8000/api/company-inquiries/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sorted = response.data.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      setInquiries(sorted);
      setFilteredInquiries(sorted);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialInquiries) fetchInquiries();
  }, []);

  const shifts = ['All', ...new Set(
    inquiries
      .filter((inquiry) => inquiry.category === 'Safety and Training Services')
      .map((inquiry) => inquiry.service_data?.training_time)
      .filter((time) => time)
  )];

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    setSelectedShift('All');

    if (category === 'All') {
      setFilteredInquiries(inquiries);
    } else {
      const filtered = inquiries.filter((inquiry) => inquiry.category === category);
      setFilteredInquiries(filtered);
    }
  };

  const handleShiftChange = (event) => {
    const shift = event.target.value;
    setSelectedShift(shift);

    let filtered = inquiries;
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((inquiry) => inquiry.category === selectedCategory);
    }
    if (shift !== 'All') {
      filtered = filtered.filter((inquiry) => inquiry.service_data?.training_time === shift);
    }
    setFilteredInquiries(filtered);
  };

  const categories = ['All', ...new Set(inquiries.map((inquiry) => inquiry.category))];

  const updateInquiryStatus = async (inquiryId, newStatus) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.patch(
        `http://127.0.0.1:8000/api/update-inquiry-status/${inquiryId}/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchInquiries();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update status');
    }
  };

  const handleOpenEmailDialog = (inquiry) => {
    const serviceData = inquiry.service_data || {};
    const defaultEmailBody = `Dear ${inquiry.full_name},

We are pleased to confirm your training session for Workplace Safety Training Modules.

Training Details:
- Date: ${serviceData.training_date || 'N/A'}
- Time: ${serviceData.training_time || 'N/A'}
- Location: ${serviceData.training_location || inquiry.location || 'N/A'}

Please arrive 15 minutes early. Let us know if you have any questions.

Best regards,
[Your Company Name]`;

    setSelectedInquiry(inquiry);
    setEmailBody(defaultEmailBody);
    setOpenEmailDialog(true);
  };

  const handleCloseEmailDialog = () => {
    setOpenEmailDialog(false);
    setSelectedInquiry(null);
    setEmailBody('');
  };

  const sendTrainingEmail = async () => {
    if (!emailBody) {
      setEmailStatus({ type: 'error', message: 'Please enter an email body' });
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const emailData = {
        to_email: selectedInquiry.email,
        full_name: selectedInquiry.full_name,
        email_body: emailBody,
      };

      await axios.post(
        'http://127.0.0.1:8000/api/send-training-email/',
        emailData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEmailStatus({ type: 'success', message: 'Email sent successfully!' });
      handleCloseEmailDialog();
    } catch (err) {
      setEmailStatus({
        type: 'error',
        message: err.response?.data?.error || 'Failed to send email',
      });
    }
  };

  const handleCertificateUpload = async (inquiryId) => {
    if (!certificateFile) {
      setEmailStatus({ type: 'error', message: 'Please select a certificate file to upload' });
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const formData = new FormData();
      formData.append('certificate', certificateFile);

      await axios.post(
        `http://127.0.0.1:8000/api/upload-certificate/${inquiryId}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setEmailStatus({ type: 'success', message: 'Certificate uploaded successfully!' });
      setCertificateFile(null);
      fetchInquiries();
    } catch (err) {
      setEmailStatus({
        type: 'error',
        message: err.response?.data?.error || 'Failed to upload certificate',
      });
    }
  };

  const renderBuildingInfo = (inquiry) => {
    const serviceData = inquiry.service_data || {};
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ 
          color: theme.palette.primary.main,
          fontWeight: 'bold',
          mb: 2
        }}>
          Building Information
        </Typography>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 2,
          pl: 2
        }}>
          {[
            ['Type of Building', serviceData.type_of_building],
            ['Building Purpose', serviceData.building_purpose],
            ['Number of Floors', serviceData.num_floors],
            ['Land Area', serviceData.land_area],
            ['Architectural Style', serviceData.architectural_style],
            ['Budget Estimate', serviceData.budget_estimate],
            ['Special Requirements', serviceData.special_requirements],
          ].map(([label, value], index) => (
            value && (
              <Box key={index} sx={{ display: 'flex', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px' }}>
                  {label}:
                </Typography>
                <Typography variant="body2">
                  {value}
                </Typography>
              </Box>
            )
          ))}
        </Box>
      </Box>
    );
  };

  const renderDocuments = (inquiry) => {
    const serviceData = inquiry.service_data || {};
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ 
          color: theme.palette.primary.main,
          fontWeight: 'bold',
          mb: 2
        }}>
          Uploaded Documents
        </Typography>
        {Object.entries({
          'Site Plan': serviceData.site_plan,
          'Architectural Plan': serviceData.architectural_plan,
          'Soil Test Report': serviceData.soil_test_report,
          'Foundation Design': serviceData.foundation_design,
          'Electrical Plan': serviceData.electrical_plan,
          'Plumbing Plan': serviceData.plumbing_plan,
          'HVAC Plan': serviceData.hvac_plan,
          'Construction Permit': serviceData.construction_permit,
          'Cost Estimation': serviceData.cost_estimation,
          'Lalpurja': serviceData.lalpurja,
          'Napi Naksa': serviceData.napi_naksa,
          'Tax Clearance': serviceData.tax_clearance,
          'Approved Building Drawings': serviceData.approved_building_drawings,
          'Structural Stability Certificate': serviceData.structural_stability_certificate,
          'House Design Approval': serviceData.house_design_approval,
          'Neighbour Consent': serviceData.neighbour_consent,
          'IEE Report': serviceData.iee_report,
          'Fire Safety Certificate': serviceData.fire_safety_certificate,
          'Lift Permit': serviceData.lift_permit,
          'Parking Layout Plan': serviceData.parking_layout_plan,
          'Owner Permission Letter': serviceData.owner_permission_letter,
          'Existing Structure Analysis': serviceData.existing_structure_analysis,
          'Renovation Plan': serviceData.renovation_plan,
          'NOC Municipality': serviceData.noc_municipality,
          'Waste Management Plan': serviceData.waste_management_plan,
        }).map(([key, value]) => (
          value && (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', mb: 1, pl: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px' }}>
                {key.replace(/_/g, ' ').toUpperCase()}:
              </Typography>
              <Link 
                href={`http://127.0.0.1:8000${value}`} 
                target="_blank"
                sx={{ color: theme.palette.secondary.main }}
              >
                Download
              </Link>
            </Box>
          )
        ))}
      </Box>
    );
  };

  const renderMaintenanceInfo = (inquiry) => {
    const serviceData = inquiry.service_data || {};
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ 
          color: theme.palette.primary.main,
          fontWeight: 'bold',
          mb: 2
        }}>
          Maintenance Information
        </Typography>
        <Box sx={{ pl: 2 }}>
          {[
            ['Maintenance Type', serviceData.maintenance_type],
            ['Maintenance Details', serviceData.maintenance_details],
            ['Preferred Date', serviceData.preferred_date],
            ['Preferred Time', serviceData.preferred_time],
            ['Payment Agreed', serviceData.payment_agreed ? 'Yes' : 'No'],
          ].map(([label, value], index) => (
            value && (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px' }}>
                  {label}:
                </Typography>
                <Typography variant="body2">
                  {value}
                </Typography>
              </Box>
            )
          ))}
          {serviceData.maintenance_photos && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px' }}>
                Maintenance Photos:
              </Typography>
              <Link 
                href={`http://127.0.0.1:8000${serviceData.maintenance_photos}`} 
                target="_blank"
                sx={{ color: theme.palette.secondary.main }}
              >
                Download
              </Link>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  const renderTrainingInfo = (inquiry) => {
    const serviceData = inquiry.service_data || {};
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ 
          color: theme.palette.primary.main,
          fontWeight: 'bold',
          mb: 2
        }}>
          Training Information
        </Typography>
        <Box sx={{ pl: 2 }}>
          {[
            ['Language Preference', serviceData.language_preference],
            ['Language Preference (Other)', serviceData.language_preference_other],
            ['Training Date', serviceData.training_date],
            ['Training Time', serviceData.training_time],
            ['Training Location', serviceData.training_location || inquiry.location],
            ['Training Agreement', serviceData.training_agreement ? 'Yes' : 'No'],
          ].map(([label, value], index) => (
            value && (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px' }}>
                  {label}:
                </Typography>
                <Typography variant="body2">
                  {value}
                </Typography>
              </Box>
            )
          ))}
        </Box>
        {inquiry.category === 'Safety and Training Services' && inquiry.status !== 'Completed' && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleOpenEmailDialog(inquiry)}
            >
              Send Email
            </Button>
          </Box>
        )}
        {inquiry.category === 'Safety and Training Services' && inquiry.status !== 'Completed' && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => updateInquiryStatus(inquiry.id, 'Completed')}
            >
              Mark as Completed
            </Button>
          </Box>
        )}
        {inquiry.status === 'Completed' && inquiry.category === 'Safety and Training Services' && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ 
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              mb: 2
            }}>
              Certificate
            </Typography>
            {inquiry.certificate ? (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 2 }}>
                  Certificate Uploaded:
                </Typography>
                <Link href={inquiry.certificate} target="_blank" sx={{ color: theme.palette.secondary.main }}>
                  View/Download
                </Link>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Input
                  type="file"
                  onChange={(e) => setCertificateFile(e.target.files[0])}
                  inputProps={{ accept: 'application/pdf,image/*' }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => handleCertificateUpload(inquiry.id)}
                  disabled={!certificateFile}
                >
                  Upload Certificate
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    );
  };

  const renderDetails = (inquiry) => {
    const serviceHandlers = {
      'Comprehensive Building Planning & Design': renderBuildingInfo(inquiry),
      'Structural & Geotechnical Consultation': renderDocuments(inquiry),
      'MEP System Design (Mechanical, Electrical & Plumbing)': renderDocuments(inquiry),
      'Construction Management & Cost Estimation': renderDocuments(inquiry),
      'Residential Construction': renderDocuments(inquiry),
      'Commercial Construction': renderDocuments(inquiry),
      'Renovation and Remodeling Services': renderDocuments(inquiry),
      'Post-Construction Maintenance': renderMaintenanceInfo(inquiry),
      'Workplace Safety Training Modules': renderTrainingInfo(inquiry),
    };

    return serviceHandlers[inquiry.sub_service] || null;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Scheduled': return 'info';
      case 'Completed': return 'success';
      case 'No-Show': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="h4" sx={{ 
          mb: 2, 
          color: theme.palette.primary.main,
          fontWeight: 'bold'
        }}>
          Client Inquiries
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              label="Filter by Category"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedCategory === 'Safety and Training Services' && (
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Shift</InputLabel>
              <Select
                value={selectedShift}
                onChange={handleShiftChange}
                label="Filter by Shift"
              >
                {shifts.map((shift) => (
                  <MenuItem key={shift} value={shift}>
                    {shift}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

        {emailStatus && (
          <Alert severity={emailStatus.type} sx={{ mb: 2 }}>
            {emailStatus.message}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={60} />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ p: 2, bgcolor: '#ffeeee', borderRadius: 2 }}>
            {error}
          </Typography>
        ) : filteredInquiries.length === 0 ? (
          <Typography variant="h6" sx={{ p: 2, color: theme.palette.text.secondary }}>
            No inquiries found
          </Typography>
        ) : (
          <List sx={{ width: '100%' }}>
            {filteredInquiries.map((inquiry) => {
              const isNew = lastInquiryCheck && 
                new Date(inquiry.created_at) > new Date(lastInquiryCheck);

              return (
                <Card 
                  key={inquiry.id}
                  sx={{ 
                    mb: 3, 
                    borderRadius: 3,
                    borderLeft: isNew ? `4px solid ${theme.palette.error.main}` : 'none',
                    boxShadow: theme.shadows[3],
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: theme.shadows[6]
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: theme.palette.primary.main, 
                        mr: 2,
                        width: 40,
                        height: 40
                      }}>
                        <PersonIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {inquiry.full_name}
                      </Typography>
                      {isNew && (
                        <Chip
                          label="NEW"
                          color="error"
                          size="small"
                          sx={{ 
                            ml: 2,
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            height: 24
                          }}
                        />
                      )}
                    </Box>

                    <Box sx={{ pl: 6 }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOnIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                          {inquiry.location}
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <EmailIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                          {inquiry.email}
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <PhoneIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                          {inquiry.phone_number}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CategoryIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                          <strong>Category:</strong> {inquiry.category}
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <BuildIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                          <strong>Service:</strong> {inquiry.sub_service}
                        </Typography>
                      </Box>

                      {renderDetails(inquiry)}

                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 3,
                        pt: 2,
                        borderTop: `1px solid ${theme.palette.divider}`
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            <strong>Status:</strong>
                          </Typography>
                          <Chip
                            label={inquiry.status}
                            color={getStatusColor(inquiry.status)}
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {inquiry.status === 'Scheduled' && (
                            <>
                              <Button
                                variant="contained"
                                color="warning"
                                size="small"
                                onClick={() => updateInquiryStatus(inquiry.id, 'Pending')}
                              >
                                Mark as Pending
                              </Button>
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => updateInquiryStatus(inquiry.id, 'Completed')}
                              >
                                Mark as Completed
                              </Button>
                            </>
                          )}
                          {inquiry.status === 'Pending' && inquiry.category !== 'Safety and Training Services' && (
                            <Button
                              variant="contained"
                              color="info"
                              size="small"
                              onClick={() => updateInquiryStatus(inquiry.id, 'Scheduled')}
                            >
                              Reschedule
                            </Button>
                          )}
                        </Box>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          Submitted: {formatDate(inquiry.created_at)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </List>
        )}
      </Paper>

      <Dialog open={openEmailDialog} onClose={handleCloseEmailDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Send Email to {selectedInquiry?.full_name}</DialogTitle>
        <DialogContent>
          <TextField
            label="Email Body"
            multiline
            rows={8}
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEmailDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={sendTrainingEmail} color="primary" variant="contained">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InquiriesList;