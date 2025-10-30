import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store/store';

// Auth Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Common/ProtectedRoute';

// Main Pages
import Dashboard from './components/Dashboard/Dashboard';
import ChatLayout from './components/chat/ChatLayout';

// Lost & Found Pages
import LostFoundList from './pages/LostFoundList';
import LostFoundCreate from './pages/LostFoundCreate';
import LostFoundDetail from './pages/LostFoundDetail';
import MyLostFoundItems from './pages/MyLostFoundItems';

// Events & Activities Pages
import EventsPage from './components/Events/EventsPage';
import EventDetail from './components/Events/EventDetail';
import CreateEvent from './components/Events/CreateEvent';
import MyEvents from './components/Events/MyEvents';
import ClubsPage from './components/Clubs/ClubsPage';
import ClubDetail from './components/Clubs/ClubDetail';

// Enhanced Theme with CHARUSAT Connect colors
const theme = createTheme({
  palette: {
    primary: { 
      main: '#2563eb', // Blue
      light: '#60a5fa',
      dark: '#1d4ed8'
    },
    secondary: { 
      main: '#7c3aed', // Purple  
      light: '#a78bfa',
      dark: '#5b21b6'
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff'
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b'
    }
  },
  typography: { 
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 500 },
    button: { fontWeight: 500, textTransform: 'none' }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 24px'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
        }
      }
    }
  }
});

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return !token ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* ========== PUBLIC ROUTES ========== */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* ========== MAIN PROTECTED ROUTES ========== */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatLayout />
                </ProtectedRoute>
              }
            />

            {/* ========== LOST & FOUND ROUTES ========== */}
            <Route
              path="/lostfound"
              element={
                <ProtectedRoute>
                  <LostFoundList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lostfound/new"
              element={
                <ProtectedRoute>
                  <LostFoundCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lostfound/my-items"
              element={
                <ProtectedRoute>
                  <MyLostFoundItems />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lostfound/:id"
              element={
                <ProtectedRoute>
                  <LostFoundDetail />
                </ProtectedRoute>
              }
            />

            {/* ========== EVENTS & ACTIVITIES ROUTES ========== */}
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <EventsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/create"
              element={
                <ProtectedRoute>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/my-events"
              element={
                <ProtectedRoute>
                  <MyEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id"
              element={
                <ProtectedRoute>
                  <EventDetail />
                </ProtectedRoute>
              }
            />

            {/* ========== CLUBS ROUTES ========== */}
            <Route
              path="/clubs"
              element={
                <ProtectedRoute>
                  <ClubsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clubs/:id"
              element={
                <ProtectedRoute>
                  <ClubDetail />
                </ProtectedRoute>
              }
            />

            {/* ========== DEFAULT & FALLBACK ROUTES ========== */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 Route - Future enhancement */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
