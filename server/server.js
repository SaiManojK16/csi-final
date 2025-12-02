const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const logger = require('./utils/logger');
const { validateEnvironment } = require('./utils/validateEnv');

// Load environment variables
// In production (Render), use environment variables from Render dashboard
// In development, load from .env file
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.join(__dirname, '.env') });
}

// Validate environment variables before starting
validateEnvironment();

const app = express();

// Middleware
// CORS configuration - allow requests from frontend
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  // Add common Vercel deployment URLs
  'https://csi-final-4gr04l1n3-kadthalamanoj16-4032s-projects.vercel.app',
  'https://csi-final-tau.vercel.app',
  // Allow any Vercel subdomain for this project
  /^https:\/\/csi-final.*\.vercel\.app$/
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin matches any allowed origin (including regex patterns)
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    // In development, allow all origins
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // In production, check against allowed origins
    if (isAllowed) {
      callback(null, true);
    } else {
      logger.warn(`Blocked request from unauthorized origin: ${origin}`);
      logger.info(`Allowed origins: ${allowedOrigins.filter(o => !(o instanceof RegExp)).join(', ')}`);
      // In production, be more restrictive but log for debugging
      if (process.env.NODE_ENV === 'production') {
        // Temporarily allow for debugging - remove this in final version
        logger.warn(`Allowing origin for debugging: ${origin}`);
        callback(null, true);
        // Uncomment below to enforce CORS strictly:
        // return callback(new Error('Not allowed by CORS'));
      } else {
        callback(null, true);
      }
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Add body size limit

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  logger.success('Connected to MongoDB successfully!');
  logger.info('Database: acceptly');
})
.catch((error) => {
  logger.error('MongoDB connection error:', error.message);
  process.exit(1);
});

// Import routes
const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problems');
const progressRoutes = require('./routes/progress');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/progress', progressRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Acceptly API is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});


// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });
  
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  logger.success(`Server running on port ${PORT}`);
  logger.info(`API available at http://localhost:${PORT}/api`);
  logger.info(`Health check: http://localhost:${PORT}/api/health`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

