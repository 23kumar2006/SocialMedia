const cloudinary = require('cloudinary').v2;
const config = require('./environment');
const logger = require('../utils/logger');

if (config.cloudinary.isConfigured) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret
  });
  logger.info('Cloudinary SDK configured successfully');
} else {
  logger.info('Cloudinary credentials not provided; local storage fallback active');
}

module.exports = cloudinary;
