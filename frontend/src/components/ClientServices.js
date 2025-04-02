import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Link,
  useTheme,
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

  const fetchClientInquiries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://127.0.0.1:8000/api/company-inquiries/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter for "Safety and Training Services" with status "Completed"
      const filtered = response.data.filter(
        (inquiry) =>
          inquiry.category === 'Safety and Training Services' &&
          inquiry.status === 'Completed'
      );
      setInquiries(filtered);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientInquiries();
  }, []);

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
        {/* Certificate Section */}
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
                Your Certificate:
              </Typography>
              <Link href={inquiry.certificate} target="_blank" sx={{ color: theme.palette.secondary.main }}>
                View/Download
              </Link>
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Certificate not yet uploaded by the company.
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  const renderDetails = (inquiry) => {
    const serviceHandlers = {
      'Workplace Safety Training Modules': renderTrainingInfo(inquiry),
    };

    return serviceHandlers[inquiry.sub_service] || null;
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
          My Completed Services
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
            No completed Safety and Training Services found
          </Typography>
        ) : (
          <List sx={{ width: '100%' }}>
            {inquiries.map((inquiry) => (
              <Card 
                key={inquiry.id}
                sx={{ 
                  mb: 3, 
                  borderRadius: 3,
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
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        Submitted: {formatDate(inquiry.created_at)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default ClientServices;