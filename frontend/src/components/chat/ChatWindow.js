import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
  Fade,
  Backdrop,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';
import {
  Groups,
  Computer,
  Smartphone,
  Radio,
  Build,
  Construction,
  Science,
  MenuBook,
  Event,
  Chat,
  Circle
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MessageComponent from './MessageComponent';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import chatService from '../../services/chatService';
import {
  addMessage,
  updateMessageReaction,
  updateMessageContent,
  markMessageDeleted,
  setOnlineUsers,
  addTypingUser,
  removeTypingUser,
  setConnected
} from '../../store/slices/chatSlice';

const ChatWindow = ({ room }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { messages, typingUsers, onlineUsers } = useSelector(state => state.chat);
  const { user } = useSelector(state => state.auth);
  const messagesEndRef = useRef(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Helper functions for room styling
  const getRoomIcon = (roomId) => {
    const iconSize = isMobile ? 28 : 32;
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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Enhanced chat service connection
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (room) {
      setIsConnecting(true);
      
      const socket = chatService.connect();
      
      // Setup all event listeners
      chatService.onMessage((message) => {
        dispatch(addMessage(message));
      });

      chatService.onUserJoined((systemMessage) => {
        dispatch(addMessage(systemMessage));
      });

      chatService.onUserLeft((systemMessage) => {
        dispatch(addMessage(systemMessage));
      });

      chatService.onUsersUpdated((data) => {
        dispatch(setOnlineUsers(data.users || []));
      });

      chatService.onTyping((data) => {
        dispatch(addTypingUser(data.displayName || data.user));
      });

      chatService.onStopTyping((data) => {
        dispatch(removeTypingUser(data.user));
      });

      // Advanced feature listeners
      chatService.onReactionUpdated((data) => {
        dispatch(updateMessageReaction(data));
      });

      chatService.onMessageEdited((data) => {
        dispatch(updateMessageContent(data));
      });

      chatService.onMessageDeleted((data) => {
        dispatch(markMessageDeleted(data));
      });

      // Join the room
      setTimeout(() => {
        chatService.joinRoom(room.id, user);
        setIsConnecting(false);
        dispatch(setConnected(true));
      }, 500);
    }

    return () => {
      if (room) {
        chatService.removeAllListeners();
        setReplyToMessage(null);
        setEditingMessage(null);
      }
    };
  }, [room, user, dispatch, navigate]);

  // Enhanced message sending
  const handleSendMessage = async (message, attachments = []) => {
    if (room && user) {
      try {
        await chatService.sendMessage(
          room.id, 
          message, 
          user, 
          replyToMessage ? {
            messageId: replyToMessage.id || replyToMessage._id,
            content: replyToMessage.content || replyToMessage.message,
            username: replyToMessage.user?.username
          } : null,
          attachments
        );
        
        setReplyToMessage(null);
        console.log('✅ Message sent successfully');
      } catch (error) {
        console.error('❌ Failed to send message:', error);
      }
    }
  };

  const handleTyping = (isTyping) => {
    if (room && user) {
      if (isTyping) {
        chatService.startTyping(room.id, user);
      } else {
        chatService.stopTyping(room.id, user);
      }
    }
  };

  // Advanced message interaction handlers
  const handleReaction = (messageId, emoji) => {
    console.log(`👍 Reacting with ${emoji} to message ${messageId}`);
    chatService.toggleReaction(messageId, emoji, user);
  };

  const handleEditMessage = (message, currentContent) => {
    console.log('✏️ Opening edit dialog for message:', message.id);
    setEditingMessage(message);
    setEditContent(currentContent || '');
  };

  const handleSaveEdit = () => {
    if (editingMessage && editContent.trim()) {
      console.log('💾 Saving edited message:', editingMessage.id);
      chatService.editMessage(editingMessage.id || editingMessage._id, editContent.trim(), user);
      setEditingMessage(null);
      setEditContent('');
    }
  };

  const handleDeleteMessage = (message) => {
    console.log('🗑️ Deleting message:', message.id);
    if (window.confirm('Are you sure you want to delete this message?')) {
      chatService.deleteMessage(message.id || message._id, user);
    }
  };

  const handleReplyToMessage = (message) => {
    console.log('💬 Replying to message:', message.id);
    setReplyToMessage(message);
  };

  if (!room) {
    return (
      <Paper sx={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: isMobile ? 2 : 3,
        p: isMobile ? 2 : 4,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: isMobile ? 0 : 2,
        margin: 0
      }}>
        <Chat sx={{ fontSize: isMobile ? 60 : 80, opacity: 0.8 }} />
        <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" textAlign="center">
          Welcome to CHARUSAT Connect Chat
        </Typography>
        <Typography variant={isMobile ? "body1" : "h6"} sx={{ opacity: 0.9 }} textAlign="center">
          {isMobile 
            ? "Select a room to start chatting!" 
            : "Select a chat room from the sidebar to start conversations with your fellow students!"
          }
        </Typography>
      </Paper>
    );
  }

  const roomOnlineUsers = onlineUsers.filter(u => u.room === room.id);
  const roomColor = getRoomColor(room.id);

  return (
    <>
      <Paper sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: isMobile ? 0 : 2,
        borderRadius: isMobile ? 0 : 2,
        position: 'relative',
        margin: 0
      }}>
        {/* Loading Backdrop */}
        <Backdrop open={isConnecting} sx={{ zIndex: 1000, color: 'primary.main' }}>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <CircularProgress color="inherit" size={isMobile ? 40 : 60} />
            <Typography variant={isMobile ? "body1" : "h6"} color="inherit">
              Connecting to {room.name}...
            </Typography>
          </Box>
        </Backdrop>

        {/* Enhanced Chat Header */}
        <Box sx={{ 
          minHeight: isMobile ? 70 : 100,
          maxHeight: isMobile ? 70 : 100,
          p: isMobile ? 1.5 : 2, 
          borderBottom: 1, 
          borderColor: 'divider',
          background: `linear-gradient(135deg, ${roomColor}15, ${roomColor}08)`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: isMobile ? 2 : 3,
            background: `linear-gradient(90deg, ${roomColor}, ${roomColor}80)`,
          }
        }}>
          <Box display="flex" alignItems="center" gap={isMobile ? 1.5 : 2} width="100%">
            <Box sx={{ 
              color: roomColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: isMobile ? 40 : 48,
              height: isMobile ? 40 : 48,
              borderRadius: 2,
              backgroundColor: `${roomColor}20`,
              border: `2px solid ${roomColor}30`,
              flexShrink: 0
            }}>
              {getRoomIcon(room.id)}
            </Box>
            <Box flex={1} minWidth={0}>
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                fontWeight="bold" 
                sx={{ 
                  color: roomColor,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: isMobile ? '1.1rem' : '1.5rem'
                }}
              >
                {room.name}
              </Typography>
              <Typography 
                variant={isMobile ? "caption" : "body2"} 
                color="textSecondary" 
                sx={{ 
                  mb: isMobile ? 0 : 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: isMobile ? '0.75rem' : '0.875rem'
                }}
              >
                {room.description}
              </Typography>
              <Box display="flex" alignItems="center" gap={isMobile ? 1 : 2} flexWrap="wrap">
                {roomOnlineUsers.length > 0 && (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Circle sx={{ fontSize: isMobile ? 6 : 8, color: '#44b700' }} />
                    <Typography 
                      variant="caption" 
                      color="success.main" 
                      fontWeight="medium"
                      sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem' }}
                    >
                      {roomOnlineUsers.length} {roomOnlineUsers.length === 1 ? 'person' : 'people'} online
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Messages Area */}
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          backgroundColor: '#fafafa'
        }}>
          {/* Welcome Message */}
          {messages.length === 0 && (
            <Fade in timeout={1000}>
              <Box p={isMobile ? 1.5 : 2} sx={{ flexShrink: 0 }}>
                <Alert 
                  severity="info" 
                  sx={{ 
                    borderRadius: 2,
                    backgroundColor: `${roomColor}10`,
                    border: `1px solid ${roomColor}30`,
                    '& .MuiAlert-message': {
                      textAlign: 'center',
                      width: '100%'
                    },
                    '& .MuiAlert-icon': {
                      color: roomColor
                    }
                  }}
                >
                  <Typography 
                    variant={isMobile ? "body2" : "body1"} 
                    fontWeight="medium"
                  >
                    🎉 Welcome to <strong>{room.name}</strong>!
                  </Typography>
                  <Typography 
                    variant={isMobile ? "caption" : "body2"} 
                    sx={{ mt: 1 }}
                  >
                    Start a conversation by sending your first message. 
                    {!isMobile && " All messages are anonymous for privacy."}
                  </Typography>
                </Alert>
              </Box>
            </Fade>
          )}

          {/* Messages Container */}
          <Box sx={{ 
            flex: 1,
            overflow: 'auto',
            py: 0.5,
            '&::-webkit-scrollbar': {
              width: isMobile ? 4 : 6,
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
              margin: '4px 0',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 3,
              '&:hover': {
                background: 'rgba(0,0,0,0.3)',
              },
            },
          }}>
            {messages.map((message, index) => (
              <MessageComponent
                key={message.id || message._id || `msg-${index}-${message.timestamp}`}
                message={message}
                isOwn={message.user && message.user.username === user?.username}
                user={user}
                onReaction={handleReaction}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
                onReply={handleReplyToMessage}
              />
            ))}
            
            <TypingIndicator typingUsers={typingUsers} />
            <div ref={messagesEndRef} />
          </Box>
        </Box>

        {/* Chat Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          disabled={!room || isConnecting}
          replyToMessage={replyToMessage}
          onCancelReply={() => setReplyToMessage(null)}
          roomColor={roomColor}
        />
      </Paper>

      {/* Edit Message Dialog */}
      <Dialog 
        open={Boolean(editingMessage)} 
        onClose={() => setEditingMessage(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Message</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Edit your message..."
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingMessage(null)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEdit}
            variant="contained"
            disabled={!editContent.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChatWindow;
