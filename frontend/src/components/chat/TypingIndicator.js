import React from 'react';
import { Box, Typography, Fade } from '@mui/material';

const TypingIndicator = ({ typingUsers }) => {
  if (typingUsers.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0]} is typing...`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0]} and ${typingUsers[1]} are typing...`;
    } else {
      return `${typingUsers.length} people are typing...`;
    }
  };

  return (
    <Fade in>
      <Box px={2} py={1}>
        <Typography variant="caption" color="textSecondary" fontStyle="italic">
          {getTypingText()}
        </Typography>
        <Box display="inline-flex" ml={1}>
          {[0, 1, 2].map((dot) => (
            <Box
              key={dot}
              sx={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: 'text.secondary',
                mx: 0.25,
                animation: 'typing 1.4s infinite',
                animationDelay: `${dot * 0.2}s`,
                '@keyframes typing': {
                  '0%, 60%, 100%': {
                    transform: 'translateY(0)',
                    opacity: 0.3,
                  },
                  '30%': {
                    transform: 'translateY(-8px)',
                    opacity: 1,
                  },
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Fade>
  );
};

export default TypingIndicator;
