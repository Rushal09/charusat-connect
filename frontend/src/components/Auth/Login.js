import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  Fade,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { loginUser, clearError } from '../../store/slices/authSlice';
import api from '../../services/api';

// Your actual Google Client ID
const GOOGLE_CLIENT_ID = "938417549173-t8b01867i8tljc9832j2fndp6of1ufdu.apps.googleusercontent.com";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [googleError, setGoogleError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(state => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/dashboard');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Google login handler
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setGoogleLoading(true);
      setGoogleError('');
      
      console.log('✅ Google credential received');
      
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('👤 Decoded user:', decoded.email);

      // Check domain
      if (!decoded.email.endsWith('@charusat.edu.in')) {
        setGoogleError('Please use your CHARUSAT email (@charusat.edu.in)');
        return;
      }

      console.log('📡 Sending to backend...');

      // Send to backend
      const response = await api.post('/api/auth/google-login', {
        token: credentialResponse.credential
      });

      console.log('✅ Backend response:', response.data);

      // Store auth data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Update Redux state
      dispatch(loginUser.fulfilled(response.data));

      console.log('🚀 Redirecting to dashboard...');
      navigate('/dashboard');

    } catch (error) {
      console.error('❌ Google login error:', error);
      console.error('❌ Error response:', error.response?.data);
      
      setGoogleError(
        error.response?.data?.message || 
        'Google login failed. Please try again.'
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error('❌ Google OAuth error:', error);
    setGoogleError('Google authentication failed. Please try again.');
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}>
        <Container maxWidth="sm">
          <Fade in timeout={800}>
            <Card elevation={24} sx={{ 
              borderRadius: 4,
              overflow: 'hidden',
              backdropFilter: 'blur(20px)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)'
            }}>
              <CardContent sx={{ p: 0 }}>
                {/* Header */}
                <Box sx={{
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  color: 'white',
                  textAlign: 'center',
                  py: 4,
                  px: 3
                }}>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    CHARUSAT Connect
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Sign in to connect with your fellow CHARUSAT students
                  </Typography>
                </Box>

                {/* Login Form */}
                <Box sx={{ p: 4 }}>
                  {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {error}
                    </Alert>
                  )}

                  {googleError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {googleError}
                    </Alert>
                  )}

                  {/* Google Login */}
                  <Box sx={{ mb: 3 }}>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      🎓 Use your CHARUSAT email (@charusat.edu.in) for quick access
                    </Alert>
                    
                    <Box display="flex" justifyContent="center">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        theme="outline"
                        size="large"
                        text="signin_with"
                        shape="rectangular"
                        width="320"
                        disabled={googleLoading}
                      />
                    </Box>
                    
                    {googleLoading && (
                      <Typography variant="body2" textAlign="center" sx={{ mt: 2, color: 'primary.main' }}>
                        🚀 Signing you in...
                      </Typography>
                    )}
                  </Box>

                  <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="textSecondary">
                      Or continue with email
                    </Typography>
                  </Divider>

                  {/* Email Form */}
                  <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      label="CHARUSAT Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      sx={{ mb: 3 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="your.name@charusat.edu.in"
                    />

                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      sx={{ mb: 4 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={togglePasswordVisibility} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={isLoading}
                      sx={{
                        mb: 3,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                      }}
                    >
                      {isLoading ? 'Signing In...' : 'Sign In 🚀'}
                    </Button>

                    <Box textAlign="center">
                      <Typography variant="body2" color="textSecondary">
                        Don't have an account?{' '}
                        <Link component={RouterLink} to="/register" sx={{ fontWeight: 'bold' }}>
                          Register here
                        </Link>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Container>
      </Box>
    </GoogleOAuthProvider>
  );
};

export default Login;
