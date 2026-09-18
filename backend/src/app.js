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
const allowedOrigins = [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl) or if origin is allowed
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in dev
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

// Dynamic Route Loader will mount module routes in subsequent phases:
// e.g. app.use('/api/auth', authRoutes);

// Fallback 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  return ApiResponse.notFound(res, `API route not found: ${req.method} ${req.originalUrl}`);
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
