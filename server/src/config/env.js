import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from the server root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

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
});

let parsedEnv;

try {
  parsedEnv = envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    CLIENT_URL: process.env.CLIENT_URL,
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

  // Allow test runner to complete if env validation is deliberately tested
  if (process.env.NODE_ENV !== 'test') {
    process.exit(1);
  }
}

export const env = parsedEnv;
