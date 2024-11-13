// src/routes/authRoutes.ts
import { Router } from 'express';
import { authController } from '../controllers/authController';
import { auth } from '../middlewares/auth';
import { body } from 'express-validator';
import { validate } from '../middlewares/validate';

const router = Router();

// Validações
const registerValidation = [
  body('name').notEmpty().trim().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
  validate
];

const loginValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória'),
  validate
];

// Rotas
router.post('/register', registerValidation as any, authController.register as any);
router.post('/login', loginValidation as any, authController.login as any);
router.get('/me', auth as any, authController.getCurrentUser as any);
router.put('/profile', auth as any, authController.updateProfile as any);

export default router;