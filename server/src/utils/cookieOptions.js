import { env } from '../config/env.js';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Centralized options for setting HttpOnly authentication cookies.
 */
export const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: ONE_DAY_MS,
});

/**
 * Centralized options for clearing the authentication cookie upon logout.
 */
export const getClearAuthCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
});

/**
 * Options for CSRF token cookie accessible by client-side JavaScript.
 */
export const getCsrfCookieOptions = () => ({
  httpOnly: false, // Must be readable by client JavaScript to attach in request header
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: ONE_DAY_MS,
});
