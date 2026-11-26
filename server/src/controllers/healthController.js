import { getConnectionStatus } from '../config/db.js';
import { ApiResponse } from '../utils/ApiResponse.js';

/**
 * Health check endpoint:
 * Verifies that the Express API is operational and checks database connection health.
 * Returns HTTP 200 if healthy, HTTP 503 if database is disconnected.
 */
export const getHealth = (req, res) => {
  const dbStatus = getConnectionStatus();
  const isHealthy = dbStatus === 'connected';

  const healthData = {
    service: 'InterviewAce Backend',
    status: isHealthy ? 'healthy' : 'unhealthy',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  };

  if (!isHealthy) {
    return res.status(503).json(
      new ApiResponse(503, healthData, 'InterviewAce API is unhealthy: database is not connected')
    );
  }

  return res.status(200).json(
    new ApiResponse(200, healthData, 'InterviewAce API is healthy')
  );
};

/**
 * Lightweight liveness endpoint:
 * Verifies that the HTTP server process is running independently of database connectivity.
 * Always returns HTTP 200 when reachable.
 */
export const getLiveness = (req, res) => {
  const livenessData = {
    service: 'InterviewAce Backend',
    status: 'live',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  };

  return res.status(200).json(
    new ApiResponse(200, livenessData, 'InterviewAce API is live')
  );
};
