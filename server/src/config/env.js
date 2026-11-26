import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from the server root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Detect if running under npm test or test runner
const isRunningTests =
  process.env.npm_lifecycle_event === 'test' ||
  process.env.NODE_ENV === 'test' ||
  process.execArgv.includes('--test') ||
  process.argv.some(
    (arg) => typeof arg === 'string' && (arg.includes('--test') || arg.includes('tests') || arg.includes('.test.'))
  );

if (isRunningTests) {
  process.env.NODE_ENV = 'test';
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z
    .string()
    .default('5000')
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0 && val <= 65535, {
      message: 'PORT must be a valid integer between 1 and 65535',
    }),
  MONGODB_URI: z
    .string()
    .min(1, 'MONGODB_URI is required')
    .refine(
      (val) => val.startsWith('mongodb://') || val.startsWith('mongodb+srv://'),
      {
        message: 'MONGODB_URI must start with "mongodb://" or "mongodb+srv://"',
      }
    ),
  CLIENT_URL: z
    .string()
    .min(1, 'CLIENT_URL is required')
    .default('http://localhost:5173'),

  // Authentication configuration
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters long for cryptographic security')
    .refine(
      (val) =>
        process.env.NODE_ENV !== 'production' ||
        !val.includes('replace_with_a_secure_random_secret'),
      {
        message: 'Default placeholder JWT_SECRET is not permitted in production',
      }
    )
    .default(
      process.env.NODE_ENV === 'test'
        ? 'test_jwt_secret_must_be_at_least_32_characters_long_for_security'
        : undefined
    ),
  JWT_EXPIRES_IN: z.string().default('24h'),
  AUTH_COOKIE_NAME: z.string().default('interviewace_token'),
});

// In test environment, target the dedicated test database to isolate tests
const resolvedMongoUri =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/interviewace_test'
    : process.env.MONGODB_URI;

let parsedEnv;

try {
  parsedEnv = envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGODB_URI: resolvedMongoUri,
    CLIENT_URL: process.env.CLIENT_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    AUTH_COOKIE_NAME: process.env.AUTH_COOKIE_NAME,
  });
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('\x1b[31m[Environment Configuration Error]\x1b[0m');
    error.errors.forEach((err) => {
      console.error(` - Field: "${err.path.join('.')}" | Issue: ${err.message}`);
    });
    console.error('Please verify your server/.env configuration and restart.\n');
  } else {
    console.error('[Environment Configuration Error]:', error);
  }

  if (process.env.NODE_ENV !== 'test') {
    process.exit(1);
  }
}

export const env = parsedEnv;
