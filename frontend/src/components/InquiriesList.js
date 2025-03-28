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
  Button
} from '@mui/material';
import {
  Person as PersonIcon,
  LocationOn as LocationOnIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Category as CategoryIcon,
  Build as BuildIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InquiriesList = ({ inquiries: initialInquiries, lastInquiryCheck }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState(initialInquiries || []);
  const [loading, setLoading] = useState(!initialInquiries);
  const [error, setError] = useState('');

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://127.0.0.1:8000/api/company-inquiries/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const sorted = response.data.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      setInquiries(sorted);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialInquiries) fetchInquiries();
  }, []);

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

  const renderBuildingInfo = (inquiry) => (
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
          ['Type of Building', inquiry.type_of_building],
          ['Building Purpose', inquiry.building_purpose],
          ['Number of Floors', inquiry.num_floors],
          ['Land Area', inquiry.land_area],
          ['Architectural Style', inquiry.architectural_style],
          ['Budget Estimate', inquiry.budget_estimate],
          ['Special Requirements', inquiry.special_requirements]
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

  const renderDocuments = (docs) => (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ 
        color: theme.palette.primary.main,
        fontWeight: 'bold',
        mb: 2
      }}>
        Uploaded Documents
      </Typography>
      {Object.entries(docs).map(([key, value]) => (
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

  const renderDetails = (inquiry) => {
    const serviceHandlers = {
      'Comprehensive Building Planning & Design': renderBuildingInfo(inquiry),
      'Structural & Geotechnical Consultation': renderDocuments({
        'Site Plan': inquiry.site_plan,
        'Architectural Plan': inquiry.architectural_plan,
        'Soil Test Report': inquiry.soil_test_report,
        'Foundation Design': inquiry.foundation_design
      }),
      'MEP System Design (Mechanical, Electrical & Plumbing)': renderDocuments({
        'Electrical Plan': inquiry.electrical_plan,
        'Plumbing Plan': inquiry.plumbing_plan,
        'HVAC Plan': inquiry.hvac_plan
      }),
      'Construction Management & Cost Estimation': renderDocuments({
        'Construction Permit': inquiry.construction_permit,
        'Cost Estimation': inquiry.cost_estimation
      })
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
          mb: 4, 
          color: theme.palette.primary.main,
          fontWeight: 'bold'
        }}>
          Client Inquiries
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
          <List sx={{ width: '100%' }}>
            {inquiries.map((inquiry) => {
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
                      {/* Contact Info */}
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

                      {/* Service Details */}
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

                      {/* Dynamic Details */}
                      {renderDetails(inquiry)}

                      {/* Status and Dates */}
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
                          {inquiry.status === 'Pending' && (
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
    </Box>
  );
};

export default InquiriesList;