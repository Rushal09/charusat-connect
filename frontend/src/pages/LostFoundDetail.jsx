import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Card, CardContent, CardMedia,
  Chip, Button, Grid, Divider, Stack, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Alert, Paper,
  ImageList, ImageListItem
} from '@mui/material';
import {
  ArrowBack, LocationOn, AccessTime, Person, Email, Phone,
  Category, Description, Flag
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';

export default function LostFoundDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimDialog, setClaimDialog] = useState(false);
  const [claimData, setClaimData] = useState({
    message: '',
    proofDescription: ''
  });
  const [claimLoading, setClaimLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });

  // Fetch item details
  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/lostfound/${id}`);
      setItem(response.data);
      console.log('📋 Item details:', response.data);
    } catch (error) {
      console.error('❌ Error fetching item:', error);
      setAlert({
        show: true,
        message: 'Failed to load item details',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  // Handle claim submission
  const handleClaimSubmit = async () => {
    if (!claimData.message.trim()) {
      setAlert({
        show: true,
        message: 'Please provide a message explaining why this item is yours',
        type: 'warning'
      });
      return;
    }

    try {
      setClaimLoading(true);
      await api.post(`/lostfound/${id}/claim`, claimData);
      
      setAlert({
        show: true,
        message: 'Claim submitted successfully! The item owner will be notified.',
        type: 'success'
      });
      
      setClaimDialog(false);
      setClaimData({ message: '', proofDescription: '' });
      
      // Refresh item to show new claim
      fetchItemDetails();
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.message || 'Failed to submit claim',
        type: 'error'
      });
    } finally {
      setClaimLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canClaim = () => {
    if (!user || !item) return false;
    if (item.user?._id === user.id || item.user === user.id) return false;
    if (item.status === 'resolved') return false;
    
    // Check if user already claimed
    const existingClaim = item.claims?.find(
      claim => claim.claimantId === user.id || claim.claimantId?._id === user.id
    );
    return !existingClaim;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" textAlign="center">Loading item details...</Typography>
      </Container>
    );
  }

  if (!item) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Item not found or has been removed.</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/lostfound')} sx={{ mt: 2 }}>
          Back to List
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Alert */}
      {alert.show && (
        <Alert 
          severity={alert.type} 
          onClose={() => setAlert({ show: false, message: '', type: 'info' })}
          sx={{ mb: 3 }}
        >
          {alert.message}
        </Alert>
      )}

      {/* Back Button */}
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate('/lostfound')}
        sx={{ mb: 3 }}
      >
        Back to Lost & Found
      </Button>

      <Grid container spacing={4}>
        {/* Left Column - Images */}
        <Grid item xs={12} md={6}>
          {item.images && item.images.length > 0 ? (
            <Box>
              {/* Main Image */}
              <Card elevation={3}>
                <CardMedia
                  component="img"
                  height="400"
                  image={`http://localhost:5000${item.images[0].url}`}
                  alt={item.title}
                  sx={{ objectFit: 'cover' }}
                />
              </Card>
              
              {/* Additional Images */}
              {item.images.length > 1 && (
                <ImageList cols={3} gap={8} sx={{ mt: 2 }}>
                  {item.images.slice(1).map((image, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={`http://localhost:5000${image.url}`}
                        alt={`${item.title} - ${index + 2}`}
                        style={{ 
                          height: 120, 
                          objectFit: 'cover',
                          borderRadius: 8,
                          cursor: 'pointer'
                        }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
            </Box>
          ) : (
            <Paper 
              sx={{ 
                height: 400, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#f5f5f5'
              }}
            >
              <Typography variant="h6" color="textSecondary">No images available</Typography>
            </Paper>
          )}
        </Grid>

        {/* Right Column - Details */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent sx={{ p: 4 }}>
              {/* Type and Status Badges */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Chip 
                  label={item.type.toUpperCase()} 
                  color={item.type === 'lost' ? 'error' : 'success'}
                  size="large"
                  sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}
                />
                <Chip 
                  label={item.status.toUpperCase()} 
                  variant="outlined"
                  size="large"
                />
              </Box>

              {/* Title */}
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {item.title}
              </Typography>

              {/* Description */}
              <Box mb={3}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Description color="action" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">Description</Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  {item.description}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Details */}
              <Stack spacing={2}>
                <Box display="flex" alignItems="center">
                  <Category color="action" sx={{ mr: 2, width: 24 }} />
                  <Typography variant="body1">
                    <strong>Category:</strong> {item.category}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                  <LocationOn color="action" sx={{ mr: 2, width: 24 }} />
                  <Typography variant="body1">
                    <strong>Location:</strong> {item.location}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                  <AccessTime color="action" sx={{ mr: 2, width: 24 }} />
                  <Typography variant="body1">
                    <strong>Date:</strong> {formatDate(item.date)}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                  <Person color="action" sx={{ mr: 2, width: 24 }} />
                  <Typography variant="body1">
                    <strong>Posted by:</strong> {item.user?.username || item.contactName}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                  <Email color="action" sx={{ mr: 2, width: 24 }} />
                  <Typography variant="body1">
                    <strong>Contact:</strong> {item.contactEmail}
                  </Typography>
                </Box>

                {item.phone && (
                  <Box display="flex" alignItems="center">
                    <Phone color="action" sx={{ mr: 2, width: 24 }} />
                    <Typography variant="body1">
                      <strong>Phone:</strong> {item.phone}
                    </Typography>
                  </Box>
                )}

                <Box display="flex" alignItems="center">
                  <AccessTime color="action" sx={{ mr: 2, width: 24 }} />
                  <Typography variant="body1">
                    <strong>Posted:</strong> {formatDate(item.createdAt)}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 3 }} />

              {/* Action Buttons */}
              <Box display="flex" gap={2}>
                {canClaim() && (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Flag />}
                    onClick={() => setClaimDialog(true)}
                    fullWidth
                  >
                    Claim This Item
                  </Button>
                )}
                
                {(!user) && (
                  <Alert severity="info" sx={{ width: '100%' }}>
                    <Typography variant="body2">
                      Please log in to claim this item or contact the owner directly.
                    </Typography>
                  </Alert>
                )}

                {(user && item.user?._id === user.id) && (
                  <Alert severity="info" sx={{ width: '100%' }}>
                    <Typography variant="body2">
                      This is your item. You cannot claim your own item.
                    </Typography>
                  </Alert>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Claims Section */}
          {item.claims && item.claims.length > 0 && (
            <Card elevation={3} sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Claims ({item.claims.length})
                </Typography>
                {item.claims.map((claim, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {claim.claimantName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {formatDate(claim.createdAt)} • Status: {claim.status}
                    </Typography>
                    <Typography variant="body2">
                      {claim.message}
                    </Typography>
                    {claim.proofDescription && (
                      <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                        Proof: {claim.proofDescription}
                      </Typography>
                    )}
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Claim Dialog */}
      <Dialog open={claimDialog} onClose={() => setClaimDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Claim This Item</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" paragraph>
            Please provide details about why this item belongs to you.
          </Typography>
          
          <TextField
            fullWidth
            label="Message to Owner"
            multiline
            rows={4}
            value={claimData.message}
            onChange={(e) => setClaimData(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Explain why this item is yours, when/where you lost it, etc."
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Proof Description (Optional)"
            multiline
            rows={3}
            value={claimData.proofDescription}
            onChange={(e) => setClaimData(prev => ({ ...prev, proofDescription: e.target.value }))}
            placeholder="Describe any proof you have (serial numbers, unique features, etc.)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClaimDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleClaimSubmit} 
            variant="contained"
            disabled={claimLoading}
          >
            {claimLoading ? 'Submitting...' : 'Submit Claim'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
