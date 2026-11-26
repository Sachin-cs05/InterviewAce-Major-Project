/**
 * 404 Handler for undefined API routes.
 */
export const notFoundMiddleware = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
    errors: [],
  });
};
