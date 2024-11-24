// src/controllers/transactionController.ts
import { Request, Response } from 'express';
import { Transaction, TransactionType } from '../models/Transaction';
import { validationResult } from 'express-validator';
import { FilterQuery } from 'mongoose';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const transactionController = {
  // Listar transações com filtros e paginação
  async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 10,
        type,
        category,
        startDate,
        endDate,
        minAmount,
        maxAmount,
        status,
      } = req.query;

      const query: FilterQuery<typeof Transaction> = {};

      // Aplicar filtros
      if (type) query.type = type as string;
      if (category) query.category = category as string;
      if (status) query.status = status as string;

      // Filtro de data
      if (startDate || endDate) {
        query.date = {};
        if (startDate && !isNaN(Date.parse(startDate as string))) {
          query.date.$gte = new Date(startDate as string);
        }
        if (endDate && !isNaN(Date.parse(endDate as string))) {
          query.date.$lte = new Date(endDate as string);
        }
      }

      // Filtro de valor
      if (minAmount || maxAmount) {
        query.amount = {};
        if (minAmount) query.amount.$gte = Number(minAmount);
        if (maxAmount) query.amount.$lte = Number(maxAmount);
      }

      const options = {
        page: Number(page),
        limit: Number(limit),
        sort: { date: -1 },
        populate: [
          { path: 'vehicle', select: 'model brand year' },
          { path: 'createdBy', select: 'name' },
        ],
      };

      const transactions = await Transaction.paginate(query, options);

      // Calcular totais
      const totals = await Transaction.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$type',
            total: { $sum: '$amount' },
          },
        },
      ]);

      const summary = {
        income: totals.find((t) => t._id === TransactionType.INCOME)?.total || 0,
        expense: totals.find((t) => t._id === TransactionType.EXPENSE)?.total || 0,
      };

      res.json({
        transactions,
        summary,
        balance: summary.income - summary.expense,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao listar transações:', error.message, error.stack);
      } else {
        console.error('Erro desconhecido ao listar transações:', error);
      }
      res.status(500).json({ error: 'Erro ao buscar transações' });
    }
  },

  // Buscar transação por ID
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const transaction = await Transaction.findById(req.params.id)
        .populate('vehicle', 'model brand year')
        .populate('createdBy', 'name');

      if (!transaction) {
        res.status(404).json({ error: 'Transação não encontrada' });
        return;
      }

      res.json(transaction);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao buscar transação:', error.message, error.stack);
      }
      res.status(500).json({ error: 'Erro ao buscar transação' });
    }
  },

  // Criar transação
  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      if (!req.user) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const transaction = new Transaction({
        ...req.body,
        createdBy: req.user.id,
        attachments: req.files
          ? (req.files as Express.Multer.File[]).map((file) => ({
              name: file.originalname,
              url: file.path, // Ajuste conforme o middleware usado
            }))
          : [],
      });

      await transaction.save();

      // Populate references
      await transaction.populate([
        { path: 'vehicle', select: 'model brand year' },
        { path: 'createdBy', select: 'name' },
      ]);

      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao criar transação:', error.message, error.stack);
      }
      res.status(400).json({ error: 'Erro ao criar transação' });
    }
  },

  // Atualizar transação
  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      if (!req.user) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const transaction = await Transaction.findById(req.params.id);

      if (!transaction) {
        res.status(404).json({ error: 'Transação não encontrada' });
        return;
      }

      // Verificar permissão (admin ou criador)
      if (
        req.user.role !== 'admin' &&
        transaction.createdBy.toString() !== req.user.id
      ) {
        res.status(403).json({ error: 'Sem permissão para editar esta transação' });
        return;
      }

      // Atualizar campos
      Object.assign(transaction, req.body);
      await transaction.save();

      // Populate references
      await transaction.populate([
        { path: 'vehicle', select: 'model brand year' },
        { path: 'createdBy', select: 'name' },
      ]);

      res.json(transaction);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao atualizar transação:', error.message, error.stack);
      }
      res.status(400).json({ error: 'Erro ao atualizar transação' });
    }
  },

  // Deletar transação
  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const transaction = await Transaction.findById(req.params.id);

      if (!transaction) {
        res.status(404).json({ error: 'Transação não encontrada' });
        return;
      }

      // Verificar permissão (admin ou criador)
      if (
        req.user.role !== 'admin' &&
        transaction.createdBy.toString() !== req.user.id
      ) {
        res.status(403).json({ error: 'Sem permissão para deletar esta transação' });
        return;
      }

      await transaction.deleteOne();
      res.json({ message: 'Transação removida com sucesso' });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao deletar transação:', error.message, error.stack);
      }
      res.status(500).json({ error: 'Erro ao deletar transação' });
    }
  },

  // Relatório financeiro
  async getReport(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      const dateFilter: any = {};
      if (startDate && !isNaN(Date.parse(startDate as string))) {
        dateFilter.$gte = new Date(startDate as string);
      }
      if (endDate && !isNaN(Date.parse(endDate as string))) {
        dateFilter.$lte = new Date(endDate as string);
      }

      const report = await Transaction.aggregate([
        {
          $match: {
            date: dateFilter,
          },
        },
        {
          $group: {
            _id: {
              type: '$type',
              category: '$category',
              month: { $month: '$date' },
              year: { $year: '$date' },
            },
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            '_id.year': 1,
            '_id.month': 1,
            '_id.type': 1,
            '_id.category': 1,
          },
        },
      ]);

      res.json(report);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao gerar relatório:', error.message, error.stack);
      }
      res.status(500).json({ error: 'Erro ao gerar relatório' });
    }
  },
};
