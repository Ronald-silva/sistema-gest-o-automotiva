// src/routes/transactionRoutes.ts
import { Router } from 'express';
import { transactionController } from '../controllers/transactionController';
import { auth } from '../middlewares/auth';
import { body } from 'express-validator';
import { uploadDocs } from '../middlewares/uploadMiddleware';
import { TransactionType, CategoryType } from '../models/Transaction';

const router = Router();

// Validações
const transactionValidation = [
  body('type')
    .isIn(Object.values(TransactionType))
    .withMessage('Tipo de transação inválido'),
  
  body('category')
    .isIn(Object.values(CategoryType))
    .withMessage('Categoria inválida'),
  
  body('description')
    .notEmpty()
    .trim()
    .withMessage('Descrição é obrigatória'),
  
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Valor deve ser maior que zero'),
  
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Data inválida'),
  
  body('paymentMethod')
    .isIn(['cash', 'credit_card', 'debit_card', 'bank_transfer', 'pix', 'check', 'other'])
    .withMessage('Método de pagamento inválido'),
  
  body('status')
    .optional()
    .isIn(['pending', 'completed', 'cancelled'])
    .withMessage('Status inválido'),
  
  body('vehicle')
    .optional()
    .isMongoId()
    .withMessage('ID do veículo inválido'),
  
  body('notes')
    .optional()
    .trim()
];

// Rotas
router.get('/', auth, transactionController.getAll);
router.get('/report', auth, transactionController.getReport);
router.get('/:id', auth, transactionController.getById);

router.post('/', 
  auth,
  uploadDocs.array('attachments', 5), // Máximo 5 anexos
  transactionValidation,
  transactionController.create
);

router.put('/:id',
  auth,
  uploadDocs.array('attachments', 5),
  transactionValidation,
  transactionController.update
);

router.delete('/:id', auth, transactionController.delete);

export default router;