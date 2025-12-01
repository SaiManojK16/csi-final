/**
 * Environment variable validation
 * Ensures all required environment variables are set before server starts
 */

const logger = require('./logger');

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET'
];

const optionalEnvVars = [
  'PORT',
  'FRONTEND_URL',
  'NODE_ENV',
  'VERCEL_URL'
];

/**
 * Validate that all required environment variables are set
 * @throws {Error} If any required variable is missing
 */
function validateEnvironment() {
  const missing = [];
  const warnings = [];

  // Check required variables
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  // Check for default/weak values
  if (process.env.JWT_SECRET && process.env.JWT_SECRET === 'your-super-secret-jwt-key-change-this-in-production') {
    warnings.push('JWT_SECRET is using the default value. Please change it in production!');
  }

  if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('localhost') && process.env.NODE_ENV === 'production') {
    warnings.push('MONGODB_URI points to localhost in production. This is likely incorrect.');
  }

  // Report missing variables
  if (missing.length > 0) {
    logger.error('Missing required environment variables:');
    missing.forEach(varName => {
      logger.error(`  - ${varName}`);
    });
    logger.error('\nPlease set these variables in your .env file or environment.');
    process.exit(1);
  }

  // Report warnings
  if (warnings.length > 0) {
    warnings.forEach(warning => {
      logger.warn(warning);
    });
  }

  // Log success
  logger.success('Environment variables validated successfully');
  
  // Log environment info (without sensitive data)
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT || '5001 (default)',
      MONGODB_URI: process.env.MONGODB_URI ? '✓ Set' : '✗ Missing',
      JWT_SECRET: process.env.JWT_SECRET ? '✓ Set' : '✗ Missing',
      FRONTEND_URL: process.env.FRONTEND_URL || 'Not set'
    });
  }
}

module.exports = { validateEnvironment };

