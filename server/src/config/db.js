import mongoose from 'mongoose';
import { env } from './env.js';

let mockConnectionStatus = null;

/**
 * Strips user credentials from MongoDB URI for safe logging.
 * @param {string} uri
 * @returns {string} Sanitized URI
 */
const sanitizeMongoUri = (uri) => {
  if (!uri) return 'undefined';
  try {
    const parsed = new URL(uri);
    return `${parsed.protocol}//${parsed.host}${parsed.pathname}`;
  } catch {
    // If not a standard URL structure, mask password if present
    return uri.replace(/:([^:@]+)@/, ':***@');
  }
};

/**
 * Establishes connection to MongoDB via Mongoose.
 * @returns {Promise<typeof mongoose>}
 */
export const connectDb = async () => {
  if (mockConnectionStatus) {
    return mongoose;
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  const sanitizedUri = sanitizeMongoUri(env.MONGODB_URI);

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[Database] MongoDB connected successfully to ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Connection to ${sanitizedUri} failed: ${error.message}`);
    throw error;
  }
};

/**
 * Disconnects from MongoDB gracefully.
 */
export const disconnectDb = async () => {
  if (mockConnectionStatus) {
    mockConnectionStatus = null;
    return;
  }

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('[Database] MongoDB connection closed.');
  }
};

/**
 * Returns the current database connection state.
 * @returns {'connected' | 'connecting' | 'disconnecting' | 'disconnected'}
 */
export const getConnectionStatus = () => {
  if (mockConnectionStatus) {
    return mockConnectionStatus;
  }

  switch (mongoose.connection.readyState) {
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    case 0:
    default:
      return 'disconnected';
  }
};

/**
 * Internal helper for testing database health failure scenarios without live network operations.
 * @param {'connected' | 'disconnected' | null} status
 */
export const setMockConnectionStatus = (status) => {
  mockConnectionStatus = status;
};

// Monitor ongoing connection events
mongoose.connection.on('error', (err) => {
  console.error('[Database Error] Mongoose runtime connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[Database] Mongoose disconnected from MongoDB.');
});
