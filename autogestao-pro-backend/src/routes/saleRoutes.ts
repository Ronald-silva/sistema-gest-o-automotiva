// src/routes/saleRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { saleController } from '../controllers/saleController';
import { auth } from '../middlewares/auth';
import { body } from 'express-validator';
import { uploadDocs } from '../middlewares/uploadMiddleware';

const router = Router();

// Validações
const saleValidation = [
  body('vehicle')
    .isMongoId()
    .withMessage('ID do veículo inválido'),
  
  body('salePrice')
    .isFloat({ min: 0 })
    .withMessage('Preço de venda deve ser maior que zero'),
  
  body('customer.name')
    .notEmpty()
    .trim()
    .withMessage('Nome do cliente é obrigatório'),
  
  body('customer.document')
    .notEmpty()
    .trim()
    .withMessage('Documento do cliente é obrigatório'),
  
  body('customer.phone')
    .notEmpty()
    .trim()
    .withMessage('Telefone do cliente é obrigatório'),
  
  body('customer.email')
    .isEmail()
    .withMessage('Email do cliente inválido'),
  
  body('paymentMethod')
    .isIn(['cash', 'bank_transfer', 'pix', 'financing', 'credit_card', 'debit_card'])
    .withMessage('Método de pagamento inválido'),
  
  body('status')
    .optional()
    .isIn(['pending', 'completed', 'cancelled'])
    .withMessage('Status inválido')
];

// Handler wrappers para corrigir tipos
const getAllHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await saleController.getAll(req, res);
  } catch (error) {
    next(error);
  }
};

const getByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await saleController.getById(req, res);
  } catch (error) {
    next(error);
  }
};

const createHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await saleController.create(req as any, res);
  } catch (error) {
    next(error);
  }
};

const updateHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await saleController.update(req as any, res);
  } catch (error) {
    next(error);
  }
};

const deleteHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await saleController.delete(req as any, res);
  } catch (error) {
    next(error);
  }
};

// Rotas
router.get('/', auth, getAllHandler);
router.get('/:id', auth, getByIdHandler);

router.post('/',
  auth,
  uploadDocs.array('documents', 5),
  saleValidation,
  createHandler
);

router.put('/:id',
  auth,
  uploadDocs.array('documents', 5),
  saleValidation,
  updateHandler
);

router.delete('/:id', auth, deleteHandler);

export default router;