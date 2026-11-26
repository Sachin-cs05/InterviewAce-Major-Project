import mongoose from 'mongoose';
import { User } from '../src/models/User.js';
import { generateCsrfToken } from '../src/middleware/csrfMiddleware.js';
import { connectDb, disconnectDb } from '../src/config/db.js';

/**
 * Connects to the test MongoDB database using the shared connectDb helper.
 */
export const connectTestDb = async () => {
  await connectDb();
};

/**
 * Clears all test user records between test suites.
 */
export const clearTestDb = async () => {
  if (mongoose.connection.readyState === 1) {
    await User.deleteMany({});
  }
};

/**
 * Closes the test database connection after tests complete.
 */
export const disconnectTestDb = async () => {
  await disconnectDb();
};

/**
 * Helper to generate matching CSRF cookie and header for supertest requests.
 * @returns {{ cookie: string, header: string }}
 */
export const getCsrfPair = () => {
  const token = generateCsrfToken();
  return {
    cookie: `interviewace_csrf=${token}`,
    header: token,
  };
};

/**
 * Extracts a specific cookie value (name=value) from the Supertest response Set-Cookie headers.
 * @param {Object} res - Supertest response
 * @param {string} cookieName - Name of the cookie
 * @returns {string|null} Cookie name=value string ready for .set('Cookie', ...)
 */
export const extractCookie = (res, cookieName) => {
  const cookies = res.headers['set-cookie'];
  if (!cookies) return null;
  const match = cookies.find((c) => c.startsWith(`${cookieName}=`));
  if (!match) return null;
  return match.split(';')[0]; // returns "name=value"
};
