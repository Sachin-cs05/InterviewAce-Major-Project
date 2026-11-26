import app from './app.js';
import { env } from './config/env.js';
import { connectDb, disconnectDb } from './config/db.js';

/**
 * Initializes database connectivity and boots the Express HTTP listener.
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    console.log('[Server] Connecting to MongoDB...');
    await connectDb();

    // Start listening on configured port
    const server = app.listen(env.PORT, () => {
      console.log(`[Server] InterviewAce API server listening on http://localhost:${env.PORT}`);
      console.log(`[Server] Environment: ${env.NODE_ENV} | Client Origin: ${env.CLIENT_URL}`);
      console.log(`[Server] Health check endpoint: http://localhost:${env.PORT}/api/health`);
    });

    // Handle startup errors like port collision
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`[Server Error] Port ${env.PORT} is already in use. Please choose another port.`);
      } else {
        console.error('[Server Error] Server listener error:', err.message);
      }
      process.exit(1);
    });

    // Graceful shutdown handling
    const handleShutdown = (signal) => {
      console.log(`\n[Server] ${signal} signal received. Starting graceful shutdown...`);

      server.close(async () => {
        console.log('[Server] HTTP server stopped accepting new connections.');
        try {
          await disconnectDb();
          console.log('[Server] Graceful shutdown completed cleanly.');
          process.exit(0);
        } catch (dbErr) {
          console.error('[Server Error] Error during database shutdown:', dbErr.message);
          process.exit(1);
        }
      });

      // Force exit if shutdown hangs beyond 10 seconds
      setTimeout(() => {
        console.error('[Server Error] Graceful shutdown timed out after 10s. Forcing exit.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  } catch (startupError) {
    console.error('[Server Startup Failure]:', startupError.message);
    process.exit(1);
  }
};

startServer();
