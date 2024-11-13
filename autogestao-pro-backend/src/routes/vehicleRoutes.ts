// src/routes/vehicleRoutes.ts
import { Router } from 'express';
import { vehicleController } from '../controllers/vehicleController';
import { auth } from '../middlewares/auth';
import { body } from 'express-validator';
import { validate } from '../middlewares/validate';

const router = Router();

// Validações
const vehicleValidation = [
  body('model').notEmpty().trim().withMessage('Modelo é obrigatório'),
  body('brand').notEmpty().trim().withMessage('Marca é obrigatória'),
  body('year').isInt({ min: 1900 }).withMessage('Ano inválido'),
  body('price').isFloat({ min: 0 }).withMessage('Preço inválido'),
  body('color').notEmpty().trim().withMessage('Cor é obrigatória'),
  validate
];

// Rotas
router.get('/', vehicleController.getAll);
router.get('/:id', vehicleController.getById as any);
router.post('/', auth as any, vehicleValidation as any, vehicleController.create as any);
router.put('/:id', auth as any, vehicleValidation as any, vehicleController.update as any);
router.delete('/:id', auth as any, vehicleController.delete as any);
router.post('/:id/photos', auth as any, vehicleController.uploadPhotos as any);

export default router;