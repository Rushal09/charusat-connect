import { io } from 'socket.io-client';

class ChatService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.messageQueue = new Set();
    this.lastMessageId = null;
  }

  connect() {
    if (!this.socket) {
      // Dynamic Socket URL
      const getSocketURL = () => {
        const hostname = window.location.hostname;
        const port = '5000';
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          return `http://localhost:${port}`;
        } else {
          return `http://${hostname}:${port}`;
        }
      };

      const socketURL = getSocketURL();
      console.log('🔌 Socket URL:', socketURL);

      this.socket = io(socketURL, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        transports: ['websocket', 'polling'],
        upgrade: true,
        rememberUpgrade: true,
      });

      this.socket.on('connect', () => {
        console.log('🟢 Connected to chat server');
        console.log('🆔 Socket ID:', this.socket.id);
        this.isConnected = true;
        this.messageQueue.clear();
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔴 Disconnected from chat server:', reason);
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Connection error:', error);
      });

      this.socket.on('reconnect', (attemptNumber) => {
        console.log('🔄 Reconnected after', attemptNumber, 'attempts');
      });
    }
    
    return this.socket;
  }

  joinRoom(room, user) {
    if (this.socket && this.isConnected) {
      console.log(`📥 Joining room: ${room} as ${user.username}`);
      this.socket.emit('join-room', { room, user });
    } else {
      console.warn('⚠️ Cannot join room - socket not connected');
    }
  }

  sendMessage(room, message, user, replyTo = null, attachments = []) {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) {
        reject(new Error('Socket not connected'));
        return;
      }

      if (!message.trim()) {
        reject(new Error('Message is empty'));
        return;
      }

      const messageId = `${user.username}_${Date.now()}_${message.substring(0, 10)}`;
      
      if (this.messageQueue.has(messageId) || messageId === this.lastMessageId) {
        console.warn('⚠️ Duplicate message prevented:', messageId);
        resolve();
        return;
      }

      this.messageQueue.add(messageId);
      this.lastMessageId = messageId;

      console.log(`💬 Sending message to ${room}:`, message);
      
      try {
        this.socket.emit('send-message', { 
          room, 
          message, 
          user, 
          replyTo, 
          attachments 
        });
        
        setTimeout(() => {
          this.messageQueue.delete(messageId);
        }, 2000);
        
        setTimeout(() => {
          if (this.lastMessageId === messageId) {
            this.lastMessageId = null;
          }
        }, 1000);
        
        resolve();
      } catch (error) {
        this.messageQueue.delete(messageId);
        reject(error);
      }
    });
  }

  // Reaction methods
  toggleReaction(messageId, emoji, user) {
    if (this.socket && this.isConnected) {
      console.log(`👍 Toggling reaction ${emoji} on message ${messageId}`);
      this.socket.emit('toggle-reaction', {
        messageId,
        emoji,
        user
      });
    }
  }

  // Message editing methods
  editMessage(messageId, newContent, user) {
    if (this.socket && this.isConnected) {
      console.log(`✏️ Editing message ${messageId}`);
      this.socket.emit('edit-message', {
        messageId,
        newContent,
        user
      });
    }
  }

  // Message deletion methods
  deleteMessage(messageId, user) {
    if (this.socket && this.isConnected) {
      console.log(`🗑️ Deleting message ${messageId}`);
      this.socket.emit('delete-message', {
        messageId,
        user
      });
    }
  }

  startTyping(room, user) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing-start', { room, user });
    }
  }

  stopTyping(room, user) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing-stop', { room, user });
    }
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting from chat server');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.messageQueue.clear();
      this.lastMessageId = null;
    }
  }

  // Event listeners with cleanup
  onMessage(callback) {
    if (this.socket) {
      this.socket.off('receive-message');
      this.socket.on('receive-message', (data) => {
        console.log('📨 Received message:', data);
        callback(data);
      });
    }
  }

  onUserJoined(callback) {
    if (this.socket) {
      this.socket.off('user-joined');
      this.socket.on('user-joined', (data) => {
        console.log('👋 User joined:', data);
        callback(data);
      });
    }
  }

  onUserLeft(callback) {
    if (this.socket) {
      this.socket.off('user-left');
      this.socket.on('user-left', (data) => {
        console.log('👋 User left:', data);
        callback(data);
      });
    }
  }

  onUsersUpdated(callback) {
    if (this.socket) {
      this.socket.off('room-users-updated');
      this.socket.on('room-users-updated', (data) => {
        console.log('👥 Users updated:', data);
        callback(data);
      });
    }
  }

  onTyping(callback) {
    if (this.socket) {
      this.socket.off('user-typing');
      this.socket.on('user-typing', callback);
    }
  }

  onStopTyping(callback) {
    if (this.socket) {
      this.socket.off('user-stop-typing');
      this.socket.on('user-stop-typing', callback);
    }
  }

  // Advanced event listeners
  onReactionUpdated(callback) {
    if (this.socket) {
      this.socket.off('reaction-updated');
      this.socket.on('reaction-updated', (data) => {
        console.log('👍 Reaction updated:', data);
        callback(data);
      });
    }
  }

  onMessageEdited(callback) {
    if (this.socket) {
      this.socket.off('message-edited');
      this.socket.on('message-edited', (data) => {
        console.log('✏️ Message edited:', data);
        callback(data);
      });
    }
  }

  onMessageDeleted(callback) {
    if (this.socket) {
      this.socket.off('message-deleted');
      this.socket.on('message-deleted', (data) => {
        console.log('🗑️ Message deleted:', data);
        callback(data);
      });
    }
  }

  removeAllListeners() {
    if (this.socket) {
      console.log('🧹 Removing all socket listeners');
      this.socket.removeAllListeners();
      this.messageQueue.clear();
      this.lastMessageId = null;
    }
  }

  isSocketConnected() {
    return this.socket && this.isConnected;
  }

  getConnectionStatus() {
    return {
      connected: this.isConnected,
      socketId: this.socket?.id,
      transport: this.socket?.io?.engine?.transport?.name,
      queueSize: this.messageQueue.size
    };
  }
}

export default new ChatService();
