const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const config = require('./config/environment');
const errorHandler = require('./middleware/errorHandler');
const ApiResponse = require('./utils/apiResponse');

const app = express();

// Security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
const allowedOrigins = [
  config.clientUrl,
  'https://social-media-pi-eight.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests or allowed origin list or any vercel.app preview domain
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in dev/staging
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Request Logging
if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder for local media storage fallback
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Base Health Check
app.get('/api/health', (req, res) => {
  return ApiResponse.success(res, {
    service: 'SocialSphere API',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: config.env
  }, 'SocialSphere backend service is online');
});

// Mount Module Routes
app.use('/api/auth', require('./modules/auth/authRoutes'));
app.use('/api/categories', require('./modules/category/categoryRoutes'));
app.use('/api/posts', require('./modules/post/postRoutes'));
app.use('/api/users', require('./modules/user/userRoutes'));
app.use('/api/notifications', require('./modules/notification/notificationRoutes'));
app.use('/api/messages', require('./modules/messaging/messagingRoutes'));
app.use('/api/reports', require('./modules/moderation/reportRoutes'));
app.use('/api/admin', require('./modules/admin/adminRoutes'));

// Fallback 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  return ApiResponse.notFound(res, `API route not found: ${req.method} ${req.originalUrl}`);
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
