import rateLimit from 'express-rate-limit';

/**
 * Skip rate limiting during automated test runs.
 */
const skipIfTest = () =>
  process.env.NODE_ENV === 'test' ||
  process.env.npm_lifecycle_event === 'test' ||
  process.argv.some(
    (arg) => typeof arg === 'string' && (arg.includes('--test') || arg.includes('tests'))
  );

/**
 * Global API rate limiter:
 * Limits each IP to 100 requests per 15 minutes window.
 */
export const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  skip: skipIfTest,
  standardHeaders: true,
  legacyHeaders: false,
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

/**
 * Strict login rate limiter:
 * 10 attempts per 15 minutes per IP.
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skip: skipIfTest,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again after 15 minutes.',
      errors: [
        {
          code: 'LOGIN_RATE_LIMIT_EXCEEDED',
          detail: 'Account access is temporarily rate-limited for security.',
        },
      ],
    });
  },
});

/**
 * Strict signup rate limiter:
 * 5 attempts per 1 hour per IP.
 */
export const signupRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  skip: skipIfTest,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many registration attempts. Please try again later.',
      errors: [
        {
          code: 'SIGNUP_RATE_LIMIT_EXCEEDED',
          detail: 'Account creation rate limit reached.',
        },
      ],
    });
  },
});

/**
 * Strict password change rate limiter:
 * 5 attempts per 15 minutes per IP.
 */
export const passwordChangeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skip: skipIfTest,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many password change attempts. Please try again later.',
      errors: [
        {
          code: 'PASSWORD_CHANGE_RATE_LIMIT_EXCEEDED',
          detail: 'Password change operations are rate-limited for security.',
        },
      ],
    });
  },
});
