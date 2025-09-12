import React from 'react';
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
  Stack
} from '@mui/material';
import {
  LogoutOutlined,
  ChatOutlined,
  FindInPageOutlined,
  EventOutlined,
  PollOutlined,
  PersonOutlined,
  SchoolOutlined,
  RocketLaunchOutlined,
  AutoAwesomeOutlined,
  ArrowForward
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => dispatch(logout());

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
      description: 'Share memories and discover upcoming campus events',
      icon: <EventOutlined sx={{ fontSize: 56 }} />,
      iconBg: '#9C27B0',
      action: () => {},
      badge: 'COMING SOON',
      badgeColor: '#FF5722',
      status: 'coming-soon'
    },
    {
      id: 4,
      title: 'Polls & Surveys',
      description: 'Voice opinions through interactive polls and surveys',
      icon: <PollOutlined sx={{ fontSize: 56 }} />,
      iconBg: '#4CAF50',
      action: () => {},
      badge: 'PLANNED',
      badgeColor: '#607D8B',
      status: 'planned'
    }
  ];

  return (
    <>
      {/* Custom CSS Styles */}
      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          position: relative;
        }
        
        .dashboard-pattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.03;
          background-image: radial-gradient(circle at 2px 2px, #333 1px, transparent 0);
          background-size: 40px 40px;
        }
        
        .feature-card {
          height: 480px !important;
          width: 100%;
          border: none;
          border-radius: 28px !important;
          overflow: hidden;
          position: relative;
          background: white;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.04);
        }
        
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.95));
          opacity: 0;
          transition: all 0.6s ease;
          z-index: 1;
        }
        
        .feature-card:hover::before {
          opacity: 1;
        }
        
        .feature-card:hover {
          transform: translateY(-20px) scale(1.03);
          box-shadow: 0 32px 80px rgba(0, 0, 0, 0.2);
          border-color: rgba(33, 150, 243, 0.3);
        }
        
        .feature-card-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 40px !important;
          text-align: center;
          justify-content: space-between;
        }
        
        .feature-icon {
          width: 120px;
          height: 120px;
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 32px auto;
          color: white;
          position: relative;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
        }
        
        .feature-card:hover .feature-icon {
          transform: scale(1.15) rotate(8deg);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .feature-icon::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 30px;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent);
          opacity: 0;
          transition: all 0.6s;
        }
        
        .feature-card:hover .feature-icon::after {
          opacity: 1;
          animation: shine 1.2s ease-in-out;
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }
        
        .hero-content {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(25px);
          border-radius: 32px;
          padding: 60px;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.8);
          position: relative;
          overflow: hidden;
          text-align: center;
        }
        
        .hero-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, #2196F3, #FF9800, #4CAF50, #9C27B0);
        }
        
        .status-badge {
          padding: 12px 24px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: white;
          display: inline-block;
          margin-bottom: 20px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
          transition: all 0.4s ease;
        }
        
        .feature-card:hover .status-badge {
          transform: scale(1.08);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
        }
        
        .action-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-top: 20px;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #2196F3, #1976D2);
          border: none;
          border-radius: 20px;
          padding: 16px 32px;
          color: white;
          font-weight: 800;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-transform: none;
          font-size: 18px;
          box-shadow: 0 6px 24px rgba(33, 150, 243, 0.35);
        }
        
        .btn-primary:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(33, 150, 243, 0.5);
          background: linear-gradient(135deg, #1976D2, #1565C0);
        }
        
        .btn-secondary {
          background: white;
          border: 3px solid #E0E0E0;
          border-radius: 20px;
          padding: 14px 32px;
          color: #666;
          font-weight: 800;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-transform: none;
          font-size: 18px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }
        
        .btn-secondary:hover {
          border-color: #2196F3;
          color: #2196F3;
          background: rgba(33, 150, 243, 0.05);
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(33, 150, 243, 0.2);
        }
        
        .section-title {
          text-align: center;
          margin-bottom: 80px;
        }
        
        .section-title h2 {
          font-size: 4.5rem;
          font-weight: 900;
          color: #2C3E50;
          margin-bottom: 24px;
          line-height: 1.1;
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .section-title p {
          font-size: 1.5rem;
          color: #7F8C8D;
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.6;
          font-weight: 400;
        }
        
        .header-navbar {
          background: rgba(255, 255, 255, 0.98) !important;
          backdrop-filter: blur(25px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
        }
        
        .feature-title {
          font-size: 1.8rem !important;
          font-weight: 800 !important;
          color: #2C3E50 !important;
          margin-bottom: 16px !important;
          line-height: 1.3 !important;
        }
        
        .feature-description {
          font-size: 1.1rem !important;
          color: #7F8C8D !important;
          line-height: 1.7 !important;
          font-weight: 400 !important;
        }
        
        .action-btn-small {
          background: white;
          border: 2px solid #E0E0E0;
          border-radius: 16px;
          padding: 10px 20px;
          color: #666;
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
          
          .section-title h2 {
            font-size: 3rem;
          }
          
          .feature-card {
            height: 440px !important;
            margin-bottom: 32px;
          }
          
          .feature-card-content {
            padding: 32px !important;
          }
          
          .feature-icon {
            width: 100px;
            height: 100px;
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
      `}</style>

      {/* Header */}
      {/* Header */}
<AppBar position="sticky" elevation={0} className="header-navbar">
  <Toolbar sx={{ py: 1, px: 1.5, gap: 3, flexWrap: 'wrap' }}>
    <Box display="flex" alignItems="center" gap={2}>
  <img 
    src="/assets/connect.png" 
    alt="CHARUSAT Connect" 
    style={{
      height: '90px',        // Increased from 48px
      width: 'auto',
      objectFit: 'contain',
           // Prevent it from being too wide
    }}
  />
</Box>


          
          <Box ml="auto" display="flex" alignItems="center" gap={4}>
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
              <Typography variant="h6" fontWeight="800" color="#2C3E50">
                {user?.username || 'Student'}
              </Typography>
              <Typography variant="body2" color="#7F8C8D" fontWeight="500">
                {user?.email}
              </Typography>
            </Box>
            <IconButton 
              onClick={handleLogout}
              sx={{
                background: 'rgba(33, 150, 243, 0.1)',
                color: '#2196F3',
                width: 52,
                height: 52,
                transition: 'all 0.3s ease',
                '&:hover': { 
                  background: 'rgba(33, 150, 243, 0.2)',
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
          {/* Hero Section - Centered */}
          <Fade in timeout={800}>
            <Box className="hero-content fade-up" sx={{ mb: 12, maxWidth: '900px', mx: 'auto' }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '3rem', md: '5rem' },
                  fontWeight: 900,
                  color: '#2C3E50',
                  mb: 4,
                  lineHeight: 1.1,
                  textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                Welcome back,{' '}
                <Box component="span" sx={{ position: 'relative', color: '#2196F3' }}>
                  {user?.username}!
                  <AutoAwesomeOutlined
                    sx={{
                      position: 'absolute',
                      top: -16,
                      right: -60,
                      fontSize: 48,
                      color: '#FFD700',
                      animation: 'sparkle 2s ease-in-out infinite'
                    }}
                  />
                </Box>
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: '#7F8C8D',
                  mb: 6,
                  fontWeight: 400,
                  lineHeight: 1.6,
                  fontSize: '1.6rem',
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
                  sx={{ px: 6, py: 2.5, fontSize: '1.2rem' }}
                >
                  Start Chatting
                </Button>
                <Button
                  className="btn-secondary"
                  size="large"
                  startIcon={<FindInPageOutlined />}
                  onClick={() => navigate('/lostfound')}
                  sx={{ px: 5, py: 2.5 }}
                >
                  Lost & Found
                </Button>
                <Button
                  className="btn-secondary"
                  size="large"
                  onClick={() => navigate('/lostfound/new')}
                  sx={{ px: 5, py: 2.5 }}
                >
                  Report Item
                </Button>
              </Stack>
            </Box>
          </Fade>

          {/* Features Section */}
          <Box sx={{ mt: 16 }}>
            <Box className="section-title">
              <Typography variant="h2" component="h2">
                Platform Features
              </Typography>
              <Typography variant="body1">
                Discover powerful tools designed to enhance your college experience and connect with your peers seamlessly
              </Typography>
            </Box>

            <Grid container spacing={5} sx={{ mb: 8 }}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} lg={3} key={feature.id}>
                  <Fade in timeout={1400 + index * 300}>
                    <Card className="feature-card" onClick={feature.action}>
                      <CardContent className="feature-card-content">
                        <Box>
                          <Box
                            className="feature-icon"
                            sx={{ backgroundColor: feature.iconBg }}
                          >
                            {feature.icon}
                          </Box>

                          <Typography className="feature-title" variant="h4">
                            {feature.title}
                          </Typography>

                          <Typography className="feature-description" variant="body1" sx={{ mb: 4 }}>
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
                                onClick={(e) => { e.stopPropagation(); navigate('/lostfound'); }}
                              >
                                View Items
                              </Button>
                              <Button
                                className="action-btn-primary-small"
                                onClick={(e) => { e.stopPropagation(); navigate('/lostfound/new'); }}
                              >
                                Report Item
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
          </Box>
        </Container>
      </Box>

      {/* Global Styles */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          
          @keyframes sparkle {
            0%, 100% { transform: rotate(0deg) scale(1); opacity: 0.8; }
            50% { transform: rotate(180deg) scale(1.2); opacity: 1; }
          }
          
          * {
            font-family: 'Inter', 'Roboto', sans-serif !important;
          }
          
          body {
            margin: 0;
            padding: 0;
            background: #f8fafc;
          }
        `}
      </style>
    </>
  );
};

export default Dashboard;
