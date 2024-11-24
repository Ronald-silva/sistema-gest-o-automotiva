// src/controllers/vehicleController.ts
import { Request, Response } from 'express';
import { Vehicle, IVehicle } from '../models/Vehicle';
import { validationResult } from 'express-validator';
import { FilterQuery } from 'mongoose';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const vehicleController = {
  // Listar veículos com paginação e filtros
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        minPrice,
        maxPrice,
        brand,
        model,
        year,
      } = req.query;

      const query: FilterQuery<IVehicle> = {};

      // Aplicar filtros
      if (status) query.status = status as string;
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
        populate: {
          path: 'createdBy',
          select: 'name email',
        },
      };

      const vehicles = await Vehicle.paginate(query, options);
      res.json(vehicles);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao listar veículos:', error.message, error.stack);
      }
      res.status(500).json({ error: 'Erro ao buscar veículos' });
    }
  },

  // Buscar veículo por ID
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const vehicle = await Vehicle.findById(req.params.id).populate(
        'createdBy',
        'name email'
      );

      if (!vehicle) {
        res.status(404).json({ error: 'Veículo não encontrado' });
        return;
      }

      res.json(vehicle);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao buscar veículo:', error.message, error.stack);
      }
      res.status(500).json({ error: 'Erro ao buscar veículo' });
    }
  },

  // Criar veículo
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

      const vehicle = new Vehicle({
        ...req.body,
        createdBy: req.user.id,
        photos: req.files
          ? (req.files as Express.Multer.File[]).map((file) => ({
              url: file.path,
              main: false,
            }))
          : [],
      });

      await vehicle.save();
      res.status(201).json(vehicle);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao criar veículo:', error.message, error.stack);
      }
      res.status(400).json({ error: 'Erro ao criar veículo' });
    }
  },

  // Atualizar veículo
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

      const vehicle = await Vehicle.findById(req.params.id);

      if (!vehicle) {
        res.status(404).json({ error: 'Veículo não encontrado' });
        return;
      }

      // Verificar permissão (admin ou criador)
      if (
        req.user.role !== 'admin' &&
        vehicle.createdBy.toString() !== req.user.id
      ) {
        res.status(403).json({ error: 'Sem permissão para editar este veículo' });
        return;
      }

      Object.assign(vehicle, req.body);
      await vehicle.save();

      res.json(vehicle);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao atualizar veículo:', error.message, error.stack);
      }
      res.status(400).json({ error: 'Erro ao atualizar veículo' });
    }
  },

  // Deletar veículo
  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      const vehicle = await Vehicle.findById(req.params.id);

      if (!vehicle) {
        res.status(404).json({ error: 'Veículo não encontrado' });
        return;
      }

      // Verificar permissão (admin ou criador)
      if (
        req.user.role !== 'admin' &&
        vehicle.createdBy.toString() !== req.user.id
      ) {
        res.status(403).json({ error: 'Sem permissão para deletar este veículo' });
        return;
      }

      await vehicle.deleteOne();
      res.json({ message: 'Veículo removido com sucesso' });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao deletar veículo:', error.message, error.stack);
      }
      res.status(500).json({ error: 'Erro ao deletar veículo' });
    }
  },

  // Upload de fotos
  async uploadPhotos(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const vehicle = await Vehicle.findById(req.params.id);

      if (!vehicle) {
        res.status(404).json({ error: 'Veículo não encontrado' });
        return;
      }

      if (!req.files || !Array.isArray(req.files)) {
        res.status(400).json({ error: 'Nenhuma foto enviada' });
        return;
      }

      const newPhotos = (req.files as Express.Multer.File[]).map((file) => ({
        url: file.path,
        main: false,
      }));

      vehicle.photos = [...(vehicle.photos || []), ...newPhotos];
      await vehicle.save();

      res.json(vehicle);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao fazer upload das fotos:', error.message, error.stack);
      }
      res.status(500).json({ error: 'Erro ao fazer upload das fotos' });
    }
  },

  // Definir foto principal
  async setMainPhoto(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { vehicleId, photoId } = req.params;

      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) {
        res.status(404).json({ error: 'Veículo não encontrado' });
        return;
      }

      vehicle.photos = vehicle.photos.map((photo) => ({
        ...photo,
        main: photo._id?.toString() === photoId,
      }));

      await vehicle.save();
      res.json(vehicle);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao definir foto principal:', error.message, error.stack);
      }
      res.status(500).json({ error: 'Erro ao definir foto principal' });
    }
  },

  // Deletar foto
  async deletePhoto(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { vehicleId, photoId } = req.params;

      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) {
        res.status(404).json({ error: 'Veículo não encontrado' });
        return;
      }

      vehicle.photos = vehicle.photos.filter(
        (photo) => photo._id?.toString() !== photoId
      );

      await vehicle.save();
      res.json(vehicle);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao deletar foto:', error.message, error.stack);
      }
      res.status(500).json({ error: 'Erro ao deletar foto' });
    }
  },
};
