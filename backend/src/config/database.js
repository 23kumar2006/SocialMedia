const mongoose = require('mongoose');
const config = require('./environment');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    logger.success(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    logger.warn(`Note: Ensure your MongoDB server is running on ${config.mongoUri} or update MONGODB_URI in backend/.env`);
    // Return null or let server continue running for API health checks and static endpoints
    return null;
  }
};

module.exports = connectDB;
