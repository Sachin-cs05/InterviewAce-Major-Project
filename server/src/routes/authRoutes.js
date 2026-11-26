import { Router } from 'express';
import { signup, login, getMe, logout } from '../controllers/authController.js';
import { issueCsrfToken, csrfProtection } from '../middleware/csrfMiddleware.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { signupSchema, loginSchema } from '../validators/authValidator.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { loginRateLimiter, signupRateLimiter } from '../middleware/rateLimitMiddleware.js';

const router = Router();

// GET /api/auth/csrf - Retrieve a fresh CSRF token
router.get('/csrf', issueCsrfToken);

// POST /api/auth/signup - Register a new candidate
router.post(
  '/signup',
  signupRateLimiter,
  csrfProtection,
  validate(signupSchema),
  asyncHandler(signup)
);

// POST /api/auth/login - Authenticate existing candidate
router.post(
  '/login',
  loginRateLimiter,
  csrfProtection,
  validate(loginSchema),
  asyncHandler(login)
);

// GET /api/auth/me - Retrieve current authenticated session
router.get('/me', authenticateUser, asyncHandler(getMe));

// POST /api/auth/logout - Invalidate session and clear auth cookie
router.post('/logout', authenticateUser, csrfProtection, asyncHandler(logout));

export default router;
