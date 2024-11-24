// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './authRoutes';
import vehicleRoutes from './vehicleRoutes';
import transactionRoutes from './transactionRoutes';
import saleRoutes from './saleRoutes';  

const router = Router();

// Rotas da API
router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/transactions', transactionRoutes);
router.use('/sales', saleRoutes);  

export default router;