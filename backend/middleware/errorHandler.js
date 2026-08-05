// Custom Application Error Class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Async handler wrapper to catch unhandled promise rejections in routes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.error(`[SERVER ERROR] ${req.method} ${req.originalUrl}:`, err.message);

  if (process.env.NODE_ENV === 'production') {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.isOperational ? err.message : 'An internal server error occurred.'
    });
  }

  // Development environment response (includes detailed message & stack)
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    stack: err.stack
  });
};

module.exports = {
  AppError,
  asyncHandler,
  errorHandler
};
