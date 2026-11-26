import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

/**
 * Global error-handling middleware for InterviewAce Express API.
 * Sanitizes error outputs to prevent leaking internal stack traces, filesystem paths, or secrets.
 */
export const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Handle invalid JSON body syntax errors from express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Invalid JSON payload in request body';
    errors = [{ code: 'INVALID_JSON_BODY', detail: err.message }];
  }

  // Handle body size payload too large errors
  if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Request payload too large (max limit is 1MB)';
    errors = [{ code: 'PAYLOAD_TOO_LARGE', detail: 'The request body exceeded the maximum allowable size.' }];
  }

  // Safe logging in development
  if (env.NODE_ENV === 'development' && statusCode >= 500) {
    console.error(`[Error 500] ${req.method} ${req.originalUrl}:`, err);
  }

  // Mask unknown 500 internal errors in production / test
  if (statusCode === 500 && !(err instanceof ApiError) && env.NODE_ENV === 'production') {
    message = 'An unexpected server error occurred. Please try again later.';
    errors = [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
