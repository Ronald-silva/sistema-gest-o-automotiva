// src/middlewares/validate.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    errors: errors.array().map((err: ValidationError) => ({
      field: err.type === 'field' ? err.path : '',
      message: err.msg
    }))
  });
};

export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      error: 'ID inválido'
    });
  }

  next();
};