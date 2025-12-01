/**
 * Production-ready logging utility
 * Provides structured logging with different log levels
 */

const isDevelopment = process.env.NODE_ENV === 'development';

const logger = {
  /**
   * Log info messages (server startup, connections, etc.)
   */
  info: (...args) => {
    if (isDevelopment) {
      console.log('ℹ️', ...args);
    } else {
      // In production, you might want to send to a logging service
      console.log('[INFO]', ...args);
    }
  },

  /**
   * Log success messages
   */
  success: (...args) => {
    if (isDevelopment) {
      console.log('✅', ...args);
    } else {
      console.log('[SUCCESS]', ...args);
    }
  },

  /**
   * Log warning messages
   */
  warn: (...args) => {
    if (isDevelopment) {
      console.warn('⚠️', ...args);
    } else {
      console.warn('[WARN]', ...args);
    }
  },

  /**
   * Log error messages
   */
  error: (...args) => {
    if (isDevelopment) {
      console.error('❌', ...args);
    } else {
      console.error('[ERROR]', ...args);
    }
  },

  /**
   * Log debug messages (only in development)
   */
  debug: (...args) => {
    if (isDevelopment) {
      console.log('🔍 [DEBUG]', ...args);
    }
    // Silently ignore in production
  },

  /**
   * Log API requests (for debugging)
   */
  api: (method, path, status, ...args) => {
    if (isDevelopment) {
      const emoji = status >= 200 && status < 300 ? '🟢' : status >= 400 ? '🔴' : '🟡';
      console.log(`${emoji} ${method} ${path} [${status}]`, ...args);
    }
  }
};

module.exports = logger;

