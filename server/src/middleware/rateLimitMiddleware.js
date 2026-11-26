import rateLimit from 'express-rate-limit';

/**
 * Global API rate limiter:
 * Limits each IP to 100 requests per 15 minutes window.
 */
export const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.',
      errors: [
        {
          code: 'RATE_LIMIT_EXCEEDED',
          detail: 'You have exceeded the 100 requests per 15 minutes threshold.',
        },
      ],
    });
  },
});
