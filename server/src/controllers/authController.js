import { User } from '../models/User.js';
import { generateToken } from '../utils/tokenUtils.js';
import { getAuthCookieOptions, getClearAuthCookieOptions } from '../utils/cookieOptions.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

/**
 * Registers a new candidate account.
 * POST /api/auth/signup
 */
export const signup = async (req, res) => {
  const { name, email, password, targetRole, experience, skills, education } = req.body;

  const normalizedEmail = email.toLowerCase().trim();

  // 1. Check if user already exists
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(409, 'An account with this email address already exists.');
  }

  // 2. Hash password securely
  const passwordHash = await User.hashPassword(password);

  // 3. Create user in database
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    targetRole: targetRole || 'Software Engineer',
    experience: experience || 'Student / Fresher',
    skills: Array.isArray(skills) ? skills : [],
    education: education || '',
  });

  // 4. Generate signed JWT token
  const token = generateToken(user);

  // 5. Set HttpOnly authentication cookie
  res.cookie(env.AUTH_COOKIE_NAME, token, getAuthCookieOptions());

  // 6. Return sanitized user data without exposing token in JSON body
  return res.status(201).json(
    new ApiResponse(
      201,
      { user: user.toSafeObject() },
      'Account created successfully'
    )
  );
};

/**
 * Authenticates user credentials and issues an HttpOnly session cookie.
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Retrieve user with explicitly selected passwordHash
  const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash +tokenVersion');

  if (!user) {
    // Avoid user enumeration by using a generic error message
    throw new ApiError(401, 'Invalid email or password.');
  }

  // 2. Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  // 3. Generate signed JWT
  const token = generateToken(user);

  // 4. Set HttpOnly cookie
  res.cookie(env.AUTH_COOKIE_NAME, token, getAuthCookieOptions());

  return res.status(200).json(
    new ApiResponse(
      200,
      { user: user.toSafeObject() },
      'Login successful'
    )
  );
};

/**
 * Retrieves the currently authenticated user's profile and preferences.
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  // req.user is set by authenticateUser middleware
  return res.status(200).json(
    new ApiResponse(
      200,
      { user: req.user.toSafeObject() },
      'User retrieved successfully'
    )
  );
};

/**
 * Logs out the user, increments tokenVersion to revoke active JWTs, and clears the cookie.
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
  // Invalidate issued tokens by incrementing tokenVersion if user is authenticated
  if (req.user?._id) {
    await User.findByIdAndUpdate(req.user._id, { $inc: { tokenVersion: 1 } });
  }

  // Clear authentication cookie
  res.clearCookie(env.AUTH_COOKIE_NAME, getClearAuthCookieOptions());

  return res.status(200).json(
    new ApiResponse(200, null, 'Logged out successfully')
  );
};
