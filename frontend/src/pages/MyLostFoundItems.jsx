import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Card, CardContent, CardMedia,
  Chip, Button, Grid, Tabs, Tab, Stack, Alert, Badge,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  Add, Visibility, Edit, Delete, Person, Email,
  AccessTime, LocationOn, CheckCircle, Cancel
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function MyLostFoundItems() {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  const [tabValue, setTabValue] = useState(0);
  const [myItems, setMyItems] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });

  // Fetch user's items and claims
  const fetchMyData = async () => {
    try {
      setLoading(true);
      const [itemsResponse, claimsResponse] = await Promise.all([
        api.get('/lostfound/my/items'),
        api.get('/lostfound/my/claims')
      ]);
      
      setMyItems(itemsResponse.data);
      setMyClaims(claimsResponse.data);
      console.log('📋 My items:', itemsResponse.data);
      console.log('💬 My claims:', claimsResponse.data);
    } catch (error) {
      console.error('❌ Error fetching my data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyData();
    }
  }, [user]);

  // Handle claim response (approve/reject)
  const handleClaimResponse = async (itemId, claimId, response) => {
    try {
      await api.post(`/lostfound/${itemId}/claim/${claimId}/respond`, {
        response: response // 'approve' or 'reject'
      });
      
      // Refresh data
      fetchMyData();
    } catch (error) {
      console.error('❌ Error responding to claim:', error);
    }
  };

  // Handle item deletion
  const handleDeleteItem = async () => {
    try {
      await api.delete(`/lostfound/${deleteDialog.item._id}`);
      setDeleteDialog({ open: false, item: null });
      fetchMyData(); // Refresh list
    } catch (error) {
      console.error('❌ Error deleting item:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPendingClaimsCount = (item) => {
    return item.claims?.filter(claim => claim.status === 'pending').length || 0;
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Please log in to view your items and claims.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          My Lost & Found Items
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/lostfound/new')}
        >
          Report New Item
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab 
            label={
              <Badge badgeContent={myItems.length} color="primary">
                My Items
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={myClaims.length} color="secondary">
                My Claims
              </Badge>
            } 
          />
        </Tabs>
      </Box>

      {/* My Items Tab */}
      <TabPanel value={tabValue} index={0}>
        {loading ? (
          <Typography textAlign="center">Loading your items...</Typography>
        ) : myItems.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              You haven't posted any items yet
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={() => navigate('/lostfound/new')}
            >
              Report Your First Item
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {myItems.map((item) => (
              <Grid item xs={12} md={6} lg={4} key={item._id}>
                <Card elevation={3}>
                  {/* Image */}
                  {item.images && item.images.length > 0 ? (
                    <CardMedia
                      component="img"
                      height="200"
                      image={`http://localhost:5000${item.images[0].url}`}
                      alt={item.title}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 200,
                        backgroundColor: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography color="textSecondary">No Image</Typography>
                    </Box>
                  )}

                  <CardContent>
                    {/* Status and Type */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Chip 
                        label={item.type.toUpperCase()} 
                        color={item.type === 'lost' ? 'error' : 'success'}
                        size="small"
                      />
                      <Chip 
                        label={item.status.toUpperCase()} 
                        variant="outlined"
                        size="small"
                      />
                    </Box>

                    {/* Title and Category */}
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {item.category}
                    </Typography>

                    {/* Location and Date */}
                    <Stack spacing={1} mb={2}>
                      <Box display="flex" alignItems="center">
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2" ml={1}>
                          {item.location}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <AccessTime fontSize="small" color="action" />
                        <Typography variant="body2" ml={1}>
                          {formatDate(item.date)}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Claims Badge */}
                    {getPendingClaimsCount(item) > 0 && (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        <Typography variant="body2">
                          {getPendingClaimsCount(item)} pending claim{getPendingClaimsCount(item) !== 1 ? 's' : ''}
                        </Typography>
                      </Alert>
                    )}

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => navigate(`/lostfound/${item._id}`)}
                      >
                        View
                      </Button>
                      {item.status === 'open' && (
                        <Button
                          size="small"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => setDeleteDialog({ open: true, item })}
                        >
                          Delete
                        </Button>
                      )}
                    </Stack>

                    {/* Claims Section */}
                    {item.claims && item.claims.length > 0 && (
                      <Box mt={2} pt={2} borderTop="1px solid #eee">
                        <Typography variant="subtitle2" gutterBottom>
                          Claims ({item.claims.length})
                        </Typography>
                        {item.claims.slice(0, 2).map((claim, index) => (
                          <Box key={index} sx={{ mb: 1, p: 1, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                            <Typography variant="body2" fontWeight="bold">
                              {claim.claimantName}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {claim.status} • {formatDate(claim.createdAt)}
                            </Typography>
                            <Typography variant="body2" noWrap>
                              {claim.message}
                            </Typography>
                            
                            {claim.status === 'pending' && (
                              <Stack direction="row" spacing={1} mt={1}>
                                <Button
                                  size="small"
                                  color="success"
                                  startIcon={<CheckCircle />}
                                  onClick={() => handleClaimResponse(item._id, claim._id, 'approve')}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="small"
                                  color="error"
                                  startIcon={<Cancel />}
                                  onClick={() => handleClaimResponse(item._id, claim._id, 'reject')}
                                >
                                  Reject
                                </Button>
                              </Stack>
                            )}
                          </Box>
                        ))}
                        {item.claims.length > 2 && (
                          <Button 
                            size="small" 
                            onClick={() => navigate(`/lostfound/${item._id}`)}
                          >
                            View all {item.claims.length} claims
                          </Button>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {/* My Claims Tab */}
      <TabPanel value={tabValue} index={1}>
        {loading ? (
          <Typography textAlign="center">Loading your claims...</Typography>
        ) : myClaims.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              You haven't claimed any items yet
            </Typography>
            <Button 
              variant="contained"
              onClick={() => navigate('/lostfound')}
            >
              Browse Lost & Found Items
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {myClaims.map((item) => {
              const myClaim = item.myClaim;
              return (
                <Grid item xs={12} md={6} lg={4} key={item._id}>
                  <Card elevation={3}>
                    {/* Image */}
                    {item.images && item.images.length > 0 ? (
                      <CardMedia
                        component="img"
                        height="200"
                        image={`http://localhost:5000${item.images[0].url}`}
                        alt={item.title}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 200,
                          backgroundColor: '#f5f5f5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Typography color="textSecondary">No Image</Typography>
                      </Box>
                    )}

                    <CardContent>
                      {/* Item Type and Claim Status */}
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Chip 
                          label={item.type.toUpperCase()} 
                          color={item.type === 'lost' ? 'error' : 'success'}
                          size="small"
                        />
                        <Chip 
                          label={myClaim?.status?.toUpperCase() || 'UNKNOWN'} 
                          color={
                            myClaim?.status === 'approved' ? 'success' :
                            myClaim?.status === 'rejected' ? 'error' : 'warning'
                          }
                          size="small"
                        />
                      </Box>

                      {/* Title and Owner */}
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Owner: {item.user?.username}
                      </Typography>

                      {/* My Claim Details */}
                      <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Your Claim
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          {myClaim?.message}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Submitted: {formatDate(myClaim?.createdAt)}
                        </Typography>
                      </Box>

                      {/* Action Button */}
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() => navigate(`/lostfound/${item._id}`)}
                        sx={{ mt: 2 }}
                      >
                        View Item
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </TabPanel>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, item: null })}>
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.item?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, item: null })}>
            Cancel
          </Button>
          <Button onClick={handleDeleteItem} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
