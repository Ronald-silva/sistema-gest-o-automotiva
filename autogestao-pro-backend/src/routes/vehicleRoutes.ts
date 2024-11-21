// src/routes/vehicleRoutes.ts
import { Router } from 'express';
import { vehicleController } from '../controllers/vehicleController';
import { auth } from '../middlewares/auth';
import { uploadVehicleImages } from '../middlewares/uploadMiddleware';
import { body } from 'express-validator';

const router = Router();

// Validações
const vehicleValidation = [
  body('model').notEmpty().trim().withMessage('Modelo é obrigatório'),
  body('brand').notEmpty().trim().withMessage('Marca é obrigatória'),
  body('year').isInt({ min: 1900 }).withMessage('Ano inválido'),
  body('price').isFloat({ min: 0 }).withMessage('Preço inválido'),
  body('color').notEmpty().trim().withMessage('Cor é obrigatória')
];

// Rotas
router.get('/', vehicleController.getAll);
router.get('/:id', vehicleController.getById);

// Criar veículo com imagens
router.post('/', 
  auth, 
  uploadVehicleImages.array('photos', 5), // Máximo 5 fotos
  vehicleValidation, 
  vehicleController.create
);

// Upload de fotos adicionais
router.post('/:id/photos', 
  auth, 
  uploadVehicleImages.array('photos', 5),
  vehicleController.uploadPhotos
);

// Definir foto principal
router.put('/:vehicleId/photos/:photoId/main',
  auth,
  vehicleController.setMainPhoto
);

// Deletar foto
router.delete('/:vehicleId/photos/:photoId',
  auth,
  vehicleController.deletePhoto
);

export default router;