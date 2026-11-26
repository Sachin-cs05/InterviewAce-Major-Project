import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from './ApiError.js';

const JWT_ISSUER = 'interviewace-api';
const JWT_AUDIENCE = 'interviewace-client';

/**
 * Generates a signed JWT for an authenticated user session.
 * @param {Object} user - Mongoose User document or plain user object
 * @returns {string} Signed JWT string
 */
export const generateToken = (user) => {
  const payload = {
    sub: user._id ? user._id.toString() : user.id,
    tokenVersion: user.tokenVersion !== undefined ? user.tokenVersion : 0,
  };

  return jwt.sign(payload, env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: env.JWT_EXPIRES_IN || '24h',
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });
};

/**
 * Verifies a JWT against signature, algorithm, issuer, and audience.
 * @param {string} token - JWT string
 * @returns {Object} Decoded token payload
 * @throws {ApiError} If verification fails
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Your session has expired. Please log in again.');
    }
    if (err.name === 'JsonWebTokenError') {
      throw new ApiError(401, 'Invalid authentication token. Please log in again.');
    }
    throw new ApiError(401, 'Authentication failed.');
  }
};
