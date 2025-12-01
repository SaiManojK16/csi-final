/**
 * Frontend logging utility
 * Provides structured logging with different log levels
 * In production, only errors are logged to console
 */

const isDevelopment = process.env.NODE_ENV === 'development';

const logger = {
  /**
   * Log info messages (only in development)
   */
  info: (...args) => {
    if (isDevelopment) {
      console.log('ℹ️', ...args);
    }
  },

  /**
   * Log success messages (only in development)
   */
  success: (...args) => {
    if (isDevelopment) {
      console.log('✅', ...args);
    }
  },

  /**
   * Log warning messages
   */
  warn: (...args) => {
    if (isDevelopment) {
      console.warn('⚠️', ...args);
    } else {
      // In production, warnings might be sent to error tracking service
      console.warn('[WARN]', ...args);
    }
  },

  /**
   * Log error messages (always logged)
   */
  error: (...args) => {
    console.error('❌', ...args);
    // In production, you might want to send errors to an error tracking service
    // e.g., Sentry, LogRocket, etc.
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
   * Log API requests/responses (only in development)
   */
  api: (method, url, status, ...args) => {
    if (isDevelopment) {
      const emoji = status >= 200 && status < 300 ? '🟢' : status >= 400 ? '🔴' : '🟡';
      console.log(`${emoji} ${method} ${url} [${status}]`, ...args);
    }
  }
};

export default logger;

