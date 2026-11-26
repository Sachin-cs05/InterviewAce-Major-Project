import { Router } from 'express';
import { getHealth, getLiveness } from '../controllers/healthController.js';

const router = Router();

/**
 * @route GET /api/health
 * Full health check including database connection status
 */
router.get('/', getHealth);

/**
 * @route GET /api/health/live
 * Lightweight liveness probe verifying HTTP process execution
 */
router.get('/live', getLiveness);

export default router;
