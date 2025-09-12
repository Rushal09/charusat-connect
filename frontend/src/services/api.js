import axios from 'axios';

// Production-ready API URL configuration
const getAPIBaseURL = () => {
  // Check if we're in production (deployed)
  if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL || 'https://your-backend-url.up.railway.app';
  }
  
  // Local development logic (your existing code)
  const hostname = window.location.hostname;
  const port = '5000';
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `http://localhost:${port}`; // For computer
  } else {
    return `http://${hostname}:${port}`; // For mobile (uses same IP)
  }
};

const API_BASE_URL = getAPIBaseURL();

// Debug log to see which URL is being used
console.log('🌐 API Base URL:', API_BASE_URL);
console.log('🖥️ Current hostname:', window.location.hostname);
console.log('🚀 Environment:', process.env.NODE_ENV);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Increased timeout for deployed servers
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Handle auth errors with better error messages
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
      baseURL: error.config?.baseURL
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Enhanced error messages for deployment
    if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
      if (process.env.NODE_ENV === 'production') {
        error.userMessage = 'Cannot connect to server. Please check your internet connection.';
      } else {
        error.userMessage = 'Cannot connect to server. Make sure you\'re on the same WiFi network.';
      }
    } else if (error.code === 'ECONNABORTED') {
      error.userMessage = 'Request timeout. Please check your internet connection.';
    } else if (error.response?.status >= 500) {
      error.userMessage = 'Server error. Please try again later.';
    }
    
    return Promise.reject(error);
  }
);

export default api;
