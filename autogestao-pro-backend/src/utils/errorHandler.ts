import { Request, Response, NextFunction } from 'express';

// Interface para tipos de erros personalizados
export interface AppError extends Error {
  statusCode?: number;
}

// Função de tratamento de erros
export const handleError = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof Error) {
    // Erros conhecidos (com mensagens específicas)
    const statusCode = (error as AppError).statusCode || 500;

    console.error(`[ERROR]: ${error.message}`);
    console.error(`[STACK]: ${error.stack}`);

    res.status(statusCode).json({
      message: error.message || 'Erro interno no servidor',
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  } else {
    // Erros desconhecidos (não são instâncias de `Error`)
    console.error(`[UNKNOWN ERROR]:`, error);

    res.status(500).json({
      message: 'Erro inesperado',
      details: process.env.NODE_ENV === 'production' ? null : error,
    });
  }
};
