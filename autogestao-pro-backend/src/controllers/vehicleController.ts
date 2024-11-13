// src/controllers/vehicleController.ts
import { Request, Response } from 'express';
import { Vehicle, IVehicleDocument } from '../models/Vehicle';
import { validationResult } from 'express-validator';
import { FilterQuery, Types } from 'mongoose';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}

export const vehicleController = {
  // Listar veículos com filtros e paginação
  async getAll(req: Request, res: Response) {
    try {
      const { 
        page = 1, 
        limit = 10,
        status,
        minPrice,
        maxPrice,
        brand,
        model,
        year 
      } = req.query;

      const query: FilterQuery<IVehicleDocument> = {};

      // Aplicar filtros
      if (status) query.status = status;
      if (brand) query.brand = new RegExp(String(brand), 'i');
      if (model) query.model = new RegExp(String(model), 'i');
      if (year) query.year = Number(year);
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      const options = {
        page: Number(page),
        limit: Number(limit),
        sort: { createdAt: -1 },
        populate: 'createdBy',
        select: '-documents'
      };

      const vehicles = await Vehicle.paginate(query, options);
      res.json(vehicles);
    } catch (error) {
      console.error('Erro ao listar veículos:', error);
      res.status(500).json({ error: 'Erro ao buscar veículos' });
    }
  },

  // Buscar veículo por ID
  async getById(req: Request, res: Response) {
    try {
      const vehicle = await Vehicle.findById(req.params.id)
        .populate('createdBy', 'name email');
        
      if (!vehicle) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }
      res.json(vehicle);
    } catch (error) {
      console.error('Erro ao buscar veículo:', error);
      res.status(500).json({ error: 'Erro ao buscar veículo' });
    }
  },

  // Criar novo veículo
  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const vehicle = new Vehicle({
        ...req.body,
        createdBy: new Types.ObjectId(req.user.id)
      });

      await vehicle.save();
      res.status(201).json(vehicle);
    } catch (error) {
      console.error('Erro ao criar veículo:', error);
      res.status(400).json({ error: 'Erro ao criar veículo' });
    }
  },

  // Atualizar veículo
  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const vehicle = await Vehicle.findById(req.params.id);
      
      if (!vehicle) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }

      // Verificar permissão (admin ou criador)
      if (req.user.role !== 'admin' && 
          vehicle.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Sem permissão para editar este veículo' });
      }

      Object.assign(vehicle, req.body);
      await vehicle.save();

      res.json(vehicle);
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      res.status(400).json({ error: 'Erro ao atualizar veículo' });
    }
  },

  // Deletar veículo
  async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const vehicle = await Vehicle.findById(req.params.id);
      
      if (!vehicle) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }

      // Verificar permissão (admin ou criador)
      if (req.user.role !== 'admin' && 
          vehicle.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Sem permissão para deletar este veículo' });
      }

      await vehicle.deleteOne();
      res.json({ message: 'Veículo removido com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar veículo:', error);
      res.status(500).json({ error: 'Erro ao deletar veículo' });
    }
  },

  // Upload de fotos
  async uploadPhotos(req: AuthenticatedRequest, res: Response) {
    try {
      const vehicle = await Vehicle.findById(req.params.id);
      
      if (!vehicle) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }

      // TODO: Implementar lógica de upload de fotos

      res.json(vehicle);
    } catch (error) {
      console.error('Erro no upload de fotos:', error);
      res.status(500).json({ error: 'Erro ao fazer upload das fotos' });
    }
  }
};