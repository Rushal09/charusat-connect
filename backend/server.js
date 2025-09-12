const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const os = require('os');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      const { address, family, internal } = interface;
      if (family === 'IPv4' && !internal) {
        return address;
      }
    }
  }
  return '127.0.0.1';
}

const localIP = getLocalIP();

// Enhanced CORS origins for network access
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  `http://${localIP}:3000`,
  'http://192.168.1.0/24', // Allow entire local subnet
  // Add common local network ranges
  'http://192.168.0.0/24',
  'http://10.0.0.0/24',
];

// Dynamic CORS function to allow local network IPs
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    // Check if origin is localhost or local IP
    if (origin.includes('localhost') || 
        origin.includes('127.0.0.1') ||
        origin.includes(localIP) ||
        origin.match(/http:\/\/192\.168\.\d+\.\d+:\d+/) ||
        origin.match(/http:\/\/10\.\d+\.\d+\.\d+:\d+/) ||
        origin.match(/http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+:\d+/)) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Socket.io setup with enhanced CORS
const io = socketIo(server, {
  cors: {
    origin: function (origin, callback) {
      // Same logic as above for Socket.io
      if (!origin) return callback(null, true);
      
      if (origin.includes('localhost') || 
          origin.includes('127.0.0.1') ||
          origin.includes(localIP) ||
          origin.match(/http:\/\/192\.168\.\d+\.\d+:\d+/) ||
          origin.match(/http:\/\/10\.\d+\.\d+\.\d+:\d+/) ||
          origin.match(/http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+:\d+/)) {
        callback(null, true);
      } else {
        console.log('❌ Socket.io CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'], // Enable both transports for better compatibility
  allowEIO3: true // Enable Engine.IO v3 compatibility
});

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/lostfound', require('./routes/lostFound')); // ADD THIS LINE

// Static file serving for uploaded images
app.use('/uploads/lostfound', express.static(path.join(__dirname, 'uploads/lostfound'))); // ADD THIS LINE


// Enhanced test route with network info
app.get('/', (req, res) => {
  res.json({ 
    message: 'CHARUSAT Connect API is running!',
    version: '1.0.0',
    features: ['Authentication', 'Real-time Chat', 'Network Access'],
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login', 
      'GET /api/auth/me',
      'GET /api/chat/rooms',
      'GET /api/chat/messages/:room'
    ],
    networkAccess: {
      localhost: `http://localhost:${process.env.PORT || 5000}`,
      localNetwork: `http://${localIP}:${process.env.PORT || 5000}`,
      frontendUrls: [
        `http://localhost:3000`,
        `http://${localIP}:3000`
      ]
    },
    instructions: {
      sameDevice: 'Use localhost URLs',
      otherDevices: `Use ${localIP} URLs (ensure same WiFi network)`
    }
  });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

// Enhanced Socket.io Chat Logic with better logging
const activeUsers = new Map();

io.on('connection', (socket) => {
  const clientIP = socket.handshake.address;
  console.log(`🟢 User connected: ${socket.id} from ${clientIP}`);

  // User joins a chat room
  socket.on('join-room', ({ room, user }) => {
    socket.join(room);
    activeUsers.set(socket.id, { ...user, room, socketId: socket.id, joinedAt: new Date() });
    
    // Broadcast to room that user joined
    socket.to(room).emit('user-joined', {
      message: `${user.username || user.displayName} joined the chat`,
      timestamp: new Date(),
      type: 'system'
    });

    // Send updated user count to room
    const roomUsers = Array.from(activeUsers.values()).filter(u => u.room === room);
    io.to(room).emit('room-users-updated', {
      count: roomUsers.length,
      users: roomUsers.map(u => ({ 
        username: u.username, 
        displayName: u.displayName,
        joinedAt: u.joinedAt
      }))
    });

    console.log(`📥 ${user.username} joined room: ${room} (Total in room: ${roomUsers.length})`);
  });

  // Handle new messages with enhanced logging
  socket.on('send-message', ({ room, message, user }) => {
    const chatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: message.trim(),
      user: {
        username: user.username,
        displayName: user.displayName || user.username,
        year: user.profile?.year,
        branch: user.profile?.branch
      },
      timestamp: new Date(),
      type: 'user'
    };

    // Broadcast to all users in the room (including sender)
    io.to(room).emit('receive-message', chatMessage);
    
    console.log(`💬 Message in ${room} from ${user.username}: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);
  });

  // Handle typing indicators
  socket.on('typing-start', ({ room, user }) => {
    socket.to(room).emit('user-typing', { 
      user: user.username,
      displayName: user.displayName || user.username 
    });
  });

  socket.on('typing-stop', ({ room, user }) => {
    socket.to(room).emit('user-stop-typing', { user: user.username });
  });

  // Handle disconnection with better cleanup
  socket.on('disconnect', (reason) => {
    const user = activeUsers.get(socket.id);
    if (user) {
      const { room } = user;
      
      // Remove user from active users
      activeUsers.delete(socket.id);
      
      // Broadcast to room that user left
      socket.to(room).emit('user-left', {
        message: `${user.username || user.displayName} left the chat`,
        timestamp: new Date(),
        type: 'system'
      });

      // Send updated user count to room
      const roomUsers = Array.from(activeUsers.values()).filter(u => u.room === room);
      io.to(room).emit('room-users-updated', {
        count: roomUsers.length,
        users: roomUsers.map(u => ({ 
          username: u.username, 
          displayName: u.displayName,
          joinedAt: u.joinedAt
        }))
      });

      console.log(`🔴 ${user.username} disconnected from ${room} (Reason: ${reason}, Remaining in room: ${roomUsers.length})`);
    } else {
      console.log(`🔴 Unknown user disconnected: ${socket.id} (Reason: ${reason})`);
    }
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error(`❌ Socket error for ${socket.id}:`, error);
  });
});

// Enhanced server startup with network information
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log('\n🚀 CHARUSAT Connect Server Started Successfully!');
  console.log('📋 Server Information:');
  console.log(`   ├── Port: ${PORT}`);
  console.log(`   ├── Local: http://localhost:${PORT}`);
  console.log(`   ├── Network: http://${localIP}:${PORT}`);
  console.log('📱 Socket.io enabled for real-time chat');
  console.log('\n🌐 Access URLs:');
  console.log('   ├── Same Device: http://localhost:3000');
  console.log(`   ├── Other Devices: http://${localIP}:3000`);
  console.log('   └── (Ensure all devices are on the same WiFi network)');
  console.log('\n💡 For testing:');
  console.log('   ├── Multiple browser tabs/windows');
  console.log('   ├── Different browsers (Chrome, Firefox, etc.)');
  console.log('   └── Mobile devices on same WiFi');
  console.log('\n✅ Ready to accept connections!\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔄 Shutting down server gracefully...');
  server.close(() => {
    console.log('✅ Server shut down complete');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
