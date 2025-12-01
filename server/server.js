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
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      // In production, be more restrictive
      if (process.env.NODE_ENV === 'production') {
        logger.warn(`Blocked request from unauthorized origin: ${origin}`);
        return callback(new Error('Not allowed by CORS'));
      }
      callback(null, true);
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

