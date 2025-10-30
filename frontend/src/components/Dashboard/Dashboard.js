import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Button,
  Avatar,
  IconButton,
  Chip,
  Fade,
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  LogoutOutlined,
  ChatOutlined,
  FindInPageOutlined,
  EventOutlined,
  PollOutlined,
  SchoolOutlined,
  AutoAwesomeOutlined,
  ArrowForward,
  PostAdd,
  CheckCircle,
  Message,
  Notifications,
  LocationOn,
  AccessTime,
  Person,
  Schedule,
  CalendarToday,
  GroupOutlined,
  CurrencyRupee
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import api from '../../services/api';

// Enhanced CHARUSAT Logo Component with New Design
const CharusatLogo = ({ darkMode, size = 100, mobile = false }) => (
  <Box 
    className="logo-container"
    sx={{ 
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: mobile ? 1.5 : 2.5,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-2px) scale(1.02)'
      }
    }}
  >
    {/* Logo Image */}
    <Box 
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '16px',
        overflow: 'hidden',
        background: darkMode 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        padding: mobile ? '4px' : '6px',
        boxShadow: darkMode
          ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
      }}
    >
      <img 
        src="/assets/connect.png"
        alt="CHARUSAT Connect Logo" 
        style={{
          height: `${mobile ? size * 0.7 : size * 0.85}px`,
          width: `${mobile ? size * 0.7 : size * 0.85}px`,
          objectFit: 'contain',
          borderRadius: '12px',
          transition: 'all 0.3s ease'
        }}
      />
      
      {/* Subtle glow effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(255, 107, 53, 0.1) 100%)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </Box>
    
    {/* Enhanced Text Logo */}
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center'
      }}
    >
      {/* CHARUSAT Text */}
      <Typography 
        variant="h2"
        sx={{
          fontSize: mobile ? size * 0.32 : size * 0.42,
          fontWeight: 900,
          lineHeight: 0.85,
          letterSpacing: mobile ? '1px' : '2px',
          fontFamily: '"Montserrat", "Inter", "Roboto", sans-serif',
          background: darkMode
            ? 'linear-gradient(135deg, #ffffff 0%, #e3f2fd 50%, #bbdefb 100%)'
            : 'linear-gradient(135deg, #0d47a1 0%, #1976d2 30%, #2196f3 70%, #42a5f5 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          position: 'relative',
          textShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: darkMode
              ? 'linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)'
              : 'linear-gradient(135deg, #0d47a1 0%, #2196f3 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'blur(8px)',
            opacity: 0.2,
            zIndex: -1
          }
        }}
      >
        CHARUSAT
      </Typography>
      
      {/* Connect Text with Special Styling */}
      <Box sx={{ position: 'relative', marginTop: '-4px' }}>
        <Typography 
          variant="h4"
          sx={{
            fontSize: mobile ? size * 0.16 : size * 0.20,
            fontWeight: 700,
            letterSpacing: mobile ? '3px' : '5px',
            textTransform: 'uppercase',
            fontFamily: '"Inter", "Roboto", sans-serif',
            background: 'linear-gradient(135deg, #e65100 0%, #ff9800 30%, #ffc107 70%, #fff176 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            position: 'relative',
            textShadow: '0 2px 12px rgba(255, 152, 0, 0.4)',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -2,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, #e65100 0%, #ff9800 50%, #ffc107 100%)',
              borderRadius: '1px',
              opacity: 0.7
            }
          }}
        >
          Connect
        </Typography>
        
        {/* Animated decorative dot */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: mobile ? -10 : -14,
            transform: 'translateY(-50%)',
            width: mobile ? 5 : 7,
            height: mobile ? 5 : 7,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e65100 0%, #ffc107 100%)',
            animation: 'pulse 2s ease-in-out infinite',
            boxShadow: '0 0 10px rgba(255, 152, 0, 0.5)'
          }}
        />
      </Box>
      
      {/* Subtle tagline */}
      <Typography 
        variant="caption"
        sx={{
          fontSize: mobile ? size * 0.07 : size * 0.09,
          fontWeight: 600,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
          fontFamily: '"Inter", sans-serif',
          marginTop: mobile ? '2px' : '4px',
          opacity: 0.8
        }}
      >
        Student Platform
      </Typography>
    </Box>
  </Box>
);

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Activity state
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);

  const handleLogout = () => dispatch(logout());

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  // Create dynamic theme
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#2196F3',
      },
      secondary: {
        main: '#FF9800',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f7fa',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
  });

  // Fetch dashboard data including events
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch events data
        setEventsLoading(true);
        try {
          const eventsResponse = await api.get('/api/events?upcoming=true&limit=4');
          if (eventsResponse.data.success) {
            setUpcomingEvents(eventsResponse.data.events);
          }
        } catch (eventsError) {
          console.log('Using sample events data');
          // Sample events data
          setUpcomingEvents([
            {
              _id: '1',
              title: 'Tech Fest 2025',
              category: 'fest',
              organizer: 'Computer Engineering',
              dateTime: { start: new Date('2025-10-15T09:00:00Z') },
              location: { venue: 'Main Auditorium', building: 'Academic Block A' },
              registration: { fee: 100, required: true }
            },
            {
              _id: '2',
              title: 'AI/ML Workshop',
              category: 'workshop',
              organizer: 'Data Science Club',
              dateTime: { start: new Date('2025-09-25T10:00:00Z') },
              location: { venue: 'Computer Lab 1', building: 'IT Block' },
              registration: { fee: 50, required: true }
            },
            {
              _id: '3',
              title: 'Cultural Evening',
              category: 'cultural',
              organizer: 'Cultural Committee',
              dateTime: { start: new Date('2025-10-05T18:00:00Z') },
              location: { venue: 'Open Theatre', building: 'Main Campus' },
              registration: { fee: 0, required: false }
            }
          ]);
        }
        setEventsLoading(false);

        // Existing activity data
        setTimeout(() => {
          setRecentActivity([
            {
              id: 1,
              type: 'post_created',
              title: 'Lost iPhone 14 Pro',
              time: '2 hours ago',
              location: 'Central Library'
            },
            {
              id: 2,
              type: 'claim_received',
              title: 'Someone claimed your wallet',
              time: '5 hours ago',
              location: 'Main Canteen'
            },
            {
              id: 3,
              type: 'message_received',
              title: 'New message in IT Branch chat',
              time: '1 day ago',
              location: 'Chat Room'
            }
          ]);
          
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
        setEventsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper functions
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      workshop: '🔧',
      fest: '🎉',
      seminar: '📚',
      competition: '🏆',
      cultural: '🎭',
      sports: '⚽',
      academic: '🎓',
      club: '👥',
      other: '📅'
    };
    return icons[category] || '📅';
  };

  const features = [
    {
      id: 1,
      title: 'Real-time Chat',
      description: 'Connect instantly with students across all branches in anonymous chat rooms',
      icon: <ChatOutlined sx={{ fontSize: 56 }} />,
      iconBg: '#2196F3',
      action: () => navigate('/chat'),
      badge: 'LIVE NOW!',
      badgeColor: '#4CAF50',
      status: 'active'
    },
    {
      id: 2,
      title: 'Lost & Found',
      description: 'Report lost items and help fellow students find their belongings',
      icon: <FindInPageOutlined sx={{ fontSize: 56 }} />,
      iconBg: '#FF9800',
      action: () => navigate('/lostfound'),
      badge: 'AVAILABLE',
      badgeColor: '#2196F3',
      status: 'active'
    },
    {
      id: 3,
      title: 'College Events',
      description: 'Discover and register for exciting campus events and activities',
      icon: <EventOutlined sx={{ fontSize: 56 }} />,
      iconBg: '#9C27B0',
      action: () => navigate('/events'),
      badge: 'NEW!',
      badgeColor: '#4CAF50',  // Changed from coming-soon to active
      status: 'active'
    },
    {
      id: 4,
      title: 'College Clubs',
      description: 'Join clubs and connect with students who share your interests',
      icon: <GroupOutlined sx={{ fontSize: 56 }} />,
      iconBg: '#E91E63',
      action: () => navigate('/clubs'),
      badge: 'EXPLORE',
      badgeColor: '#FF5722',
      status: 'active'
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'post_created': return <PostAdd color="primary" />;
      case 'claim_received': return <CheckCircle color="success" />;
      case 'message_received': return <Message color="info" />;
      default: return <Notifications />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Enhanced CSS with Dark Mode Support and New Animations */}
      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background: ${darkMode 
            ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%)' 
            : 'linear-gradient(135deg, #f0f4ff 0%, #e3f2fd 50%, #c3cfe2 100%)'
          };
          position: relative;
          transition: all 0.3s ease;
        }
        
        .dashboard-pattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: ${darkMode ? '0.02' : '0.03'};
          background-image: radial-gradient(circle at 2px 2px, ${darkMode ? '#fff' : '#333'} 1px, transparent 0);
          background-size: 40px 40px;
        }
        
        .feature-card {
          height: 380px !important;
          width: 100%;
          border: none;
          border-radius: 28px !important;
          overflow: hidden;
          position: relative;
          background: ${darkMode ? 
            'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)' : 
            'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'
          };
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          box-shadow: ${darkMode 
            ? '0 10px 40px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(255, 255, 255, 0.05)' 
            : '0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(255, 255, 255, 0.8)'
          };
          border: 1px solid ${darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'};
        }
        
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: ${darkMode 
            ? 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(33,150,243,0.08))' 
            : 'linear-gradient(145deg, rgba(255,255,255,0.8), rgba(33,150,243,0.05))'
          };
          opacity: 0;
          transition: all 0.6s ease;
          z-index: 1;
        }
        
        .feature-card:hover::before {
          opacity: 1;
        }
        
        .feature-card:hover {
          transform: translateY(-24px) scale(1.02);
          box-shadow: ${darkMode 
            ? '0 40px 100px rgba(0, 0, 0, 0.6), 0 8px 32px rgba(33, 150, 243, 0.2)' 
            : '0 40px 100px rgba(0, 0, 0, 0.15), 0 8px 32px rgba(33, 150, 243, 0.3)'
          };
          border-color: rgba(33, 150, 243, 0.4);
        }
        
        .feature-card-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 32px !important;
          text-align: center;
          justify-content: space-between;
        }
        
        .feature-icon {
          width: 80px;
          height: 80px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px auto;
          color: white;
          position: relative;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
        }
        
        .feature-card:hover .feature-icon {
          transform: scale(1.2) rotate(5deg);
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.3);
        }
        
        .feature-icon::after {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 26px;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent);
          opacity: 0;
          transition: all 0.6s;
          animation: shimmer 2s ease-in-out infinite;
        }
        
        .feature-card:hover .feature-icon::after {
          opacity: 1;
        }

        .events-card {
          background: ${darkMode ? 
            'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)' : 
            'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'
          };
          border-radius: 20px !important;
          box-shadow: ${darkMode 
            ? '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)' 
            : '0 12px 40px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
          };
          border: 1px solid ${darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'};
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .events-card:hover {
          transform: translateY(-4px);
          box-shadow: ${darkMode 
            ? '0 20px 60px rgba(0, 0, 0, 0.6), 0 8px 32px rgba(156, 39, 176, 0.3)' 
            : '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 32px rgba(156, 39, 176, 0.2)'
          };
        }

        .event-mini-card {
          background: ${darkMode ? 
            'linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%)' : 
            'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
          };
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 12px;
          border: 1px solid ${darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .event-mini-card:hover {
          transform: translateX(8px);
          border-color: ${darkMode ? 'rgba(156, 39, 176, 0.5)' : 'rgba(156, 39, 176, 0.3)'};
          box-shadow: ${darkMode 
            ? '0 8px 24px rgba(156, 39, 176, 0.2)' 
            : '0 8px 24px rgba(156, 39, 176, 0.15)'
          };
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }
        
        .hero-content {
          background: ${darkMode 
            ? 'rgba(20, 20, 20, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)'
          };
          backdrop-filter: blur(30px);
          border-radius: 32px;
          padding: 60px;
          box-shadow: ${darkMode 
            ? '0 32px 100px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
            : '0 32px 100px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
          };
          border: 1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)'};
          position: relative;
          overflow: hidden;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .hero-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #2196F3 0%, #FF9800 25%, #4CAF50 50%, #9C27B0 75%, #E91E63 100%);
          background-size: 300% 100%;
          animation: gradient-flow 3s ease infinite;
        }
        
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .activity-card {
          background: ${darkMode ? 
            'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)' : 
            'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'
          };
          border-radius: 24px;
          box-shadow: ${darkMode 
            ? '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)' 
            : '0 12px 40px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
          };
          border: 1px solid ${darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'};
          overflow: hidden;
          height: 100%;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .status-badge {
          padding: 8px 16px;
          border-radius: 30px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: white;
          display: inline-block;
          margin-bottom: 20px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
          transition: all 0.4s ease;
          position: relative;
        }
        
        .status-badge::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 30px;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        
        .feature-card:hover .status-badge {
          transform: scale(1.1);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
        }
        
        .feature-card:hover .status-badge::before {
          opacity: 1;
          animation: shine 1s ease-in-out;
        }
        
        .action-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-top: 20px;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #1976d2 0%, #2196f3 50%, #42a5f5 100%);
          border: none;
          border-radius: 20px;
          padding: 16px 32px;
          color: white;
          font-weight: 800;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-transform: none;
          font-size: 18px;
          box-shadow: 0 8px 32px rgba(33, 150, 243, 0.4);
          position: relative;
          overflow: hidden;
        }
        
        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }
        
        .btn-primary:hover::before {
          left: 100%;
        }
        
        .btn-primary:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 48px rgba(33, 150, 243, 0.6);
          background: linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #2196f3 100%);
        }
        
        .btn-secondary {
          background: ${darkMode ? 
            'linear-gradient(135deg, #333 0%, #444 100%)' : 
            'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)'
          };
          border: 3px solid ${darkMode ? '#555' : '#E0E0E0'};
          border-radius: 20px;
          padding: 14px 32px;
          color: ${darkMode ? '#fff' : '#666'};
          font-weight: 800;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-transform: none;
          font-size: 18px;
          box-shadow: ${darkMode 
            ? '0 6px 24px rgba(0, 0, 0, 0.3)' 
            : '0 6px 24px rgba(0, 0, 0, 0.08)'
          };
          position: relative;
          overflow: hidden;
        }
        
        .btn-secondary:hover {
          border-color: #2196F3;
          color: #2196F3;
          background: ${darkMode ? 
            'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)' : 
            'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(33, 150, 243, 0.1) 100%)'
          };
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(33, 150, 243, 0.25);
        }
        
        .header-navbar {
          background: ${darkMode 
            ? 'rgba(20, 20, 20, 0.95) !important' 
            : 'rgba(255, 255, 255, 0.95) !important'
          };
          backdrop-filter: blur(30px);
          border-bottom: 1px solid ${darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
          box-shadow: ${darkMode 
            ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
            : '0 8px 32px rgba(0, 0, 0, 0.06)'
          };
          transition: all 0.3s ease;
        }
        
        .feature-title {
          font-size: 1.4rem !important;
          font-weight: 800 !important;
          color: ${darkMode ? '#fff !important' : '#2C3E50 !important'};
          margin-bottom: 16px !important;
          line-height: 1.3 !important;
        }
        
        .feature-description {
          font-size: 0.95rem !important;
          color: ${darkMode ? 'rgba(255,255,255,0.7) !important' : '#7F8C8D !important'};
          line-height: 1.7 !important;
          font-weight: 400 !important;
        }
        
        .action-btn-small {
          background: ${darkMode ? '#333' : 'white'};
          border: 2px solid ${darkMode ? '#555' : '#E0E0E0'};
          border-radius: 16px;
          padding: 10px 20px;
          color: ${darkMode ? '#fff' : '#666'};
          font-weight: 700;
          transition: all 0.3s ease;
          text-transform: none;
          font-size: 14px;
          min-width: 100px;
        }
        
        .action-btn-small:hover {
          border-color: #2196F3;
          color: #2196F3;
          background: rgba(33, 150, 243, 0.05);
          transform: translateY(-2px);
        }
        
        .action-btn-primary-small {
          background: linear-gradient(135deg, #2196F3, #1976D2);
          border: none;
          border-radius: 16px;
          padding: 12px 20px;
          color: white;
          font-weight: 700;
          transition: all 0.3s ease;
          text-transform: none;
          font-size: 14px;
          min-width: 100px;
        }
        
        .action-btn-primary-small:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
        }
        
        @media (max-width: 768px) {
          .hero-content {
            padding: 40px 32px;
            margin: 16px;
            border-radius: 24px;
          }
          
          .feature-card {
            height: 360px !important;
            margin-bottom: 32px;
          }
          
          .feature-card-content {
            padding: 24px !important;
          }
          
          .feature-icon {
            width: 60px;
            height: 60px;
            margin-bottom: 16px;
          }
        }
        
        .fade-up {
          animation: fadeUp 1s ease-out;
        }
        
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(180deg); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { 
            transform: translateY(-50%) scale(1); 
            opacity: 1; 
          }
          50% { 
            transform: translateY(-50%) scale(1.3); 
            opacity: 0.7; 
          }
        }
        
        /* Logo hover effects */
        .logo-container {
          transition: all 0.3s ease;
        }
        
        .logo-container:hover {
          filter: drop-shadow(0 10px 20px rgba(33, 150, 243, 0.3));
        }
      `}</style>

      {/* Header with Enhanced Logo */}
      <AppBar position="sticky" elevation={0} className="header-navbar">
        <Toolbar sx={{ py: 1, px: 1.5, gap: 3, flexWrap: 'wrap' }}>
          {/* Enhanced Logo Section */}
          <Box onClick={() => navigate('/dashboard')}>
            <CharusatLogo darkMode={darkMode} size={90} />
          </Box>
          
          <Box ml="auto" display="flex" alignItems="center" gap={3}>
            {/* Unique Landscape Dark Mode Toggle */}
            <Box 
              sx={{ 
                position: 'relative',
                width: 120,
                height: 60,
                borderRadius: '30px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '3px solid',
                borderColor: darkMode ? '#444' : '#e0e0e0',
                background: darkMode 
                  ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f0f1e 100%)'
                  : 'linear-gradient(180deg, #87CEEB 0%, #98d8f4 50%, #7ec8e3 100%)',
                boxShadow: darkMode
                  ? '0 8px 32px rgba(0,0,0,0.6), inset 0 2px 8px rgba(255,255,255,0.05)'
                  : '0 8px 32px rgba(0,0,0,0.15), inset 0 2px 8px rgba(255,255,255,0.5)',
                '&:hover': {
                  transform: 'scale(1.05)',
                  borderColor: '#2196F3',
                }
              }}
              onClick={toggleDarkMode}
            >
              {/* Background Elements */}
              {darkMode && (
                <>
                  {/* Stars */}
                  <Box sx={{ position: 'absolute', top: 8, left: 15, width: 2, height: 2, borderRadius: '50%', bgcolor: '#fff', animation: 'twinkle 2s ease-in-out infinite' }} />
                  <Box sx={{ position: 'absolute', top: 12, right: 20, width: 1.5, height: 1.5, borderRadius: '50%', bgcolor: '#fff', animation: 'twinkle 2.5s ease-in-out infinite 0.5s' }} />
                  <Box sx={{ position: 'absolute', top: 18, left: 25, width: 1, height: 1, borderRadius: '50%', bgcolor: '#fff', animation: 'twinkle 3s ease-in-out infinite 1s' }} />
                  <Box sx={{ position: 'absolute', top: 6, right: 35, width: 1, height: 1, borderRadius: '50%', bgcolor: '#fff', animation: 'twinkle 2.2s ease-in-out infinite 1.5s' }} />
                  <Box sx={{ position: 'absolute', top: 15, right: 45, width: 1.5, height: 1.5, borderRadius: '50%', bgcolor: '#fff', animation: 'twinkle 2.8s ease-in-out infinite 0.8s' }} />
                </>
              )}

              {!darkMode && (
                <>
                  {/* Clouds */}
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 10, 
                    left: 10, 
                    width: 20, 
                    height: 8, 
                    borderRadius: '10px',
                    bgcolor: 'rgba(255,255,255,0.8)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -4,
                      left: 6,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255,255,255,0.8)'
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: -2,
                      right: 4,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255,255,255,0.8)'
                    }
                  }} />
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 6, 
                    right: 15, 
                    width: 15, 
                    height: 6, 
                    borderRadius: '8px',
                    bgcolor: 'rgba(255,255,255,0.6)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -3,
                      left: 4,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255,255,255,0.6)'
                    }
                  }} />
                </>
              )}

              {/* Sun/Moon */}
              <Box
                sx={{
                  position: 'absolute',
                  top: darkMode ? 8 : 12,
                  left: darkMode ? 15 : 20,
                  width: darkMode ? 20 : 24,
                  height: darkMode ? 20 : 24,
                  borderRadius: '50%',
                  background: darkMode 
                    ? 'radial-gradient(circle at 30% 20%, #f4f4f4 0%, #d1d1d1 70%, #a8a8a8 100%)'
                    : 'radial-gradient(circle at 30% 30%, #ffeb3b 0%, #ffc107 70%, #ff8f00 100%)',
                  transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: 'float 3s ease-in-out infinite',
                  boxShadow: darkMode
                    ? '0 0 20px rgba(255,255,255,0.3), inset -3px -3px 8px rgba(0,0,0,0.3)'
                    : '0 0 30px rgba(255,235,59,0.6), 0 0 50px rgba(255,193,7,0.4)',
                  '&::before': darkMode ? {
                    content: '""',
                    position: 'absolute',
                    top: '15%',
                    left: '20%',
                    width: '25%',
                    height: '25%',
                    borderRadius: '50%',
                    bgcolor: 'rgba(0,0,0,0.2)'
                  } : {
                    content: '""',
                    position: 'absolute',
                    top: -2,
                    left: -2,
                    right: -2,
                    bottom: -2,
                    borderRadius: '50%',
                    background: 'conic-gradient(from 0deg, transparent, rgba(255,235,59,0.3), transparent)',
                    animation: 'spin 4s linear infinite'
                  },
                  '&::after': darkMode ? {
                    content: '""',
                    position: 'absolute',
                    top: '45%',
                    right: '25%',
                    width: '15%',
                    height: '15%',
                    borderRadius: '50%',
                    bgcolor: 'rgba(0,0,0,0.15)'
                  } : {}
                }}
              />

              {/* Mountains/Landscape */}
              <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 20,
                background: darkMode
                  ? 'linear-gradient(45deg, #2c2c54 0%, #40407a 50%, #2c2c54 100%)'
                  : 'linear-gradient(45deg, #4CAF50 0%, #66BB6A 50%, #4CAF50 100%)',
                clipPath: 'polygon(0 100%, 0 60%, 20% 70%, 40% 40%, 60% 55%, 80% 35%, 100% 45%, 100% 100%)',
                transition: 'all 0.8s ease'
              }} />

              {/* Mode Text */}
              <Box sx={{
                position: 'absolute',
                bottom: 2,
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '8px',
                fontWeight: 700,
                color: darkMode ? '#fff' : '#333',
                textShadow: darkMode ? '0 1px 3px rgba(0,0,0,0.8)' : '0 1px 3px rgba(255,255,255,0.8)',
                transition: 'all 0.3s ease'
              }}>
                {darkMode ? 'NIGHT' : 'DAY'}
              </Box>
            </Box>

            <Chip
              label="Student Portal"
              icon={<SchoolOutlined />}
              sx={{
                background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                color: 'white',
                fontWeight: 800,
                fontSize: '14px',
                height: 40,
                '& .MuiChip-icon': { color: 'white' },
                boxShadow: '0 6px 20px rgba(33, 150, 243, 0.35)'
              }}
            />
            <Avatar
              sx={{
                width: 56,
                height: 56,
                background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                fontWeight: 900,
                fontSize: '1.6rem',
                boxShadow: '0 8px 24px rgba(33, 150, 243, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 12px 32px rgba(33, 150, 243, 0.5)'
                }
              }}
            >
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="h6" fontWeight="800" sx={{ color: darkMode ? '#fff' : '#2C3E50' }}>
                {user?.profile?.firstName || user?.username || 'Student'}
              </Typography>
              <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : '#7F8C8D' }} fontWeight="500">
                {user?.email}
              </Typography>
            </Box>
            <IconButton 
              onClick={handleLogout}
              sx={{
                background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(33, 150, 243, 0.1)',
                color: darkMode ? '#fff' : '#2196F3',
                width: 52,
                height: 52,
                transition: 'all 0.3s ease',
                '&:hover': { 
                  background: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(33, 150, 243, 0.2)',
                  transform: 'scale(1.05)'
                }
              }}
            >
              <LogoutOutlined />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box className="dashboard-container">
        <Box className="dashboard-pattern" />
        
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
          {/* Enhanced Hero Section */}
          <Fade in timeout={800}>
            <Box className="hero-content fade-up" sx={{ mb: 6, maxWidth: '900px', mx: 'auto' }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '3rem', md: '4rem' },
                  fontWeight: 900,
                  color: darkMode ? '#fff' : '#2C3E50',
                  mb: 2,
                  lineHeight: 1.1,
                  textShadow: darkMode ? '0 4px 8px rgba(0, 0, 0, 0.5)' : '0 4px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                {getGreeting()},{' '}
                <Box component="span" sx={{ position: 'relative', color: '#2196F3' }}>
                  {user?.profile?.firstName || user?.username}!
                  <AutoAwesomeOutlined
                    sx={{
                      position: 'absolute',
                      top: -16,
                      right: -40,
                      fontSize: 36,
                      color: '#FFD700',
                      animation: 'float 2s ease-in-out infinite'
                    }}
                  />
                </Box>
              </Typography>

              {/* User Info Chips */}
              <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 4 }}>
                <Chip 
                  icon={<Person />}
                  label={user?.profile?.branch || 'Student'} 
                  color="primary" 
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
                <Chip 
                  icon={<Schedule />}
                  label={`Class of ${user?.profile?.year || '2024'}`}
                  color="secondary" 
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Stack>

              <Typography
                variant="h5"
                sx={{
                  color: darkMode ? 'rgba(255,255,255,0.7)' : '#7F8C8D',
                  mb: 6,
                  fontWeight: 400,
                  lineHeight: 1.6,
                  fontSize: '1.3rem',
                  maxWidth: '700px',
                  mx: 'auto'
                }}
              >
                Connect with your fellow CHARUSAT students and explore amazing campus resources in our modern platform.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                <Button
                  className="btn-primary"
                  size="large"
                  startIcon={<ChatOutlined />}
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/chat')}
                  sx={{ px: 6, py: 2.5, fontSize: '1.1rem' }}
                >
                  Start Chatting
                </Button>
                <Button
                  className="btn-secondary"
                  size="large"
                  startIcon={<EventOutlined />}
                  onClick={() => navigate('/events')}
                  sx={{ px: 5, py: 2.5 }}
                >
                  Browse Events
                </Button>
              </Stack>
            </Box>
          </Fade>

          {/* Main Content Grid */}
          <Grid container spacing={4}>
            {/* Features Section - Now taking less space to accommodate events */}
            <Grid item xs={12} lg={7}>
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h3" 
                  fontWeight="900" 
                  textAlign="center"
                  sx={{ color: darkMode ? '#fff' : '#2C3E50', mb: 2 }}
                >
                  Platform Features
                </Typography>
                <Typography 
                  variant="h6" 
                  textAlign="center"
                  sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : '#7F8C8D', mb: 6 }}
                >
                  Powerful tools designed to enhance your college experience
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={feature.id}>
                    <Fade in timeout={1200 + index * 200}>
                      <Card className="feature-card" onClick={feature.action}>
                        <CardContent className="feature-card-content">
                          <Box>
                            <Box
                              className="feature-icon"
                              sx={{ backgroundColor: feature.iconBg }}
                            >
                              {React.cloneElement(feature.icon, { sx: { fontSize: 40 } })}
                            </Box>

                            <Typography className="feature-title" variant="h5">
                              {feature.title}
                            </Typography>

                            <Typography className="feature-description" variant="body2" sx={{ mb: 3 }}>
                              {feature.description}
                            </Typography>
                          </Box>

                          <Box>
                            <Box
                              className="status-badge"
                              sx={{ backgroundColor: feature.badgeColor }}
                            >
                              {feature.badge}
                            </Box>

                            {feature.id === 2 && (
                              <Box className="action-buttons">
                                <Button
                                  className="action-btn-small"
                                  size="small"
                                  onClick={(e) => { e.stopPropagation(); navigate('/lostfound'); }}
                                >
                                  View Items
                                </Button>
                                <Button
                                  className="action-btn-primary-small"
                                  size="small"
                                  onClick={(e) => { e.stopPropagation(); navigate('/lostfound/new'); }}
                                >
                                  Report Item
                                </Button>
                              </Box>
                            )}

                            {feature.id === 3 && (
                              <Box className="action-buttons">
                                <Button
                                  className="action-btn-small"
                                  size="small"
                                  onClick={(e) => { e.stopPropagation(); navigate('/events'); }}
                                >
                                  Browse All
                                </Button>
                                <Button
                                  className="action-btn-primary-small"
                                  size="small"
                                  onClick={(e) => { e.stopPropagation(); navigate('/events/create'); }}
                                >
                                  Create Event
                                </Button>
                              </Box>
                            )}

                            {feature.id === 4 && (
                              <Box className="action-buttons">
                                <Button
                                  className="action-btn-small"
                                  size="small"
                                  onClick={(e) => { e.stopPropagation(); navigate('/clubs'); }}
                                >
                                  Explore
                                </Button>
                                <Button
                                  className="action-btn-primary-small"
                                  size="small"
                                  onClick={(e) => { e.stopPropagation(); navigate('/clubs'); }}
                                >
                                  Join Club
                                </Button>
                              </Box>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Right Sidebar - Events and Activity */}
            <Grid item xs={12} lg={5}>
              <Stack spacing={4}>
                {/* Upcoming Events Section - NEW! */}
                <Fade in timeout={1000}>
                  <Paper className="events-card" sx={{ p: 0 }} onClick={() => navigate('/events')}>
                    <Box sx={{ p: 3, pb: 2 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 2
                      }}>
                        <Typography variant="h5" fontWeight="bold" sx={{ 
                          color: darkMode ? '#fff' : '#2C3E50',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          🎯 Upcoming Events
                        </Typography>
                        <Button 
                          size="small" 
                          sx={{ 
                            color: '#9C27B0',
                            fontWeight: 600,
                            minWidth: 'auto',
                            '&:hover': {
                              background: 'rgba(156, 39, 176, 0.1)'
                            }
                          }}
                          onClick={(e) => { e.stopPropagation(); navigate('/events'); }}
                        >
                          View All →
                        </Button>
                      </Box>
                    </Box>
                    
                    <Box sx={{ px: 3, pb: 3 }}>
                      {eventsLoading ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <CircularProgress size={32} sx={{ color: '#9C27B0' }} />
                          <Typography variant="body2" sx={{ 
                            color: darkMode ? 'rgba(255,255,255,0.6)' : '#7F8C8D',
                            mt: 2 
                          }}>
                            Loading events...
                          </Typography>
                        </Box>
                      ) : upcomingEvents.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="h4" sx={{ mb: 1 }}>📅</Typography>
                          <Typography variant="body2" sx={{ 
                            color: darkMode ? 'rgba(255,255,255,0.6)' : '#7F8C8D' 
                          }}>
                            No upcoming events
                          </Typography>
                        </Box>
                      ) : (
                        <Stack spacing={1.5}>
                          {upcomingEvents.slice(0, 3).map((event, index) => (
                            <Box
                              key={event._id}
                              className="event-mini-card"
                              onClick={(e) => { e.stopPropagation(); navigate(`/events/${event._id}`); }}
                            >
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'flex-start',
                                gap: 2
                              }}>
                                <Box sx={{
                                  minWidth: 48,
                                  height: 48,
                                  borderRadius: '12px',
                                  background: 'linear-gradient(135deg, #9C27B0, #E91E63)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '1.2rem'
                                }}>
                                  {getCategoryIcon(event.category)}
                                </Box>
                                
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography variant="subtitle2" fontWeight="bold" sx={{ 
                                    color: darkMode ? '#fff' : '#2C3E50',
                                    mb: 0.5,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    {event.title}
                                  </Typography>
                                  
                                  <Typography variant="caption" sx={{ 
                                    color: darkMode ? 'rgba(255,255,255,0.6)' : '#7F8C8D',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    mb: 0.5
                                  }}>
                                    <CalendarToday sx={{ fontSize: 10 }} />
                                    {formatDate(event.dateTime.start)} • {formatTime(event.dateTime.start)}
                                  </Typography>
                                  
                                  <Typography variant="caption" sx={{ 
                                    color: darkMode ? 'rgba(255,255,255,0.6)' : '#7F8C8D',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                  }}>
                                    <LocationOn sx={{ fontSize: 10 }} />
                                    {event.location.venue}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ textAlign: 'right' }}>
                                  {event.registration.required && (
                                    <Chip
                                      size="small"
                                      label={event.registration.fee > 0 ? `₹${event.registration.fee}` : 'FREE'}
                                      sx={{
                                        background: event.registration.fee > 0 
                                          ? 'linear-gradient(135deg, #FF5722, #E91E63)' 
                                          : 'linear-gradient(135deg, #4CAF50, #66BB6A)',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.7rem',
                                        height: 20
                                      }}
                                    />
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          ))}
                          
                          {upcomingEvents.length > 3 && (
                            <Box sx={{ textAlign: 'center', pt: 2 }}>
                              <Button
                                size="small"
                                sx={{ 
                                  color: '#9C27B0',
                                  fontWeight: 600
                                }}
                                onClick={(e) => { e.stopPropagation(); navigate('/events'); }}
                              >
                                +{upcomingEvents.length - 3} more events
                              </Button>
                            </Box>
                          )}
                        </Stack>
                      )}
                    </Box>
                  </Paper>
                </Fade>

                {/* Recent Activity Section */}
                <Fade in timeout={1400}>
                  <Paper className="activity-card" sx={{ p: 0 }}>
                    <Box sx={{ p: 3, pb: 1 }}>
                      <Typography variant="h5" fontWeight="bold" sx={{ color: darkMode ? '#fff' : '#2C3E50' }}>
                        📈 Recent Activity
                      </Typography>
                    </Box>
                    
                    <List sx={{ pt: 0 }}>
                      {loading ? (
                        Array(3).fill(0).map((_, i) => (
                          <ListItem key={i} sx={{ py: 2 }}>
                            <ListItemAvatar>
                              <CircularProgress size={32} />
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ 
                                  width: '60%', 
                                  height: 16, 
                                  backgroundColor: darkMode ? '#333' : '#f0f0f0', 
                                  borderRadius: 1, 
                                  mb: 1 
                                }} />
                              }
                              secondary={
                                <Box sx={{ 
                                  width: '40%', 
                                  height: 12, 
                                  backgroundColor: darkMode ? '#333' : '#f0f0f0', 
                                  borderRadius: 1 
                                }} />
                              }
                            />
                          </ListItem>
                        ))
                      ) : (
                        recentActivity.map((activity, index) => (
                          <React.Fragment key={activity.id}>
                            <ListItem
                              sx={{
                                '&:hover': {
                                  backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(33, 150, 243, 0.04)',
                                  cursor: 'pointer'
                                },
                                py: 2
                              }}
                            >
                              <ListItemAvatar>
                                <Avatar sx={{ 
                                  width: 40, 
                                  height: 40, 
                                  bgcolor: darkMode ? '#333' : '#f5f5f5' 
                                }}>
                                  {getActivityIcon(activity.type)}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: darkMode ? '#fff' : '#2C3E50' }}>
                                    {activity.title}
                                  </Typography>
                                }
                                secondary={
                                  <Box>
                                    <Typography variant="caption" display="flex" alignItems="center" gap={0.5} sx={{ color: darkMode ? 'rgba(255,255,255,0.6)' : '#7F8C8D' }}>
                                      <LocationOn sx={{ fontSize: 12 }} />
                                      {activity.location}
                                    </Typography>
                                    <Typography variant="caption" display="flex" alignItems="center" gap={0.5} sx={{ color: darkMode ? 'rgba(255,255,255,0.6)' : '#7F8C8D' }}>
                                      <AccessTime sx={{ fontSize: 12 }} />
                                      {activity.time}
                                    </Typography>
                                  </Box>
                                }
                              />
                            </ListItem>
                            {index < recentActivity.length - 1 && <Divider sx={{ borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />}
                          </React.Fragment>
                        ))
                      )}
                    </List>
                    
                    <Box sx={{ p: 2, textAlign: 'center', borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#f0f0f0'}` }}>
                      <Button 
                        variant="text" 
                        size="small"
                        onClick={() => navigate('/lostfound/my-items')}
                        sx={{ fontWeight: 600, color: darkMode ? '#fff' : 'inherit' }}
                      >
                        View All Activity
                      </Button>
                    </Box>
                  </Paper>
                </Fade>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Global Styles with Google Fonts */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          
          * {
            font-family: 'Inter', 'Roboto', sans-serif !important;
          }
          
          body {
            margin: 0;
            padding: 0;
            background: ${darkMode ? '#0a0a0a' : '#f8fafc'};
            color: ${darkMode ? '#ffffff' : '#000000'};
            transition: all 0.3s ease;
            font-family: 'Inter', 'Roboto', sans-serif !important;
          }
        `}
      </style>
    </ThemeProvider>
  );
};

export default Dashboard;
