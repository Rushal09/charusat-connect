import React, { useState } from 'react';
import { Grid, Box, Container, Typography, Chip, IconButton, Drawer, AppBar, Toolbar } from '@mui/material';
import { Groups, Menu, People, Close } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import ChatRoomList from './ChatRoomList';
import ChatWindow from './ChatWindow';
import OnlineUsers from './OnlineUsers';

const ChatLayout = () => {
  const { currentRoom, onlineUsers } = useSelector(state => state.chat);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [onlineDrawerOpen, setOnlineDrawerOpen] = useState(false);
  
  const roomOnlineUsers = currentRoom 
    ? onlineUsers.filter(user => user.room === currentRoom.id)
    : [];

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleOnlineDrawerToggle = () => {
    setOnlineDrawerOpen(!onlineDrawerOpen);
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f5f7fa',
      overflow: 'hidden'
    }}>
      {/* Mobile App Bar */}
      <AppBar 
        position="static" 
        elevation={2}
        sx={{
          display: { xs: 'flex', md: 'none' },
          backgroundColor: 'primary.main'
        }}
      >
        <Toolbar sx={{ minHeight: '56px !important' }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          
          <Typography variant="h6" sx={{ flexGrow: 1, fontSize: '1rem' }}>
            {currentRoom ? currentRoom.name : 'CHARUSAT Chat'}
          </Typography>
          
          <IconButton
            color="inherit"
            onClick={handleOnlineDrawerToggle}
          >
            <People />
            {roomOnlineUsers.length > 0 && (
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                {roomOnlineUsers.length}
              </Typography>
            )}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Desktop Header */}
      <Box sx={{
        height: 64,
        flexShrink: 0,
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        px: 3,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        zIndex: 10
      }}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          💬 CHARUSAT Connect Chat
        </Typography>
        <Box ml="auto">
          <Chip 
            icon={<Groups />} 
            label={`${onlineUsers.length} Online`} 
            color="success" 
            variant="outlined"
            sx={{
              '& .MuiChip-icon': {
                fontSize: '1.1rem'
              }
            }}
          />
        </Box>
      </Box>

      {/* Mobile Drawer for Chat Rooms */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileDrawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Chat Rooms
          </Typography>
          <IconButton onClick={handleDrawerToggle}>
            <Close />
          </IconButton>
        </Box>
        <ChatRoomList onRoomSelect={() => setMobileDrawerOpen(false)} />
      </Drawer>

      {/* Mobile Drawer for Online Users */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={onlineDrawerOpen}
        onClose={handleOnlineDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 260,
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Online Users
          </Typography>
          <IconButton onClick={handleOnlineDrawerToggle}>
            <Close />
          </IconButton>
        </Box>
        <OnlineUsers 
          users={roomOnlineUsers} 
          count={roomOnlineUsers.length}
        />
      </Drawer>

      {/* Main Content Area - NO CONTAINER, FULL WIDTH */}
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        minHeight: 0,
        px: { xs: 0, md: 1 }, // Minimal padding
        py: { xs: 0, md: 1 }
      }}>
        {/* Desktop Layout - Full Width Grid */}
        <Grid 
          container 
          spacing={1} // Reduced spacing
          sx={{ 
            height: '100%',
            flex: 1,
            margin: 0,
            display: { xs: 'none', md: 'flex' },
            width: '100%', // Force full width
            maxWidth: '100%', // Override any max-width
            '& .MuiGrid-item': {
              paddingTop: '4px',
              paddingLeft: '4px'
            }
          }}
        >
          {/* Chat Rooms Sidebar - Optimized Width */}
          <Grid 
            item 
            md={2.2} 
            lg={2}
            xl={1.8} // Even smaller on large screens
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <ChatRoomList />
          </Grid>

          {/* Main Chat Window - Expanded Width */}
          <Grid 
            item 
            md={7.6} 
            lg={8.5}
            xl={8.7} // Larger on big screens
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <ChatWindow room={currentRoom} />
          </Grid>

          {/* Online Users Sidebar - Minimal Width */}
          <Grid 
            item 
            md={2.2} 
            lg={1.5}
            xl={1.5} // Smaller on large screens
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <OnlineUsers 
              users={roomOnlineUsers} 
              count={roomOnlineUsers.length}
            />
          </Grid>
        </Grid>

        {/* Mobile Layout - Full Screen Chat */}
        <Box sx={{ 
          flex: 1,
          display: { xs: 'flex', md: 'none' },
          flexDirection: 'column',
          width: '100%'
        }}>
          <ChatWindow room={currentRoom} />
        </Box>
      </Box>
    </Box>
  );
};

export default ChatLayout;
