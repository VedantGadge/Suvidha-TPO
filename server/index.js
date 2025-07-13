import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';
import TPORoutes from './routes/tpo.routes.js';
import authenticationRoutes from './routes/authentication.routes.js';

// Load environment variables
dotenv.config();

const app = express();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Rate limiting with detailed error messages
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP',
    details: 'You have exceeded the rate limit of 100 requests per 15 minutes. Please try again later.',
    retryAfter: '15 minutes',
    type: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'You have exceeded the rate limit of 100 requests per 15 minutes. Please try again later.',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000),
      type: 'RATE_LIMIT_EXCEEDED'
    });
  }
});

// Stricter rate limiting for auth endpoints with detailed feedback
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth
  message: {
    error: 'Too many authentication attempts',
    details: 'You have exceeded the login attempt limit of 5 tries per 15 minutes. This is for security purposes.',
    retryAfter: '15 minutes',
    type: 'AUTH_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too Many Authentication Attempts',
      message: 'You have exceeded the login attempt limit of 5 tries per 15 minutes. This is for security purposes.',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000),
      remainingAttempts: 0,
      type: 'AUTH_RATE_LIMIT_EXCEEDED'
    });
  }
});

app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://yourdomain.com'
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Logging (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body parsing middleware with size limits and error handling
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf, encoding) => {
    req.rawBody = buf;
  }
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// Payload size error handler
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Payload Too Large',
      message: 'The request payload exceeds the maximum allowed size of 10MB.',
      maxSize: '10MB',
      type: 'PAYLOAD_TOO_LARGE'
    });
  }
  next(err);
});

// Apply stricter rate limiting to auth routes
app.use('/api/auth', authLimiter);

// API Routes
app.use('/api/TPO', TPORoutes);
app.use('/api/auth', authenticationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Enhanced global error handler with detailed security feedback
app.use((err, req, res, next) => {
  // Log error in development only
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', err);
  }
  
  // Handle specific security-related errors
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'Invalid Request Format',
      message: 'The request body contains invalid JSON or data format.',
      type: 'INVALID_REQUEST_FORMAT'
    });
  }

  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({
      error: 'Security Token Invalid',
      message: 'Invalid or missing CSRF token. Please refresh the page and try again.',
      type: 'CSRF_TOKEN_INVALID'
    });
  }

  if (err.message && err.message.includes('Content Security Policy')) {
    return res.status(400).json({
      error: 'Content Security Policy Violation',
      message: 'The request violates the content security policy. This is blocked for security reasons.',
      type: 'CSP_VIOLATION'
    });
  }

  // JWT specific errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid Token',
      message: 'The authentication token is invalid or malformed.',
      type: 'INVALID_JWT_TOKEN'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token Expired',
      message: 'Your session has expired. Please log in again.',
      type: 'JWT_TOKEN_EXPIRED'
    });
  }

  // Database connection errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR') {
    return res.status(503).json({
      error: 'Service Temporarily Unavailable',
      message: 'Database connection failed. Please try again later.',
      type: 'DATABASE_CONNECTION_ERROR'
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Failed',
      message: 'The provided data does not meet security requirements.',
      details: err.details || 'Please check your input and try again.',
      type: 'VALIDATION_ERROR'
    });
  }

  // Default error response
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message || 'An unexpected error occurred',
    message: statusCode >= 500 
      ? 'Something went wrong on our end. Please try again later.'
      : 'Please check your request and try again.',
    type: 'GENERAL_ERROR'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Server running on port ${PORT}`);
  }
});
