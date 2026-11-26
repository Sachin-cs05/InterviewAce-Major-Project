import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  updatePreferences,
  changePassword,
} from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { csrfProtection } from '../middleware/csrfMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import {
  updateProfileSchema,
  updatePreferencesSchema,
  changePasswordSchema,
} from '../validators/userValidator.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { passwordChangeRateLimiter } from '../middleware/rateLimitMiddleware.js';

const router = Router();

// All user routes require authentication
router.use(authenticateUser);

// GET /api/users/me - Get candidate profile
router.get('/me', asyncHandler(getProfile));

// PATCH /api/users/me - Update candidate profile details
router.patch(
  '/me',
  csrfProtection,
  validate(updateProfileSchema),
  asyncHandler(updateProfile)
);

// PATCH /api/users/me/preferences - Update interview preferences
router.patch(
  '/me/preferences',
  csrfProtection,
  validate(updatePreferencesSchema),
  asyncHandler(updatePreferences)
);

// PATCH /api/users/me/password - Change account password
router.patch(
  '/me/password',
  passwordChangeRateLimiter,
  csrfProtection,
  validate(changePasswordSchema),
  asyncHandler(changePassword)
);

export default router;
