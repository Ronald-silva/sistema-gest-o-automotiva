// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './authRoutes';
import vehicleRoutes from './vehicleRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);

export default router;