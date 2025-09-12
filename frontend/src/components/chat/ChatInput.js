import React, { useState, useRef } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  InputAdornment,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Send, EmojiEmotions } from '@mui/icons-material';

const ChatInput = ({ onSendMessage, onTyping, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMessageChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    // Handle typing indicator
    if (!isTyping && value.trim()) {
      setIsTyping(true);
      onTyping(true);
    }

    // Clear previous timeout
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    // Set new timeout to stop typing
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
      onTyping(false);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      
      // Clear typing
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
      setIsTyping(false);
      onTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Paper 
      elevation={isMobile ? 0 : 3}
      sx={{ 
        p: isMobile ? 1.5 : 2, 
        borderRadius: isMobile ? 0 : 2,
        borderTop: 1,
        borderColor: 'divider',
        backgroundColor: 'white'
      }}
    >
      <Box component="form" onSubmit={handleSubmit} display="flex" gap={1} alignItems="flex-end">
        <TextField
          fullWidth
          multiline
          maxRows={isMobile ? 2 : 3}
          value={message}
          onChange={handleMessageChange}
          onKeyPress={handleKeyPress}
          placeholder={disabled ? "Select a room to start chatting..." : "Type a message..."}
          disabled={disabled}
          variant="outlined"
          size={isMobile ? "medium" : "small"}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: isMobile ? 2 : 3,
              backgroundColor: 'background.paper',
              fontSize: isMobile ? '1rem' : '0.875rem',
              '& textarea': {
                padding: isMobile ? '12px 14px' : '8.5px 14px',
              }
            },
          }}
          InputProps={{
            endAdornment: !isMobile && (
              <InputAdornment position="end">
                <Tooltip title="Coming Soon!">
                  <IconButton size="small" disabled>
                    <EmojiEmotions />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
        <IconButton
          type="submit"
          color="primary"
          disabled={!message.trim() || disabled}
          sx={{
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            '&:disabled': {
              backgroundColor: 'action.disabledBackground',
            },
            borderRadius: isMobile ? 1.5 : 2,
            width: isMobile ? 48 : 40,
            height: isMobile ? 48 : 40,
            mb: 0.5
          }}
        >
          <Send sx={{ fontSize: isMobile ? 22 : 18 }} />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatInput;
