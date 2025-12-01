/**
 * Rate limiting middleware
 * Prevents abuse of API endpoints
 */

// Simple in-memory rate limiter
// For production, consider using Redis-based rate limiting
const rateLimitStore = new Map();

/**
 * Clear rate limit store (useful for development/testing)
 */
function clearRateLimitStore() {
  rateLimitStore.clear();
}

/**
 * Rate limiter middleware
 * @param {Object} options - Rate limit options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.max - Maximum number of requests per window
 * @param {string} options.message - Error message to return
 */
function rateLimiter(options = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // 100 requests per window
    message = 'Too many requests, please try again later.'
  } = options;

  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    // Clean up old entries
    if (rateLimitStore.size > 10000) {
      // Prevent memory leak - clear old entries
      const cutoff = now - windowMs;
      for (const [k, v] of rateLimitStore.entries()) {
        if (v.resetTime < cutoff) {
          rateLimitStore.delete(k);
        }
      }
    }

    // Get or create rate limit entry
    let entry = rateLimitStore.get(key);

    if (!entry || entry.resetTime < now) {
      // Create new entry or reset expired entry
      entry = {
        count: 0,
        resetTime: now + windowMs
      };
      rateLimitStore.set(key, entry);
    }

    entry.count++;

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - entry.count));
    res.setHeader('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());

    if (entry.count > max) {
      return res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000)
      });
    }

    next();
  };
}

/**
 * Strict rate limiter for authentication endpoints
 * More lenient in development for testing
 */
const authRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 5 : 50, // 5 in production, 50 in development
  message: 'Too many authentication attempts. Please try again in 15 minutes.'
});

/**
 * Standard rate limiter for general API endpoints
 */
const apiRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: 'Too many requests. Please try again later.'
});

module.exports = {
  rateLimiter,
  authRateLimiter,
  apiRateLimiter,
  clearRateLimitStore
};

