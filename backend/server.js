const http = require('http');
const { Server } = require('socket.io');
const app = require('./src/app');
const connectDB = require('./src/config/database');
const config = require('./src/config/environment');
const logger = require('./src/utils/logger');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists for fallback storage
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || origin.includes('vercel.app') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Attach io instance to app for use in controllers
app.set('io', io);

// Socket.IO Connection Handling
io.on('connection', (socket) => {
  logger.info(`Socket client connected: ${socket.id}`);

  socket.on('join_user_room', (userId) => {
    if (userId) {
      socket.join(`user_${userId}`);
      logger.info(`User ${userId} joined room user_${userId}`);
    }
  });

  socket.on('disconnect', () => {
    logger.info(`Socket client disconnected: ${socket.id}`);
  });
});

// Start Server
const startServer = async () => {
  // Connect to Database
  await connectDB();

  server.listen(config.port, () => {
    logger.success(`🚀 SocialSphere Server running on port ${config.port} [${config.env}]`);
    logger.info(`🌐 Health check available at: http://localhost:${config.port}/api/health`);
  });
};

startServer();

module.exports = { app, server, io };
