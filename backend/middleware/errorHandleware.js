const { logger } = require('../utils/logger');

// 404 handler
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(`Error ${err.status || 500}: ${error.message}`, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    stack: err.stack
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, status: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, status: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, status: 400 };
  }

  // XRPL specific errors
  if (err.message && err.message.includes('XRPL')) {
    error.status = 503;
    error.message = 'XRPL service unavailable';
  }

  // Rate limit errors
  if (err.status === 429) {
    error.message = 'Too many requests, please try again later';
  }

  const response = {
    error: error.message || 'Server Error',
    status: error.status || 500
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  // Include request ID for tracking
  if (req.id) {
    response.requestId = req.id;
  }

  res.status(error.status || 500).json(response);
};

module.exports = {
  notFound,
  errorHandler
};