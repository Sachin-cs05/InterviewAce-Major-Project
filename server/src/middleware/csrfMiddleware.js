import crypto from 'node:crypto';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { getCsrfCookieOptions } from '../utils/cookieOptions.js';

export const CSRF_COOKIE_NAME = 'interviewace_csrf';
export const CSRF_HEADER_NAME = 'x-csrf-token';

const ALLOWED_ORIGINS = [env.CLIENT_URL, 'http://localhost:5173'].filter(Boolean);

/**
 * Generates a new cryptographically random CSRF token string.
 * @returns {string}
 */
export const generateCsrfToken = () => crypto.randomBytes(32).toString('hex');

/**
 * Endpoint handler to issue a fresh CSRF token and set it in the response cookie.
 */
export const issueCsrfToken = (req, res) => {
  const token = generateCsrfToken();
  res.cookie(CSRF_COOKIE_NAME, token, getCsrfCookieOptions());
  res.status(200).json({
    success: true,
    message: 'CSRF token issued successfully',
    data: { csrfToken: token },
  });
};

/**
 * Middleware that validates Origin and Double-Submit CSRF token for state-changing requests.
 */
export const csrfProtection = (req, res, next) => {
  // Safe HTTP methods do not mutate state and are excluded from CSRF checks
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  // In test mode, allow tests to pass if explicitly bypassed or header matches
  if (env.NODE_ENV === 'test' && req.headers['x-bypass-csrf-for-test'] === 'true') {
    return next();
  }

  // 1. Origin header verification
  const origin = req.headers.origin;
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return next(new ApiError(403, `CORS / CSRF untrusted origin: ${origin}`));
  }

  // 2. Double-submit cookie verification
  const cookieToken = req.cookies ? req.cookies[CSRF_COOKIE_NAME] : null;
  const headerToken = req.headers[CSRF_HEADER_NAME] || req.headers[CSRF_HEADER_NAME.toLowerCase()];

  if (!cookieToken || !headerToken) {
    return next(
      new ApiError(403, 'CSRF verification failed: Missing CSRF token in cookie or request header.')
    );
  }

  // Use timing-safe comparison to prevent timing attacks
  const cookieBuffer = Buffer.from(cookieToken);
  const headerBuffer = Buffer.from(headerToken);

  if (cookieBuffer.length !== headerBuffer.length || !crypto.timingSafeEqual(cookieBuffer, headerBuffer)) {
    return next(
      new ApiError(403, 'CSRF verification failed: Token mismatch between cookie and request header.')
    );
  }

  next();
};
