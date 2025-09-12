import React, { useState } from 'react';
import {
  Container,
  Paper,
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
  CardContent
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// Fix: Import loginUser instead of login
import { loginUser, clearError } from '../../store/slices/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  
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
    // Fix: Use loginUser instead of login
    const result = await dispatch(loginUser(formData));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/dashboard');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
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
              {/* Header with Logo */}
              <Box sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                color: 'white',
                textAlign: 'center',
                py: 4,
                px: 3
              }}>
                {/* Logo */}
                <Box sx={{ mb: 2 }}>
                  <img 
                    src="/assets/images/connect.png" 
                    alt="CHARUSAT Connect" 
                    style={{
                      maxHeight: 80,
                      maxWidth: 200,
                      objectFit: 'contain'
                    }}
                    onError={(e) => {
                      // Fallback if logo doesn't load
                      e.target.style.display = 'none';
                    }}
                  />
                  {/* Fallback text logo */}
                  <Typography variant="h4" fontWeight="bold" sx={{ 
                    display: 'none' // Will show if image fails to load
                  }}>
                    CHARUSAT Connect
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Welcome Back!
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Sign in to connect with your fellow CHARUSAT students
                </Typography>
              </Box>

              {/* Login Form */}
              <Box sx={{ p: 4 }}>
                {error && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

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
                          <IconButton
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
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
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                      }
                    }}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In 🚀'}
                  </Button>

                  <Box textAlign="center">
                    <Typography variant="body2" color="textSecondary">
                      Don't have an account?{' '}
                      <Link 
                        component={RouterLink} 
                        to="/register"
                        sx={{ 
                          fontWeight: 'bold',
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
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
  );
};

export default Login;
