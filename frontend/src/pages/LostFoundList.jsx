import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Card, CardContent, Typography, Chip, Box,
  TextField, Select, MenuItem, FormControl, InputLabel,
  Button, Stack, Divider, CardMedia, CircularProgress
} from '@mui/material';
import { Search, LocationOn, AccessTime, Person, Image as ImageIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function LostFoundList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    search: ''
  });

  // Fetch items from API
  const fetchItems = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching items from API...');
      
      const response = await api.get('/lostfound', {
        params: {
          type: filters.type !== 'all' ? filters.type : undefined,
          category: filters.category !== 'all' ? filters.category : undefined,
          q: filters.search || undefined
        }
      });
      
      console.log('✅ Received data:', response.data);
      console.log('📊 Items count:', response.data.length);
      
      // Log image info for each item
      response.data.forEach((item, index) => {
        console.log(`📷 Item ${index + 1} images:`, item.images?.length || 0, item.images);
      });
      
      setItems(response.data);
    } catch (error) {
      console.error('❌ Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Test image loading
  const testImageLoad = (imageUrl) => {
    const fullUrl = `http://localhost:5000${imageUrl}`;
    console.log('🧪 Testing image URL:', fullUrl);
    return fullUrl;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
          Lost & Found Items
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Help fellow students find their lost items
        </Typography>
        
        <Button 
          variant="contained" 
          size="large" 
          onClick={() => navigate('/lostfound/new')}
          sx={{ mt: 2 }}
        >
          Report Lost/Found Item
        </Button>
      </Box>

      {/* Filters */}
      <Box mb={4}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search items..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                label="Type"
              >
                <MenuItem value="all">All Items</MenuItem>
                <MenuItem value="lost">Lost Items</MenuItem>
                <MenuItem value="found">Found Items</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="ID Card">ID Card</MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Books">Books</MenuItem>
                <MenuItem value="Clothing">Clothing</MenuItem>
                <MenuItem value="Accessories">Accessories</MenuItem>
                <MenuItem value="Keys">Keys</MenuItem>
                <MenuItem value="Wallet">Wallet</MenuItem>
                <MenuItem value="Documents">Documents</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={() => setFilters({ type: 'all', category: 'all', search: '' })}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box textAlign="center" py={4}>
          <CircularProgress />
          <Typography variant="h6" mt={2}>Loading items...</Typography>
        </Box>
      )}

      {/* Items List */}
      {!loading && (
        <>
          <Typography variant="h6" gutterBottom>
            {items.length} item{items.length !== 1 ? 's' : ''} found
          </Typography>
          
          {items.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography variant="h5" color="textSecondary" gutterBottom>
                No items found
              </Typography>
              <Typography variant="body1" color="textSecondary" mb={3}>
                Be the first to report a lost or found item!
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/lostfound/new')}
              >
                Report Item
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {items.map((item) => (
                <Grid item xs={12} md={6} lg={4} key={item._id}>
                  <Card 
                    elevation={3}
                    sx={{ 
                      height: '100%', 
                      cursor: 'pointer',
                      '&:hover': { 
                        elevation: 6,
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    onClick={() => navigate(`/lostfound/${item._id}`)}
                  >
                    {/* Image Section */}
                    {item.images && item.images.length > 0 ? (
                      <Box sx={{ position: 'relative', height: 250 }}>
                        <CardMedia
                          component="img"
                          height="250"
                          image={testImageLoad(item.images[0].url)}
                          alt={item.title}
                          sx={{ 
                            objectFit: 'cover',
                            backgroundColor: '#f5f5f5'
                          }}
                          onError={(e) => {
                            console.error('❌ Image failed to load:', item.images[0].url);
                            console.error('❌ Full URL was:', e.target.src);
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                          onLoad={() => {
                            console.log('✅ Image loaded successfully:', item.images[0].url);
                          }}
                        />
                        {/* Fallback placeholder */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: '#f5f5f5',
                            display: 'none', // Hidden by default, shown when image fails
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#999',
                            flexDirection: 'column'
                          }}
                        >
                          <ImageIcon sx={{ fontSize: 48, mb: 1 }} />
                          <Typography variant="body2">Image not available</Typography>
                        </Box>
                        
                        {/* Image count badge */}
                        {item.images.length > 1 && (
                          <Chip
                            label={`+${item.images.length - 1} more`}
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              backgroundColor: 'rgba(0,0,0,0.7)',
                              color: 'white'
                            }}
                          />
                        )}
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          height: 250,
                          backgroundColor: '#f5f5f5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#999',
                          flexDirection: 'column'
                        }}
                      >
                        <ImageIcon sx={{ fontSize: 48, mb: 1 }} />
                        <Typography variant="body2">No image</Typography>
                      </Box>
                    )}

                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      {/* Item Type Badge */}
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Chip 
                          label={item.type.toUpperCase()} 
                          color={item.type === 'lost' ? 'error' : 'success'}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                        <Chip 
                          label={item.status.toUpperCase()} 
                          variant="outlined"
                          size="small"
                        />
                      </Box>

                      {/* Item Title */}
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {item.title}
                      </Typography>

                      {/* Category */}
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        <strong>Category:</strong> {item.category}
                      </Typography>

                      {/* Description */}
                      <Typography variant="body2" paragraph color="text.secondary">
                        {item.description.length > 100 
                          ? `${item.description.substring(0, 100)}...`
                          : item.description
                        }
                      </Typography>

                      <Divider sx={{ my: 2 }} />

                      {/* Details */}
                      <Stack spacing={1}>
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

                        <Box display="flex" alignItems="center">
                          <Person fontSize="small" color="action" />
                          <Typography variant="body2" ml={1}>
                            {item.user?.username || item.contactName}
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Image and Claims Count Footer */}
                      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} pt={2} borderTop="1px solid #eee">
                        <Box>
                          {item.images && item.images.length > 0 && (
                            <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                              📷 {item.images.length} image{item.images.length !== 1 ? 's' : ''}
                            </Typography>
                          )}
                        </Box>
                        
                        <Box>
                          {item.claims && item.claims.length > 0 && (
                            <Typography variant="caption" color="secondary" sx={{ fontWeight: 'bold' }}>
                              💬 {item.claims.length} claim{item.claims.length !== 1 ? 's' : ''}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
}
