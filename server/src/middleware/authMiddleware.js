import { env } from '../config/env.js';
import { verifyToken } from '../utils/tokenUtils.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.js';

/**
 * Middleware that authenticates requests using the HttpOnly JWT session cookie.
 */
export const authenticateUser = async (req, res, next) => {
  try {
    // 1. Read token from HttpOnly cookie (or Authorization header fallback for automated testing)
    let token = req.cookies ? req.cookies[env.AUTH_COOKIE_NAME] : null;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ApiError(401, 'Authentication required. Please log in to proceed.'));
    }

    // 2. Verify token signature and claims
    const decoded = verifyToken(token);

    // 3. Find user in database and check tokenVersion
    const user = await User.findById(decoded.sub).select('+tokenVersion');

    if (!user) {
      return next(new ApiError(401, 'User account associated with this session no longer exists.'));
    }

    // 4. Invalidate if tokenVersion does not match (session revoked via logout or password change)
    if (user.tokenVersion !== decoded.tokenVersion) {
      return next(
        new ApiError(401, 'Session has expired or was revoked. Please log in again.')
      );
    }

    // 5. Attach sanitized user document to request
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
