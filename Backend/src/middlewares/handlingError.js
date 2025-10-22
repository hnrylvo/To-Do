const AppError = require('../utils/AppError');

// Centralized error handler
function handlingError(err, req, res, next) {
  // If it's an AppError (operational), use its properties
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: true,
      code: err.code,
      message: err.message
    });
  }

  // For validation errors from express-validator, they may come as objects
  if (err?.errors && Array.isArray(err.errors)) {
    return res.status(400).json({
      error: true,
      code: 'VALIDATION_ERROR',
      message: err.errors.map(e => e.msg).join(', ')
    });
  }

  // Unknown error -> don't leak details in production
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: true,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong!'
  });
}

module.exports = handlingError;
