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
  Visibility as VisibilityIcon,
  GetApp as DownloadIcon,
} from '@mui/icons-material';
import axios from 'axios';

const InquiriesList = ({ inquiries: initialInquiries, lastInquiryCheck, clickable }) => {
  const theme = useTheme();
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
  const [commentText, setCommentText] = useState('');
  const [commentStatus, setCommentStatus] = useState(null);
  const [progressPhotos, setProgressPhotos] = useState(null);
  const [inspectionReports, setInspectionReports] = useState(null);
  const [completionCertificate, setCompletionCertificate] = useState(null);
  const [inquiry, set_Inquiries] = useState(clickable);
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState(null);
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  // States for construction progress updates
  const [constructionPhase, setConstructionPhase] = useState({});
  const [progressPercentage, setProgressPercentage] = useState({});
  const [permitStatus, setPermitStatus] = useState({});
  const [updateStatus, setUpdateStatus] = useState(null);

  const backendBaseUrl = 'http://127.0.0.1:8000'; // Backend base URL

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${backendBaseUrl}/api/company-inquiries/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sorted = response.data.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      setInquiries(sorted);
      setFilteredInquiries(sorted);
      // Initialize construction progress states
      const phaseInit = {};
      const percentageInit = {};
      const permitInit = {};
      sorted.forEach((inquiry) => {
        const serviceData = inquiry.service_data || {};
        phaseInit[inquiry.id] = serviceData.construction_phase || '';
        percentageInit[inquiry.id] = serviceData.progress_percentage || '';
        permitInit[inquiry.id] = serviceData.permit_status || '';
      });
      setConstructionPhase(phaseInit);
      setProgressPercentage(percentageInit);
      setPermitStatus(permitInit);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(inquiry);
    fetchInquiries();
  }, [inquiry]);

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
        `${backendBaseUrl}/api/update-inquiry-status/${inquiryId}/`,
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
        inquiry_id: selectedInquiry.id
      };

      await axios.post(
        `${backendBaseUrl}/api/send-training-email/`,
        emailData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEmailStatus({ type: 'success', message: 'Email sent successfully!' });
      handleCloseEmailDialog();
      fetchInquiries();
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
        `${backendBaseUrl}/api/upload-certificate/${inquiryId}/`,
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

  const handleProgressPhotosUpload = async (inquiryId) => {
    if (!progressPhotos) {
      setEmailStatus({ type: 'error', message: 'Please select progress photos to upload' });
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const formData = new FormData();
      for (let i = 0; i < progressPhotos.length; i++) {
        formData.append('photos', progressPhotos[i]);
      }

      await axios.post(
        `${backendBaseUrl}/api/upload-progress-photos/${inquiryId}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setEmailStatus({ type: 'success', message: 'Progress photos uploaded successfully!' });
      setProgressPhotos(null);
      fetchInquiries();
    } catch (err) {
      setEmailStatus({
        type: 'error',
        message: err.response?.data?.error || 'Failed to upload progress photos',
      });
    }
  };

  const handleInspectionReportsUpload = async (inquiryId) => {
    if (!inspectionReports) {
      setEmailStatus({ type: 'error', message: 'Please select inspection reports to upload' });
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const formData = new FormData();
      for (let i = 0; i < inspectionReports.length; i++) {
        formData.append('reports', inspectionReports[i]);
      }

      await axios.post(
        `${backendBaseUrl}/api/upload-inspection-reports/${inquiryId}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setEmailStatus({ type: 'success', message: 'Inspection reports uploaded successfully!' });
      setInspectionReports(null);
      fetchInquiries();
    } catch (err) {
      setEmailStatus({
        type: 'error',
        message: err.response?.data?.error || 'Failed to upload inspection reports',
      });
    }
  };

  const handleCompletionCertificateUpload = async (inquiryId) => {
    if (!completionCertificate) {
      setEmailStatus({ type: 'error', message: 'Please select a completion certificate to upload' });
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const formData = new FormData();
      formData.append('completion_certificate', completionCertificate);

      await axios.post(
        `${backendBaseUrl}/api/upload-completion-certificate/${inquiryId}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setEmailStatus({ type: 'success', message: 'Completion certificate uploaded successfully!' });
      setCompletionCertificate(null);
      fetchInquiries();
    } catch (err) {
      setEmailStatus({
        type: 'error',
        message: err.response?.data?.error || 'Failed to upload completion certificate',
      });
    }
  };

  const handleAddComment = async (inquiryId) => {
    if (!commentText) {
      setCommentStatus({ type: 'error', message: 'Please enter a comment' });
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        `${backendBaseUrl}/api/add-comment/${inquiryId}/`,
        { comment_text: commentText, company_response: '' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCommentStatus({ type: 'success', message: 'Comment added successfully!' });
      setCommentText('');
      fetchInquiries();
    } catch (err) {
      setCommentStatus({
        type: 'error',
        message: err.response?.data?.error || 'Failed to add comment',
      });
    }
  };

  const handleAddReply = async (commentId) => {
    if (!replyText) {
      setReplyStatus({ type: 'error', message: 'Please enter a reply' });
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      await axios.patch(
        `${backendBaseUrl}/api/update-comment-response/${commentId}/`,
        { company_response: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyStatus({ type: 'success', message: 'Reply added successfully!' });
      setReplyText('');
      setReplyingToCommentId(null);
      fetchInquiries();
    } catch (err) {
      setReplyStatus({
        type: 'error',
        message: err.response?.data?.error || 'Failed to add reply',
      });
    }
  };

  const handleUpdateProgress = async (inquiryId) => {
    if (!constructionPhase[inquiryId] || !progressPercentage[inquiryId] || !permitStatus[inquiryId]) {
      setUpdateStatus({ type: 'error', message: 'Please fill all fields' });
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const data = {
        construction_phase: constructionPhase[inquiryId],
        progress_percentage: parseInt(progressPercentage[inquiryId]),
        permit_status: permitStatus[inquiryId],
      };
      await axios.patch(
        `${backendBaseUrl}/api/update-construction-progress/${inquiryId}/`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUpdateStatus({ type: 'success', message: 'Progress updated successfully!' });
      fetchInquiries();
    } catch (err) {
      setUpdateStatus({
        type: 'error',
        message: err.response?.data?.error || 'Failed to update progress',
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

  const renderConstructionInfo = (inquiry) => {
    const serviceData = inquiry.service_data || {};

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>
          Construction Progress
        </Typography>
        <Box sx={{ pl: 2 }}>
          {/* Status Update Controls */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Update Construction Progress
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Construction Phase</InputLabel>
                <Select
                  value={constructionPhase[inquiry.id] || ''}
                  onChange={(e) =>
                    setConstructionPhase({ ...constructionPhase, [inquiry.id]: e.target.value })
                  }
                  label="Construction Phase"
                >
                  <MenuItem value=""><em>Select Phase</em></MenuItem>
                  <MenuItem value="Foundation">Foundation</MenuItem>
                  <MenuItem value="Walls">Walls</MenuItem>
                  <MenuItem value="Roof">Roof</MenuItem>
                  <MenuItem value="Finishing">Finishing</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Progress Percentage"
                type="number"
                value={progressPercentage[inquiry.id] || ''}
                onChange={(e) =>
                  setProgressPercentage({ ...progressPercentage, [inquiry.id]: e.target.value })
                }
                inputProps={{ min: 0, max: 100 }}
                sx={{ maxWidth: 150 }}
              />
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Permit Status</InputLabel>
                <Select
                  value={permitStatus[inquiry.id] || ''}
                  onChange={(e) =>
                    setPermitStatus({ ...permitStatus, [inquiry.id]: e.target.value })
                  }
                  label="Permit Status"
                >
                  <MenuItem value=""><em>Select Status</em></MenuItem>
                  <MenuItem value="Submitted">Submitted</MenuItem>
                  <MenuItem value="Under Review">Under Review</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleUpdateProgress(inquiry.id)}
                disabled={
                  !constructionPhase[inquiry.id] ||
                  !progressPercentage[inquiry.id] ||
                  !permitStatus[inquiry.id]
                }
              >
                Update Progress
              </Button>
            </Box>
            {updateStatus && (
              <Alert severity={updateStatus.type} sx={{ mb: 2 }}>
                {updateStatus.message}
              </Alert>
            )}
          </Box>
          {/* Documents */}
          {Object.entries({
            'Lalpurja': serviceData.lalpurja,
            'Napi Naksa': serviceData.napi_naksa,
            'Tax Clearance': serviceData.tax_clearance,
            'Approved Building Drawings': serviceData.approved_building_drawings,
            'Soil Test Report': serviceData.soil_test_report,
            'Structural Stability Certificate': serviceData.structural_stability_certificate,
            'House Design Approval': serviceData.house_design_approval,
            'Neighbour Consent': serviceData.neighbour_consent,
          }).map(([key, value]) => (
            value && (
              <Box key={key} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px' }}>
                  {key.toUpperCase()}:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Link href={value} target="_blank" sx={{ color: theme.palette.secondary.main }}>
                    <VisibilityIcon sx={{ fontSize: 20, mr: 0.5 }} /> View
                  </Link>
                  <Link href={value} download sx={{ color: theme.palette.secondary.main }}>
                    <DownloadIcon sx={{ fontSize: 20, mr: 0.5 }} /> Download
                  </Link>
                </Box>
              </Box>
            )
          ))}
          {/* Progress Photos Upload and List */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Progress Photos:
            </Typography>
            {serviceData.progress_photos && serviceData.progress_photos.length > 0 && (
              <Box sx={{ mb: 1, pl: 2 }}>
                {serviceData.progress_photos.map((photo, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ minWidth: '160px' }}>
                      Progress Photo {index + 1}:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Link href={photo} target="_blank" sx={{ color: theme.palette.secondary.main }}>
                        <VisibilityIcon sx={{ fontSize: 20, mr: 0.5 }} /> View
                      </Link>
                      <Link href={photo} download sx={{ color: theme.palette.secondary.main }}>
                        <DownloadIcon sx={{ fontSize: 20, mr: 0.5 }} /> Download
                      </Link>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Input
                type="file"
                multiple
                onChange={(e) => setProgressPhotos(e.target.files)}
                inputProps={{ accept: 'image/*,application/pdf' }}
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleProgressPhotosUpload(inquiry.id)}
                disabled={!progressPhotos}
              >
                Upload Progress Photos
              </Button>
            </Box>
          </Box>
          {/* Inspection Reports Upload and List */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Inspection Reports:
            </Typography>
            {serviceData.inspection_reports && serviceData.inspection_reports.length > 0 && (
              <Box sx={{ mb: 1, pl: 2 }}>
                {serviceData.inspection_reports.map((report, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ minWidth: '160px' }}>
                      Inspection Report {index + 1}:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Link href={report} target="_blank" sx={{ color: theme.palette.secondary.main }}>
                        <VisibilityIcon sx={{ fontSize: 20, mr: 0.5 }} /> View
                      </Link>
                      <Link href={report} download sx={{ color: theme.palette.secondary.main }}>
                        <DownloadIcon sx={{ fontSize: 20, mr: 0.5 }} /> Download
                      </Link>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Input
                type="file"
                multiple
                onChange={(e) => setInspectionReports(e.target.files)}
                inputProps={{ accept: 'application/pdf,image/*' }}
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleInspectionReportsUpload(inquiry.id)}
                disabled={!inspectionReports}
              >
                Upload Inspection Reports
              </Button>
            </Box>
          </Box>
          {/* Completion Certificate Upload and List */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Completion Certificate:
            </Typography>
            {serviceData.completion_certificate && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, pl: 2 }}>
                <Typography variant="body2" sx={{ minWidth: '160px' }}>
                  Completion Certificate:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Link href={serviceData.completion_certificate} target="_blank" sx={{ color: theme.palette.secondary.main }}>
                    <VisibilityIcon sx={{ fontSize: 20, mr: 0.5 }} /> View
                  </Link>
                  <Link href={serviceData.completion_certificate} download sx={{ color: theme.palette.secondary.main }}>
                    <DownloadIcon sx={{ fontSize: 20, mr: 0.5 }} /> Download
                  </Link>
                </Box>
              </Box>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Input
                type="file"
                onChange={(e) => setCompletionCertificate(e.target.files[0])}
                inputProps={{ accept: 'application/pdf,image/*' }}
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleCompletionCertificateUpload(inquiry.id)}
                disabled={!completionCertificate || inquiry.status !== 'Completed'}
              >
                Upload Completion Certificate
              </Button>
            </Box>
          </Box>
          {/* Comments Section */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>
              Comments
            </Typography>
            {inquiry.comments && inquiry.comments.length > 0 ? (
              <Box sx={{ pl: 2, mb: 2 }}>
                {inquiry.comments.map((comment) => (
                  <Box key={comment.id} sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      "{comment.comment_text}"
                    </Typography>
                    {comment.company_response ? (
                      <Typography variant="body2" sx={{ pl: 2, color: theme.palette.text.secondary }}>
                        Response: {comment.company_response}
                      </Typography>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 2, pl: 2, mt: 1 }}>
                        <TextField
                          label="Add Reply"
                          multiline
                          rows={2}
                          value={replyingToCommentId === comment.id ? replyText : ''}
                          onChange={(e) => {
                            setReplyingToCommentId(comment.id);
                            setReplyText(e.target.value);
                          }}
                          fullWidth
                          sx={{ maxWidth: 400 }}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleAddReply(comment.id)}
                          disabled={replyingToCommentId !== comment.id || !replyText}
                        >
                          Submit Reply
                        </Button>
                      </Box>
                    )}
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      Added on {formatDate(comment.created_at)}
                    </Typography>
                    {replyStatus && replyingToCommentId === comment.id && (
                      <Alert severity={replyStatus.type} sx={{ mt: 1, pl: 2 }}>
                        {replyStatus.message}
                      </Alert>
                    )}
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ pl: 2, mb: 2, color: theme.palette.text.secondary }}>
                No comments yet.
              </Typography>
            )}
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
          'IEE Report': serviceData.iee_report,
          'Fire Safety Certificate': serviceData.fire_safety_certificate,
          'Lift Permit': serviceData.lift_permit,
          'Parking Layout Plan': serviceData.parking_layout_plan,
          'Owner Permission Letter': serviceData.owner_permission_letter,
          'Existing Structure Analysis': serviceData.existing_structure_analysis,
          'Renovation Plan': serviceData.renovation_plan,
          'NOC Municipality': serviceData.noc_municipality,
          'Waste Management Plan': serviceData.waste_management_plan,
          'Maintenance Photos': serviceData.maintenance_photos,
        }).map(([key, value]) => (
          value && (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', mb: 1, pl: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: '160px' }}>
                {key.replace(/_/g, ' ').toUpperCase()}:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Link 
                  href={`${backendBaseUrl}${value}`} 
                  target="_blank"
                  sx={{ color: theme.palette.secondary.main }}
                >
                  <VisibilityIcon sx={{ fontSize: 20, mr: 0.5 }} /> View
                </Link>
                <Link 
                  href={`${backendBaseUrl}${value}`} 
                  download
                  sx={{ color: theme.palette.secondary.main }}
                >
                  <DownloadIcon sx={{ fontSize: 20, mr: 0.5 }} /> Download
                </Link>
              </Box>
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
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Link 
                  href={`${backendBaseUrl}${serviceData.maintenance_photos}`} 
                  target="_blank"
                  sx={{ color: theme.palette.secondary.main }}
                >
                  <VisibilityIcon sx={{ fontSize: 20, mr: 0.5 }} /> View
                </Link>
                <Link 
                  href={`${backendBaseUrl}${serviceData.maintenance_photos}`} 
                  download
                  sx={{ color: theme.palette.secondary.main }}
                >
                  <DownloadIcon sx={{ fontSize: 20, mr: 0.5 }} /> Download
                </Link>
              </Box>
            </Box>
          )}
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ 
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            mb: 2
          }}>
            Comments
          </Typography>
          {inquiry.comments && inquiry.comments.length > 0 ? (
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
          ) : (
            <Typography variant="body2" sx={{ pl: 2, mb: 2, color: theme.palette.text.secondary }}>
              No comments yet.
            </Typography>
          )}
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
                <Link href={`${backendBaseUrl}${inquiry.certificate}`} target="_blank" sx={{ color: theme.palette.secondary.main }}>
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
      'Comprehensive Building Planning & Design': renderBuildingInfo,
      'Structural & Geotechnical Consultation': renderDocuments,
      'MEP System Design (Mechanical, Electrical & Plumbing)': renderDocuments,
      'Construction Management & Cost Estimation': renderDocuments,
      'Residential Construction': renderConstructionInfo,
      'Commercial Construction': renderDocuments,
      'Renovation and Remodeling Services': renderDocuments,
      'Post-Construction Maintenance': renderMaintenanceInfo,
      'Workplace Safety Training Modules': renderTrainingInfo,
    };

    const handler = serviceHandlers[inquiry.sub_service];
    return handler ? handler(inquiry) : null;
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
        {commentStatus && (
          <Alert severity={commentStatus.type} sx={{ mb: 2 }}>
            {commentStatus.message}
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
                          <strong>Sub-Service:</strong> {inquiry.sub_service}
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
                          {inquiry.status === 'Scheduled' && inquiry.category === 'Residential Construction' && (
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
                          {inquiry.status === 'Pending' && 
                           inquiry.category === 'Post-Construction Maintenance' && (
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => updateInquiryStatus(inquiry.id, 'Completed')}
                            >
                              Mark as Completed
                            </Button>
                          )}
                          {inquiry.status === 'Pending' && 
                           inquiry.category !== 'Safety and Training Services' && 
                           inquiry.category !== 'Post-Construction Maintenance' && 
                           inquiry.category !== 'Residential Construction' && (
                            <Button
                              variant="contained"
                              color="info"
                              size="small"
                              onClick={() => updateInquiryStatus(inquiry.id, 'Scheduled')}
                            >
                              Reschedule
                            </Button>
                          )}
                          {inquiry.status === 'Scheduled' && inquiry.category !== 'Residential Construction' && (
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