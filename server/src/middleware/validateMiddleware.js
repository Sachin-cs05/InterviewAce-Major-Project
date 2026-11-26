import { ApiError } from '../utils/ApiError.js';

/**
 * Reusable Express request validation middleware using Zod schema.
 * @param {import('zod').ZodSchema} schema
 * @returns {Function} Express middleware function
 */
export const validate = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (err) {
    if (err.errors) {
      const formattedErrors = err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return next(new ApiError(400, 'Validation failed', formattedErrors));
    }
    return next(new ApiError(400, err.message || 'Validation error'));
  }
};
