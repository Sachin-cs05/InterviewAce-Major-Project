import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env.js';
import { rateLimitMiddleware } from './middleware/rateLimitMiddleware.js';
import { notFoundMiddleware } from './middleware/notFoundMiddleware.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { ApiError } from './utils/ApiError.js';
import routes from './routes/index.js';

const app = express();

// Disable X-Powered-By header to avoid revealing backend framework
app.disable('x-powered-by');

// Security headers with Helmet
app.use(helmet());

// CORS configuration supporting configured frontend origins
const allowedOrigins = [env.CLIENT_URL, 'http://localhost:5173'].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new ApiError(403, `CORS policy violation: Origin "${origin}" is not authorized.`)
      );
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false, // Do not enable unless required by specific auth workflows
  })
);

// Body parsers with 1MB limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request logging (enabled in development, muted during automated tests)
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Global API rate limiting
app.use('/api', rateLimitMiddleware);

// Central API Router mounted at /api base path
app.use('/api', routes);

// 404 handler for unmatched routes
app.use(notFoundMiddleware);

// Global centralized error-handling middleware
app.use(errorMiddleware);

export default app;
