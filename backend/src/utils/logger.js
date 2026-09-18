/**
 * Simple structured console logger for SocialSphere backend
 */
const logger = {
  info: (msg, meta = '') => {
    console.log(`\x1b[36m[INFO]\x1b[0m ${new Date().toISOString()} - ${msg}`, meta ? meta : '');
  },
  success: (msg, meta = '') => {
    console.log(`\x1b[32m[SUCCESS]\x1b[0m ${new Date().toISOString()} - ${msg}`, meta ? meta : '');
  },
  warn: (msg, meta = '') => {
    console.warn(`\x1b[33m[WARN]\x1b[0m ${new Date().toISOString()} - ${msg}`, meta ? meta : '');
  },
  error: (msg, meta = '') => {
    console.error(`\x1b[31m[ERROR]\x1b[0m ${new Date().toISOString()} - ${msg}`, meta ? meta : '');
  }
};

module.exports = logger;
