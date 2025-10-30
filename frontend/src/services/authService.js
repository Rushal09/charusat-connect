import api from './api';

const authService = {
  // ✅ Fixed: Changed from /register to /signup to match backend route
  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/signup', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  },

  // ✅ Enhanced: Better error handling and user storage
  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  },

  // ✅ Enhanced: Clear all user data on logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Don't redirect immediately, let the component handle it
    return Promise.resolve();
  },

  // ✅ Enhanced: Check both token and its validity
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    // Optional: Check if token is expired (if you have JWT expiry)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      if (payload.exp && payload.exp < currentTime) {
        // Token expired, clean up
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return false;
      }
      return true;
    } catch (error) {
      // If token parsing fails, assume it's valid (simple token)
      return true;
    }
  },

  // ✅ New: Get current user from localStorage
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('❌ Error parsing user data:', error);
      return null;
    }
  },

  // ✅ New: Get current user profile from backend
  getProfile: async () => {
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      console.error('❌ Profile fetch error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  // ✅ New: Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/api/auth/profile', profileData);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('❌ Profile update error:', error);
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  },

  // ✅ New: Google OAuth login
  googleLogin: async (googleToken) => {
    try {
      const response = await api.post('/api/auth/google', { token: googleToken });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('❌ Google login error:', error);
      throw new Error(error.response?.data?.message || 'Google login failed');
    }
  },

  // ✅ New: Get token for API calls
  getToken: () => {
    return localStorage.getItem('token');
  },

  // ✅ New: Check if user has completed profile setup
  isProfileComplete: () => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    
    // Check if essential profile fields are filled
    return !!(user.profile?.year && user.profile?.branch && user.profile?.semester);
  }
};

export default authService;
