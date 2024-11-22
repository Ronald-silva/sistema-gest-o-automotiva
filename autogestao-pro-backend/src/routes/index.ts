// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './authRoutes';
import vehicleRoutes from './vehicleRoutes';
import transactionRoutes from './transactionRoutes';

const router = Router();

// Rotas da API
router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/transactions', transactionRoutes);

export default router;