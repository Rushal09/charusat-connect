import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunk for fetching chat rooms
export const fetchChatRooms = createAsyncThunk(
  'chat/fetchChatRooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/chat/rooms');
      const rooms = response.data.rooms || response.data || [];
      console.log('✅ Fetched chat rooms from API:', rooms);
      return rooms;
    } catch (error) {
      console.warn('⚠️ API fetch failed, using fallback rooms:', error.message);
      // Return fallback rooms on error
      const fallbackRooms = [
        { 
          id: 'general', 
          name: '💬 General Chat', 
          description: 'Open discussion for all students',
          category: 'general',
          color: '#4CAF50'
        },
        { 
          id: 'computer-engineering', 
          name: '💻 Computer Engineering', 
          description: 'CE students discussion',
          category: 'academic',
          color: '#2196F3'
        },
        { 
          id: 'information-technology', 
          name: '📱 Information Technology', 
          description: 'IT students discussion',
          category: 'academic',
          color: '#FF9800'
        },
        { 
          id: 'electronics-communication', 
          name: '📡 Electronics & Communication', 
          description: 'ECE students discussion',
          category: 'academic',
          color: '#9C27B0'
        },
        { 
          id: 'mechanical-engineering', 
          name: '⚙️ Mechanical Engineering', 
          description: 'Mechanical students discussion',
          category: 'academic',
          color: '#607D8B'
        },
        { 
          id: 'civil-engineering', 
          name: '🏗️ Civil Engineering', 
          description: 'Civil students discussion',
          category: 'academic',
          color: '#795548'
        },
        { 
          id: 'chemical-engineering', 
          name: '🧪 Chemical Engineering', 
          description: 'Chemical students discussion',
          category: 'academic',
          color: '#E91E63'
        },
        { 
          id: 'study-help', 
          name: '📚 Study Help', 
          description: 'Academic support and study groups',
          category: 'support',
          color: '#3F51B5'
        },
        { 
          id: 'events', 
          name: '🎉 College Events', 
          description: 'Campus events and announcements',
          category: 'social',
          color: '#FF5722'
        }
      ];
      return fallbackRooms;
    }
  }
);

// Enhanced chat slice with all features
const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    rooms: [],
    currentRoom: null,
    onlineUsers: [],
    typingUsers: [],
    isLoading: false,
    isConnected: false,
    error: null,
    roomStats: {},
    lastActivity: null
  },
  reducers: {
    // Enhanced message handling
    addMessage: (state, action) => {
      const message = action.payload;
      console.log('📨 Adding message to state:', message);
      
      // Prevent duplicate messages with multiple checks
      const exists = state.messages.find(m => {
        // Check by ID first
        if ((m.id && message.id && m.id === message.id) || 
            (m._id && message._id && m._id === message._id)) {
          return true;
        }
        
        // Check for near-identical messages (within 2 seconds)
        if (m.content === message.content && 
            m.user?.username === message.user?.username) {
          const timeDiff = Math.abs(
            new Date(m.timestamp || m.createdAt) - 
            new Date(message.timestamp || message.createdAt)
          );
          return timeDiff < 2000; // 2 seconds
        }
        
        return false;
      });
      
      if (!exists) {
        // Ensure message has required fields
        const processedMessage = {
          ...message,
          id: message.id || message._id || `msg_${Date.now()}_${Math.random()}`,
          timestamp: message.timestamp || message.createdAt || new Date(),
          reactions: message.reactions || [],
          type: message.type || 'user'
        };
        
        state.messages.push(processedMessage);
        state.lastActivity = new Date().toISOString();
        
        // Limit message history to prevent memory issues
        if (state.messages.length > 500) {
          state.messages = state.messages.slice(-400); // Keep last 400 messages
        }
      } else {
        console.log('⚠️ Duplicate message prevented');
      }
    },
    
    // Advanced reaction system
    updateMessageReaction: (state, action) => {
      const { messageId, emoji, user, action: reactionAction } = action.payload;
      console.log(`👍 Updating reaction: ${emoji} on ${messageId} by ${user.username}`);
      
      const message = state.messages.find(m => 
        m.id === messageId || m._id === messageId
      );
      
      if (message) {
        if (!message.reactions) {
          message.reactions = [];
        }
        
        let reaction = message.reactions.find(r => r.emoji === emoji);
        
        if (reaction) {
          const userIndex = reaction.users.findIndex(u => u.username === user.username);
          
          if (userIndex > -1) {
            // Remove user's reaction
            reaction.users.splice(userIndex, 1);
            reaction.count = reaction.users.length;
            
            // Remove reaction entirely if no users
            if (reaction.count === 0) {
              message.reactions = message.reactions.filter(r => r.emoji !== emoji);
            }
          } else {
            // Add user's reaction
            reaction.users.push({ 
              username: user.username, 
              displayName: user.displayName || user.username,
              timestamp: new Date()
            });
            reaction.count = reaction.users.length;
          }
        } else {
          // Create new reaction
          message.reactions.push({
            emoji,
            users: [{ 
              username: user.username, 
              displayName: user.displayName || user.username,
              timestamp: new Date()
            }],
            count: 1
          });
        }
        
        state.lastActivity = new Date().toISOString();
      }
    },
    
    // Enhanced message editing
    updateMessageContent: (state, action) => {
      const { messageId, content, edited } = action.payload;
      console.log(`✏️ Updating message content: ${messageId}`);
      
      const message = state.messages.find(m => 
        m.id === messageId || m._id === messageId
      );
      
      if (message) {
        // Store original content in edit history
        if (!message.edited) {
          message.edited = {
            isEdited: false,
            editHistory: []
          };
        }
        
        if (!message.edited.editHistory) {
          message.edited.editHistory = [];
        }
        
        // Add current content to history
        message.edited.editHistory.push({
          content: message.content,
          editedAt: message.edited.editedAt || message.timestamp || new Date()
        });
        
        // Update message
        message.content = content;
        message.edited = {
          ...message.edited,
          isEdited: true,
          editedAt: new Date(),
          ...edited
        };
        
        state.lastActivity = new Date().toISOString();
      }
    },
    
    // Enhanced message deletion
    markMessageDeleted: (state, action) => {
      const { messageId, deletedBy } = action.payload;
      console.log(`🗑️ Marking message as deleted: ${messageId}`);
      
      const message = state.messages.find(m => 
        m.id === messageId || m._id === messageId
      );
      
      if (message) {
        message.content = '[This message was deleted]';
        message.type = 'system';
        message.attachments = [];
        message.reactions = [];
        message.deleted = {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: deletedBy
        };
        
        state.lastActivity = new Date().toISOString();
      }
    },
    
    // Room and user management
    setRooms: (state, action) => {
      state.rooms = action.payload;
      console.log('🏠 Updated rooms list:', action.payload.length, 'rooms');
    },
    
    setCurrentRoom: (state, action) => {
      const newRoom = action.payload;
      console.log('🏠 Switching to room:', newRoom?.name);
      
      // Clear messages when switching rooms
      state.messages = [];
      state.typingUsers = [];
      state.currentRoom = newRoom;
      state.lastActivity = new Date().toISOString();
    },
    
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
      
      // Update room stats
      if (state.currentRoom) {
        const roomUsers = action.payload.filter(u => u.room === state.currentRoom.id);
        if (!state.roomStats[state.currentRoom.id]) {
          state.roomStats[state.currentRoom.id] = {};
        }
        state.roomStats[state.currentRoom.id].onlineCount = roomUsers.length;
      }
    },
    
    // Typing indicators
    addTypingUser: (state, action) => {
      const username = action.payload;
      if (!state.typingUsers.includes(username)) {
        state.typingUsers.push(username);
      }
    },
    
    removeTypingUser: (state, action) => {
      const username = action.payload;
      state.typingUsers = state.typingUsers.filter(u => u !== username);
    },
    
    // Connection management
    setConnected: (state, action) => {
      state.isConnected = action.payload;
      console.log('🔌 Connection status:', action.payload ? 'Connected' : 'Disconnected');
      
      if (action.payload) {
        state.error = null;
      }
    },
    
    setError: (state, action) => {
      state.error = action.payload;
      console.error('❌ Chat error:', action.payload);
    },
    
    // Utility actions
    clearMessages: (state) => {
      state.messages = [];
      console.log('🧹 Cleared all messages');
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    updateRoomStats: (state, action) => {
      const { roomId, stats } = action.payload;
      if (!state.roomStats[roomId]) {
        state.roomStats[roomId] = {};
      }
      state.roomStats[roomId] = { ...state.roomStats[roomId], ...stats };
    },
    
    // Bulk message operations
    addMessages: (state, action) => {
      const messages = action.payload;
      console.log('📨 Adding bulk messages:', messages.length);
      
      messages.forEach(message => {
        const exists = state.messages.find(m => 
          (m.id && message.id && m.id === message.id) || 
          (m._id && message._id && m._id === message._id)
        );
        
        if (!exists) {
          state.messages.push({
            ...message,
            id: message.id || message._id || `msg_${Date.now()}_${Math.random()}`,
            reactions: message.reactions || []
          });
        }
      });
      
      // Sort messages by timestamp
      state.messages.sort((a, b) => 
        new Date(a.timestamp || a.createdAt) - new Date(b.timestamp || b.createdAt)
      );
    },
    
    // Reset entire chat state
    resetChatState: (state) => {
      state.messages = [];
      state.currentRoom = null;
      state.onlineUsers = [];
      state.typingUsers = [];
      state.isConnected = false;
      state.error = null;
      state.roomStats = {};
      console.log('🔄 Chat state reset');
    }
  },
  
  // Handle async actions
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatRooms.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        console.log('⏳ Fetching chat rooms...');
      })
      .addCase(fetchChatRooms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rooms = action.payload;
        state.error = null;
        console.log('✅ Chat rooms loaded successfully');
      })
      .addCase(fetchChatRooms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch chat rooms';
        console.error('❌ Failed to fetch chat rooms:', action.error.message);
      });
  }
});

// Export all actions
export const {
  addMessage,
  updateMessageReaction,
  updateMessageContent,
  markMessageDeleted,
  setRooms,
  setCurrentRoom,
  setOnlineUsers,
  addTypingUser,
  removeTypingUser,
  setConnected,
  setError,
  clearMessages,
  clearError,
  updateRoomStats,
  addMessages,
  resetChatState
} = chatSlice.actions;

// Selectors for easy state access
export const selectMessages = (state) => state.chat.messages;
export const selectCurrentRoom = (state) => state.chat.currentRoom;
export const selectOnlineUsers = (state) => state.chat.onlineUsers;
export const selectTypingUsers = (state) => state.chat.typingUsers;
export const selectIsConnected = (state) => state.chat.isConnected;
export const selectRooms = (state) => state.chat.rooms;
export const selectIsLoading = (state) => state.chat.isLoading;
export const selectError = (state) => state.chat.error;

// Computed selectors
export const selectCurrentRoomUsers = (state) => {
  const currentRoom = state.chat.currentRoom;
  if (!currentRoom) return [];
  return state.chat.onlineUsers.filter(user => user.room === currentRoom.id);
};

export const selectMessageCount = (state) => state.chat.messages.length;

export const selectRoomStats = (state, roomId) => 
  state.chat.roomStats[roomId] || {};

export default chatSlice.reducer;
