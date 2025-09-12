import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Fade,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { People, Circle, PersonAdd } from '@mui/icons-material';

const OnlineUsers = ({ users, count }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));
  
  const getAvatarColor = (username) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    const charCode = username?.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  return (
    <Paper sx={{ 
      height: '100%', 
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column',
      boxShadow: 2
    }}>
      {/* Compact Header */}
      <Box sx={{ 
        p: isSmallScreen ? 1.5 : 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        color: 'white'
      }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <People sx={{ fontSize: isSmallScreen ? 18 : 20 }} />
            <Typography variant={isSmallScreen ? "subtitle2" : "subtitle1"} fontWeight="bold">
              Online
            </Typography>
          </Box>
          <Chip 
            label={count || 0} 
            size="small" 
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '0.65rem',
              height: 18,
              minWidth: 24
            }}
          />
        </Box>
        {!isSmallScreen && (
          <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
            <Circle sx={{ fontSize: 6, color: '#44b700' }} />
            <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.7rem' }}>
              {count === 0 ? 'No one online' : `${count} active`}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Compact Users List */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: 4,
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#c1c1c1',
          borderRadius: 2,
        },
      }}>
        <List sx={{ p: 0.5 }}>
          {users.map((user, index) => (
            <Fade in key={user.username} timeout={200 + index * 30}>
              <ListItem sx={{
                borderRadius: 1,
                mb: 0.25,
                py: 0.25,
                px: 0.75,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}>
                <ListItemAvatar sx={{ minWidth: isSmallScreen ? 28 : 32 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      sx={{
                        backgroundColor: getAvatarColor(user.username),
                        width: isSmallScreen ? 24 : 28,
                        height: isSmallScreen ? 24 : 28,
                        fontSize: isSmallScreen ? '0.7rem' : '0.8rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {user.username?.[0]?.toUpperCase()}
                    </Avatar>
                    <Circle 
                      sx={{ 
                        fontSize: 8, 
                        color: '#44b700',
                        position: 'absolute',
                        bottom: -1,
                        right: -1,
                        backgroundColor: 'white',
                        borderRadius: '50%'
                      }} 
                    />
                  </Box>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography 
                      variant="body2" 
                      fontWeight="medium" 
                      sx={{ 
                        fontSize: isSmallScreen ? '0.75rem' : '0.8rem',
                        lineHeight: 1.2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {user.displayName || user.username}
                    </Typography>
                  }
                  secondary={!isSmallScreen && (
                    <Typography 
                      variant="caption" 
                      color="textSecondary" 
                      sx={{ fontSize: '0.65rem' }}
                    >
                      {user.year ? `Yr ${user.year}` : 'Student'}
                    </Typography>
                  )}
                />
              </ListItem>
            </Fade>
          ))}
          
          {count === 0 && (
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center" 
              height="120px"
              p={2}
            >
              <PersonAdd sx={{ fontSize: 28, color: 'text.disabled', mb: 1 }} />
              <Typography variant="caption" color="textSecondary" textAlign="center" fontSize="0.7rem">
                No one online
              </Typography>
              <Typography variant="caption" color="textSecondary" textAlign="center" fontSize="0.65rem">
                Be the first!
              </Typography>
            </Box>
          )}
        </List>
      </Box>
    </Paper>
  );
};

export default OnlineUsers;
