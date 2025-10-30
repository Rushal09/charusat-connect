import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, TextField, Button, 
  MenuItem, Grid, Box, Alert, CircularProgress,
  FormControl, InputLabel, Select, Stack, Divider
} from '@mui/material';
import { Add, CloudUpload } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import api from '../services/api';

const categories = [
  'ID Card', 'Electronics', 'Books', 'Clothing', 
  'Accessories', 'Keys', 'Wallet', 'Documents', 'Other'
];

export default function LostFoundCreate() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  
  const [formData, setFormData] = useState({
    type: 'lost', // Default to 'lost'
    title: '',
    category: '',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0], // Today's date
    contactName: user?.username || '',
    contactEmail: user?.email || '',
    phone: ''
  });
  
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        contactName: user.username || prev.contactName,
        contactEmail: user.email || prev.contactEmail
      }));
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }
    
    // Validate file sizes (5MB per file)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`Some files are too large. Maximum size is 5MB per file.`);
      return;
    }
    
    setImages(files);
    if (error) setError('');
  };

  const validateForm = () => {
    const requiredFields = {
      type: 'Type (Lost/Found)',
      title: 'Title',
      category: 'Category',
      description: 'Description',
      location: 'Location',
      date: 'Date',
      contactName: 'Contact Name',
      contactEmail: 'Contact Email'
    };

    const missingFields = [];
    
    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        missingFields.push(label);
      }
    });

    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(', ')}`);
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contactEmail)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Validate title length
    if (formData.title.trim().length < 3) {
      setError('Title must be at least 3 characters long');
      return false;
    }

    // Validate description length
    if (formData.description.trim().length < 10) {
      setError('Description must be at least 10 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }

    if (!user) {
      setError('You must be logged in to create a post. Please login first.');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Add all form fields with trimming
      const fieldsToSubmit = {
        type: formData.type,
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        location: formData.location.trim(),
        date: formData.date,
        contactName: formData.contactName.trim(),
        contactEmail: formData.contactEmail.trim(),
      };

      // Add optional phone if provided
      if (formData.phone && formData.phone.trim()) {
        fieldsToSubmit.phone = formData.phone.trim();
      }

      // Append to FormData
      Object.entries(fieldsToSubmit).forEach(([key, value]) => {
        submitData.append(key, value);
      });

      // Add images
      images.forEach((image) => {
        submitData.append('images', image);
      });

      const response = await api.post('/lostfound', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('✅ Lost & Found item created successfully! Redirecting...');
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/lostfound');
      }, 2000);
      
    } catch (error) {
      let errorMessage = 'Failed to create item. ';
      
      if (error.response?.status === 401) {
        errorMessage += 'Authentication failed. Please login again.';
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.response?.status === 400) {
        errorMessage += error.response.data?.message || 'Invalid data provided.';
      } else if (error.response?.status === 413) {
        errorMessage += 'Files too large. Please use smaller images.';
      } else if (error.response?.status === 404) {
        errorMessage += 'Service temporarily unavailable. Please try again later.';
      } else if (error.message.includes('Network Error')) {
        errorMessage += 'Cannot connect to server. Please check your internet connection.';
      } else if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else {
        errorMessage += 'Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Custom CSS */}
      <style jsx>{`
        .form-paper {
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          background: white;
        }
        
        .type-button {
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          cursor: pointer;
          border: 2px solid #e0e0e0;
          background: white;
        }
        
        .type-button.active {
          border-color: #2196f3;
          background: linear-gradient(135deg, #2196f3, #1976d2);
          color: white;
          transform: scale(1.05);
        }
        
        .submit-button {
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
          color: white;
          border-radius: 12px;
          padding: 16px 32px;
          font-weight: 700;
          font-size: 18px;
          transition: all 0.3s ease;
        }
        
        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
        }
        
        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .image-upload {
          border: 2px dashed #e0e0e0;
          border-radius: 12px;
          padding: 32px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .image-upload:hover {
          border-color: #2196f3;
          background: rgba(33, 150, 243, 0.05);
        }
      `}</style>

      <Paper className="form-paper">
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight="800" color="#2C3E50" gutterBottom>
            Create Lost & Found Post
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Help fellow students by reporting lost or found items
          </Typography>
        </Box>

        {/* Success Alert */}
        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Type Selection */}
          <Box mb={4}>
            <Typography variant="h6" fontWeight="700" mb={2}>
              What happened? *
            </Typography>
            <Stack direction="row" spacing={2}>
              <Box
                className={`type-button ${formData.type === 'lost' ? 'active' : ''}`}
                onClick={() => handleInputChange('type', 'lost')}
              >
                I LOST something
              </Box>
              <Box
                className={`type-button ${formData.type === 'found' ? 'active' : ''}`}
                onClick={() => handleInputChange('type', 'found')}
              >
                I FOUND something
              </Box>
            </Stack>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Form Fields */}
          <Grid container spacing={3}>
            {/* Title */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Title"
                placeholder="e.g., Black iPhone 13"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                helperText={`${formData.title.length}/50 characters`}
                inputProps={{ maxLength: 50 }}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 2 }
                }}
              />
            </Grid>

            {/* Category */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  label="Category"
                  sx={{ borderRadius: 2 }}
                >
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                placeholder="Describe the item in detail... color, brand, distinctive features, etc."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
                helperText={`${formData.description.length}/500 characters (minimum 10)`}
                inputProps={{ maxLength: 500 }}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 2 }
                }}
              />
            </Grid>

            {/* Location */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                placeholder="e.g., Library 2nd floor, Canteen, Parking lot"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 2 }
                }}
              />
            </Grid>

            {/* Date */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 2 }
                }}
              />
            </Grid>

            {/* Contact Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Your Name"
                placeholder="Your full name"
                value={formData.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 2 }
                }}
              />
            </Grid>

            {/* Contact Email */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="email"
                label="Your Email"
                placeholder="your.email@charusat.edu.in"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 2 }
                }}
              />
            </Grid>

            {/* Phone (Optional) */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number (Optional)"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 2 }
                }}
              />
            </Grid>

            {/* Images */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="700" mb={2}>
                Upload Images (Optional, Max 5)
              </Typography>
              <Box
                className="image-upload"
                component="label"
                htmlFor="image-upload"
              >
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <CloudUpload sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                <Typography variant="body1" color="textSecondary">
                  Click to upload images (Max 5MB each)
                </Typography>
                {images.length > 0 && (
                  <Typography variant="body2" color="primary" sx={{ mt: 1, fontWeight: 600 }}>
                    {images.length} image{images.length !== 1 ? 's' : ''} selected
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Submit Button */}
          <Box textAlign="center">
            <Button
              type="submit"
              disabled={loading || !user}
              className="submit-button"
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Add />}
            >
              {loading 
                ? 'Creating Post...' 
                : !user 
                  ? 'Please Login First' 
                  : 'Create Post'
              }
            </Button>
            
            {!user && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                <Button variant="text" onClick={() => navigate('/login')}>
                  Click here to login
                </Button>
              </Typography>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
