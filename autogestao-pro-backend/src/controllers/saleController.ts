// src/controllers/saleController.ts
import { Request, Response } from 'express';
import { Sale } from '../models/Sale';
import { validationResult } from 'express-validator';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}

export const saleController = {
  // Listar vendas
  async getAll(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        startDate,
        endDate
      } = req.query;

      const query: any = {};

      if (status) query.status = status;

      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate as string);
        if (endDate) query.date.$lte = new Date(endDate as string);
      }

      const sales = await Sale.find(query)
        .populate('vehicle', 'model brand year')
        .populate('createdBy', 'name')
        .sort({ date: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

      const total = await Sale.countDocuments(query);

      res.json({
        sales,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar vendas' });
    }
  },

  // Buscar venda por ID
  async getById(req: Request, res: Response) {
    try {
      const sale = await Sale.findById(req.params.id)
        .populate('vehicle', 'model brand year')
        .populate('createdBy', 'name');

      if (!sale) {
        return res.status(404).json({ error: 'Venda não encontrada' });
      }

      res.json(sale);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar venda' });
    }
  },

  // Criar venda
  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const sale = new Sale({
        ...req.body,
        createdBy: req.user.id,
        documents: req.files ? (req.files as Express.Multer.File[]).map(file => ({
          name: file.originalname,
          url: file.path
        })) : []
      });

      await sale.save();

      await sale.populate([
        { path: 'vehicle', select: 'model brand year' },
        { path: 'createdBy', select: 'name' }
      ]);

      res.status(201).json(sale);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao criar venda' });
    }
  },

  // Atualizar venda
  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const sale = await Sale.findById(req.params.id);
      if (!sale) {
        return res.status(404).json({ error: 'Venda não encontrada' });
      }

      if (req.user.role !== 'admin' && sale.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Sem permissão para editar esta venda' });
      }

      Object.assign(sale, req.body);
      await sale.save();

      await sale.populate([
        { path: 'vehicle', select: 'model brand year' },
        { path: 'createdBy', select: 'name' }
      ]);

      res.json(sale);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao atualizar venda' });
    }
  },

  // Deletar venda
  async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const sale = await Sale.findById(req.params.id);
      if (!sale) {
        return res.status(404).json({ error: 'Venda não encontrada' });
      }

      if (req.user.role !== 'admin' && sale.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Sem permissão para deletar esta venda' });
      }

      await sale.deleteOne();
      res.json({ message: 'Venda removida com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar venda' });
    }
  }
};