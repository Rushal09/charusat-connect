import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  Fade,
  useMediaQuery,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import {
  MoreVertOutlined,
  EditOutlined,
  DeleteOutlined,
  ReplyOutlined,
  EmojiEmotionsOutlined
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

const MessageComponent = ({ message, isOwn, user, onReaction, onEdit, onDelete, onReply }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [showReactions, setShowReactions] = useState(false);

  // Handle system messages
  if (message.type === 'system') {
    return (
      <Fade in timeout={300}>
        <Box display="flex" justifyContent="center" my={1}>
          <Chip
            label={message.message || message.content}
            size="small"
            variant="outlined"
            sx={{ 
              backgroundColor: 'action.hover',
              fontSize: isMobile ? '0.75rem' : '0.8rem',
              maxWidth: isMobile ? '90%' : 'auto',
              '& .MuiChip-label': {
                px: 2
              }
            }}
          />
        </Box>
      </Fade>
    );
  }

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleReactionClick = (emoji) => {
    if (onReaction) {
      onReaction(message.id || message._id, emoji);
    }
    setShowReactions(false);
  };

  // Get avatar color based on username
  const getAvatarColor = (username) => {
    if (!username) return theme.palette.primary.main;
    
    const colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
      '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
      '#8bc34a', '#cddc39', '#ffc107', '#ff9800', '#ff5722'
    ];
    
    const charSum = username.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charSum % colors.length];
  };

  // Common reactions
  const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  // Get message timestamp
  const getTimestamp = () => {
    const messageTime = message.timestamp || message.createdAt;
    if (!messageTime) return 'now';
    
    try {
      return formatDistanceToNow(new Date(messageTime), { addSuffix: true });
    } catch (error) {
      return 'now';
    }
  };

  return (
    <Fade in timeout={300}>
      <Box
        display="flex"
        justifyContent={isOwn ? 'flex-end' : 'flex-start'}
        mb={1.5}
        px={isMobile ? 1 : 1.5}
        sx={{ width: '100%' }}
      >
        <Box
          display="flex"
          flexDirection={isOwn ? 'row-reverse' : 'row'}
          alignItems="flex-end"
          maxWidth={isMobile ? '85%' : '70%'}
          gap={1}
          sx={{ position: 'relative' }}
        >
          {/* Avatar for other users */}
          {!isOwn && (
            <Avatar
              sx={{
                width: isMobile ? 28 : 32,
                height: isMobile ? 28 : 32,
                bgcolor: getAvatarColor(message.user?.username),
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                fontWeight: 'bold',
                flexShrink: 0,
                mb: 0.5
              }}
            >
              {(message.user?.username?.[0] || message.user?.displayName?.[0] || '?').toUpperCase()}
            </Avatar>
          )}
          
          <Box sx={{ minWidth: 0, flex: 1, position: 'relative' }}>
            {/* Username and timestamp for other users */}
            {!isOwn && (
              <Box sx={{ mb: 0.5, ml: 0.5 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: isMobile ? '0.7rem' : '0.75rem',
                    fontWeight: 500
                  }}
                >
                  {message.user?.displayName || message.user?.username || 'Anonymous'}
                  {message.user?.year && (
                    <span style={{ opacity: 0.7, marginLeft: 4 }}>
                      • Year {message.user.year}
                    </span>
                  )}
                </Typography>
              </Box>
            )}
            
            {/* Reply indicator */}
            {message.replyTo && (
              <Box sx={{ mb: 1, ml: isOwn ? 0 : 0.5, mr: isOwn ? 0.5 : 0 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1,
                    bgcolor: 'action.hover',
                    borderLeft: `3px solid ${isOwn ? theme.palette.primary.main : '#757575'}`,
                    borderRadius: 1,
                    fontSize: '0.8rem'
                  }}
                >
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.7rem' }}>
                    Replying to {message.replyTo.username}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', opacity: 0.8, mt: 0.5 }}>
                    {(message.replyTo.content || '').substring(0, 50)}
                    {(message.replyTo.content || '').length > 50 ? '...' : ''}
                  </Typography>
                </Paper>
              </Box>
            )}
            
            {/* Message bubble */}
            <Paper
              elevation={isOwn ? 3 : 1}
              onMouseEnter={() => setShowReactions(false)}
              sx={{
                p: isMobile ? 1.5 : 2,
                backgroundColor: isOwn ? theme.palette.primary.main : 'background.paper',
                color: isOwn ? theme.palette.primary.contrastText : 'text.primary',
                borderRadius: 2.5,
                position: 'relative',
                maxWidth: '100%',
                wordBreak: 'break-word',
                ...(isOwn ? {
                  borderBottomRightRadius: 6,
                } : {
                  borderBottomLeftRadius: 6,
                }),
                '&:hover': {
                  '& .message-actions': {
                    opacity: 1
                  }
                }
              }}
            >
              {/* Message content */}
              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  lineHeight: 1.4,
                  mb: 0.5,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {message.content || message.message || '[No content]'}
              </Typography>

              {/* File attachments */}
              {message.attachments && message.attachments.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {message.attachments.map((attachment, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      {attachment.type === 'image' ? (
                        <Box
                          component="img"
                          src={attachment.url}
                          alt={attachment.originalName}
                          sx={{
                            maxWidth: '100%',
                            maxHeight: 200,
                            borderRadius: 2,
                            objectFit: 'cover',
                            cursor: 'pointer'
                          }}
                          onClick={() => window.open(attachment.url, '_blank')}
                        />
                      ) : (
                        <Chip
                          label={attachment.originalName || 'File'}
                          size="small"
                          clickable
                          onClick={() => window.open(attachment.url, '_blank')}
                          sx={{ 
                            mr: 1,
                            bgcolor: isOwn ? 'rgba(255,255,255,0.2)' : 'action.hover',
                            color: isOwn ? 'inherit' : 'text.primary'
                          }}
                        />
                      )}
                    </Box>
                  ))}
                </Box>
              )}

              {/* Message footer */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={0.5}
              >
                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.7,
                    fontSize: isMobile ? '0.65rem' : '0.7rem',
                    color: 'inherit'
                  }}
                >
                  {getTimestamp()}
                  {message.edited?.isEdited && (
                    <span style={{ marginLeft: 4, fontStyle: 'italic' }}>• edited</span>
                  )}
                </Typography>

                {/* Message actions */}
                <Box
                  className="message-actions"
                  sx={{
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    display: 'flex',
                    gap: 0.5
                  }}
                >
                  <Tooltip title="Add reaction">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowReactions(!showReactions);
                      }}
                      sx={{
                        color: 'inherit',
                        opacity: 0.7,
                        width: 24,
                        height: 24,
                        '&:hover': { opacity: 1 }
                      }}
                    >
                      <EmojiEmotionsOutlined sx={{ fontSize: '1rem' }} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="More options">
                    <IconButton
                      size="small"
                      onClick={handleMenuOpen}
                      sx={{
                        color: 'inherit',
                        opacity: 0.7,
                        width: 24,
                        height: 24,
                        '&:hover': { opacity: 1 }
                      }}
                    >
                      <MoreVertOutlined sx={{ fontSize: '1rem' }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Quick reactions popup */}
              {showReactions && (
                <Paper
                  elevation={8}
                  sx={{
                    position: 'absolute',
                    bottom: '100%',
                    left: isOwn ? 'auto' : 0,
                    right: isOwn ? 0 : 'auto',
                    mb: 0.5,
                    p: 0.5,
                    borderRadius: 3,
                    display: 'flex',
                    gap: 0.5,
                    zIndex: 10,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                  onMouseLeave={() => setShowReactions(false)}
                >
                  {quickReactions.map((emoji) => (
                    <IconButton
                      key={emoji}
                      size="small"
                      onClick={() => handleReactionClick(emoji)}
                      sx={{ 
                        fontSize: '1.1rem',
                        width: 32,
                        height: 32,
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                    >
                      {emoji}
                    </IconButton>
                  ))}
                </Paper>
              )}
            </Paper>

            {/* Message reactions display */}
            {message.reactions && message.reactions.length > 0 && (
              <Box sx={{ mt: 0.5, ml: isOwn ? 0 : 0.5, mr: isOwn ? 0.5 : 0 }}>
                <Box display="flex" gap={0.5} flexWrap="wrap">
                  {message.reactions.map((reaction, index) => (
                    <Chip
                      key={`${reaction.emoji}-${index}`}
                      label={`${reaction.emoji} ${reaction.count || reaction.users?.length || 1}`}
                      size="small"
                      clickable
                      onClick={() => handleReactionClick(reaction.emoji)}
                      sx={{
                        height: 22,
                        fontSize: '0.7rem',
                        bgcolor: 'action.hover',
                        '&:hover': {
                          bgcolor: 'action.selected'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {/* Context menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: isOwn ? 'left' : 'right',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: isOwn ? 'left' : 'right',
          }}
          PaperProps={{
            elevation: 8,
            sx: {
              mt: -1,
              minWidth: 120
            }
          }}
        >
          <MenuItem 
            onClick={() => { 
              onReply && onReply(message); 
              handleMenuClose(); 
            }}
            sx={{ fontSize: '0.9rem' }}
          >
            <ReplyOutlined sx={{ mr: 1, fontSize: '1rem' }} />
            Reply
          </MenuItem>
          {isOwn && (
            <MenuItem 
              onClick={() => { 
                onEdit && onEdit(message, message.content || message.message); 
                handleMenuClose(); 
              }}
              sx={{ fontSize: '0.9rem' }}
            >
              <EditOutlined sx={{ mr: 1, fontSize: '1rem' }} />
              Edit
            </MenuItem>
          )}
          {isOwn && (
            <MenuItem 
              onClick={() => { 
                onDelete && onDelete(message); 
                handleMenuClose(); 
              }}
              sx={{ fontSize: '0.9rem', color: 'error.main' }}
            >
              <DeleteOutlined sx={{ mr: 1, fontSize: '1rem' }} />
              Delete
            </MenuItem>
          )}
        </Menu>
      </Box>
    </Fade>
  );
};

export default MessageComponent;
