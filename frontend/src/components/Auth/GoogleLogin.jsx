import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Box, Alert, Typography, Paper } from '@mui/material';
import api from '../../services/api';
import { loginUser } from '../../store/slices/authSlice';

export default function GoogleLoginButton() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError('');
      
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('👤 Google user info:', decoded);

      // Check domain client-side too
      if (!decoded.email.endsWith('@charusat.edu.in')) {
        setError('Please use your CHARUSAT email (@charusat.edu.in)');
        return;
      }

      // Send to backend
      const response = await api.post('/api/auth/google-login', {
        token: credentialResponse.credential
      });

      // Store auth data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Update Redux - use the same action as regular login
      dispatch(loginUser.fulfilled(response.data));

      console.log('✅ Google login successful!');
      navigate('/dashboard');

    } catch (error) {
      console.error('❌ Google login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    console.error('❌ Google login failed');
    setError('Google login failed. Please try again.');
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      
      <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
        <Typography variant="body2">
          🎓 Use your CHARUSAT email (@charusat.edu.in) for quick access
        </Typography>
      </Alert>
      
      <Paper 
        elevation={0} 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          p: 1,
          borderRadius: 3,
          border: '2px solid',
          borderColor: 'divider',
          '&:hover': {
            borderColor: 'primary.main',
            boxShadow: 1
          }
        }}
      >
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap={false}
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
          width="280"
          disabled={loading}
        />
      </Paper>
      
      {loading && (
        <Typography 
          variant="body2" 
          textAlign="center" 
          sx={{ mt: 2, color: 'primary.main', fontWeight: 500 }}
        >
          🚀 Signing you in with Google...
        </Typography>
      )}
    </Box>
  );
}
