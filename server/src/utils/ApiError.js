/**
 * Standardized operational error class for InterviewAce API.
 */
export class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} [message='An error occurred'] - Human-readable error message
   * @param {Array<any>} [errors=[]] - Array of specific validation or operational issues
   * @param {string} [stack=''] - Optional stack trace override
   */
  constructor(statusCode, message = 'An error occurred', errors = [], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
