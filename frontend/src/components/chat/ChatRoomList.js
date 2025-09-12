import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Paper,
  Typography,
  Box,
  Skeleton,
  Badge,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Chat,
  Computer,
  Smartphone,
  Radio,
  Build,
  Construction,
  Science,
  MenuBook,
  Event,
  Groups
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentRoom } from '../../store/slices/chatSlice';
import api from '../../services/api';

const ChatRoomList = ({ onRoomSelect }) => {
  const dispatch = useDispatch();
  const { currentRoom, onlineUsers } = useSelector(state => state.chat);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch chat rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await api.get('/api/chat/rooms');
        
        // Handle different response structures
        const roomsData = response.data.rooms || response.data || [];
        
        console.log('📋 Fetched chat rooms:', roomsData);
        setRooms(roomsData);
      } catch (error) {
        console.error('❌ Error fetching chat rooms:', error);
        setError('Failed to load chat rooms');
        
        // Fallback to static rooms if API fails
        const fallbackRooms = [
          { id: 'general', name: '💬 General Chat', description: 'Open discussion for all students' },
          { id: 'computer-engineering', name: '💻 Computer Engineering', description: 'CE students discussion' },
          { id: 'information-technology', name: '📱 Information Technology', description: 'IT students discussion' },
          { id: 'electronics-communication', name: '📡 Electronics & Communication', description: 'ECE students discussion' },
          { id: 'mechanical-engineering', name: '⚙️ Mechanical Engineering', description: 'Mechanical students discussion' },
          { id: 'civil-engineering', name: '🏗️ Civil Engineering', description: 'Civil students discussion' },
          { id: 'chemical-engineering', name: '🧪 Chemical Engineering', description: 'Chemical students discussion' },
          { id: 'study-help', name: '📚 Study Help', description: 'Academic support and study groups' },
          { id: 'events', name: '🎉 College Events', description: 'Campus events and announcements' }
        ];
        setRooms(fallbackRooms);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleRoomSelect = (room) => {
    console.log('🏠 Selecting room:', room.name);
    dispatch(setCurrentRoom(room));
    
    // Close mobile drawer after selection
    if (onRoomSelect) {
      onRoomSelect(room);
    }
  };

  const getOnlineCount = (roomId) => {
    return onlineUsers.filter(user => user.room === roomId).length;
  };

  const getRoomIcon = (roomId) => {
    const iconSize = isMobile ? 20 : 22;
    const iconMap = {
      'general': <Groups sx={{ fontSize: iconSize }} />,
      'computer-engineering': <Computer sx={{ fontSize: iconSize }} />,
      'information-technology': <Smartphone sx={{ fontSize: iconSize }} />,
      'electronics-communication': <Radio sx={{ fontSize: iconSize }} />,
      'mechanical-engineering': <Build sx={{ fontSize: iconSize }} />,
      'civil-engineering': <Construction sx={{ fontSize: iconSize }} />,
      'chemical-engineering': <Science sx={{ fontSize: iconSize }} />,
      'study-help': <MenuBook sx={{ fontSize: iconSize }} />,
      'events': <Event sx={{ fontSize: iconSize }} />
    };
    return iconMap[roomId] || <Chat sx={{ fontSize: iconSize }} />;
  };

  const getRoomColor = (roomId) => {
    const colorMap = {
      'general': '#4CAF50',
      'computer-engineering': '#2196F3',
      'information-technology': '#FF9800',
      'electronics-communication': '#9C27B0',
      'mechanical-engineering': '#607D8B',
      'civil-engineering': '#795548',
      'chemical-engineering': '#E91E63',
      'study-help': '#3F51B5',
      'events': '#FF5722'
    };
    return colorMap[roomId] || '#1976d2';
  };

  if (isLoading) {
    return (
      <Paper sx={{ height: '100%', overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Skeleton variant="text" height={24} width="80%" />
          <Skeleton variant="text" height={16} width="60%" />
        </Box>
        <Box sx={{ p: 1 }}>
          {[...Array(8)].map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={isMobile ? 60 : 50} sx={{ mb: 1, borderRadius: 2 }} />
          ))}
        </Box>
      </Paper>
    );
  }

  if (error && rooms.length === 0) {
    return (
      <Paper sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Box textAlign="center">
          <Typography variant="h6" color="error" gutterBottom>
            Failed to load rooms
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {error}
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ 
      height: '100%', 
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column',
      boxShadow: isMobile ? 0 : 2
    }}>
      {/* Header - Only show on desktop */}
      {!isMobile && (
        <Box sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: 'divider',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <Typography variant="subtitle1" fontWeight="bold" display="flex" alignItems="center" gap={1}>
            <Chat sx={{ fontSize: 20 }} />
            Chat Rooms
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            {rooms.length} rooms available
          </Typography>
        </Box>
      )}
      
      {/* Room List */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: 6,
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#c1c1c1',
          borderRadius: 3,
        },
      }}>
        <List sx={{ p: 1, gap: 0.5 }}>
          {rooms.map((room) => {
            const onlineCount = getOnlineCount(room.id);
            const isSelected = currentRoom?.id === room.id;
            const roomColor = getRoomColor(room.id);
            
            return (
              <ListItem key={room.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={isSelected}
                  onClick={() => handleRoomSelect(room)}
                  sx={{
                    borderRadius: 2,
                    py: isMobile ? 1.5 : 1,
                    px: isMobile ? 2 : 1.5,
                    minHeight: isMobile ? 60 : 48,
                    transition: 'all 0.2s ease',
                    '&.Mui-selected': {
                      backgroundColor: `${roomColor}15`,
                      borderLeft: `3px solid ${roomColor}`,
                      '&:hover': {
                        backgroundColor: `${roomColor}20`,
                      },
                    },
                    '&:hover': {
                      backgroundColor: `${roomColor}10`,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: isMobile ? 44 : 36 }}>
                    <Badge 
                      badgeContent={onlineCount > 0 ? onlineCount : null} 
                      color="success"
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.65rem',
                          minWidth: 16,
                          height: 16,
                        }
                      }}
                    >
                      <Box sx={{ 
                        color: roomColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: isMobile ? 32 : 28,
                        height: isMobile ? 32 : 28,
                        borderRadius: 1.5,
                        backgroundColor: `${roomColor}20`,
                      }}>
                        {getRoomIcon(room.id)}
                      </Box>
                    </Badge>
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Typography 
                        variant={isMobile ? "body1" : "body2"}
                        fontWeight={isSelected ? "bold" : "medium"}
                        sx={{ 
                          color: isSelected ? roomColor : 'text.primary',
                          fontSize: isMobile ? '0.95rem' : '0.85rem',
                          lineHeight: 1.2
                        }}
                      >
                        {room.name}
                      </Typography>
                    }
                    secondary={
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.secondary',
                          fontSize: isMobile ? '0.75rem' : '0.7rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {room.description}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
      
      {/* Error message if API failed but fallback worked */}
      {error && (
        <Box sx={{ p: 1, bgcolor: 'warning.light', borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="warning.dark" textAlign="center" display="block">
            ⚠️ Using offline rooms (API unavailable)
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ChatRoomList;
