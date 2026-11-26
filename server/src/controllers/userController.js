import { User } from '../models/User.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { getClearAuthCookieOptions } from '../utils/cookieOptions.js';
import { env } from '../config/env.js';

/**
 * Retrieves the profile of the authenticated user.
 * GET /api/users/me
 */
export const getProfile = async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, { user: req.user.toSafeObject() }, 'Profile retrieved successfully')
  );
};

/**
 * Updates profile fields for the authenticated user.
 * PATCH /api/users/me
 */
export const updateProfile = async (req, res) => {
  const { name, targetRole, experience, skills, education } = req.body;

  const updates = {};
  if (name !== undefined) updates.name = name.trim();
  if (targetRole !== undefined) updates.targetRole = targetRole.trim();
  if (experience !== undefined) updates.experience = experience.trim();
  if (skills !== undefined) updates.skills = Array.isArray(skills) ? skills : [];
  if (education !== undefined) updates.education = education.trim();

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, returnDocument: 'after', runValidators: true }
  );

  if (!updatedUser) {
    throw new ApiError(404, 'User not found');
  }

  return res.status(200).json(
    new ApiResponse(200, { user: updatedUser.toSafeObject() }, 'Profile updated successfully')
  );
};

/**
 * Updates interview preferences for the authenticated user.
 * PATCH /api/users/me/preferences
 */
export const updatePreferences = async (req, res) => {
  const { voiceEnabled, defaultInterviewType, defaultDifficulty, defaultQuestionCount } = req.body;

  const currentPrefs = req.user.preferences ? req.user.preferences.toObject() : {};

  const updatedPreferences = {
    ...currentPrefs,
    ...(voiceEnabled !== undefined && { voiceEnabled }),
    ...(defaultInterviewType !== undefined && { defaultInterviewType }),
    ...(defaultDifficulty !== undefined && { defaultDifficulty }),
    ...(defaultQuestionCount !== undefined && { defaultQuestionCount }),
  };

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { preferences: updatedPreferences } },
    { new: true, returnDocument: 'after', runValidators: true }
  );

  if (!updatedUser) {
    throw new ApiError(404, 'User not found');
  }

  return res.status(200).json(
    new ApiResponse(200, { user: updatedUser.toSafeObject() }, 'Preferences updated successfully')
  );
};

/**
 * Changes password for the authenticated user and revokes existing sessions.
 * PATCH /api/users/me/password
 */
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // 1. Retrieve user with explicitly selected passwordHash and tokenVersion
  const user = await User.findById(req.user._id).select('+passwordHash +tokenVersion');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // 2. Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(400, 'Current password is incorrect.');
  }

  // 3. Ensure new password is not identical to current
  if (currentPassword === newPassword) {
    throw new ApiError(400, 'New password cannot be identical to the current password.');
  }

  // 4. Hash new password
  const newHash = await User.hashPassword(newPassword);

  // 5. Update password and increment tokenVersion to revoke all previously issued tokens
  user.passwordHash = newHash;
  user.tokenVersion = (user.tokenVersion || 0) + 1;
  await user.save();

  // 6. Clear current session cookie
  res.clearCookie(env.AUTH_COOKIE_NAME, getClearAuthCookieOptions());

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      'Password changed successfully. Please log in again with your new password.'
    )
  );
};
