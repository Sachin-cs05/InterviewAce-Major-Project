import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';

const router = Router();

// Health monitoring
router.use('/health', healthRoutes);

// Authentication & Session routes
router.use('/auth', authRoutes);

// Candidate Profile & User routes
router.use('/users', userRoutes);

export default router;
