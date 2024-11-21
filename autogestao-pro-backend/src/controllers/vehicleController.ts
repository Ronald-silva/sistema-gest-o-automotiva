// src/controllers/vehicleController.ts
import { Request, Response } from 'express';
import { Vehicle, IVehicleDocument } from '../models/Vehicle';
import { validationResult } from 'express-validator';
import { FilterQuery } from 'mongoose';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}

export const vehicleController = {
  // Listar veículos com paginação e filtros
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
        populate: {
          path: 'createdBy',
          select: 'name email'
        }
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

  // Criar veículo
  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const vehicle = new Vehicle({
        ...req.body,
        createdBy: req.user.id,
        photos: req.files ? 
          (req.files as Express.MulterS3.File[]).map(file => ({
            url: file.path,
            main: false
          })) : []
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

      // Atualizar campos
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

      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ error: 'Nenhuma foto enviada' });
      }

      const newPhotos = (req.files as Express.MulterS3.File[]).map(file => ({
        url: file.path,
        main: false
      }));

      vehicle.photos = [...(vehicle.photos || []), ...newPhotos];
      await vehicle.save();

      res.json(vehicle);
    } catch (error) {
      console.error('Erro ao fazer upload das fotos:', error);
      res.status(500).json({ error: 'Erro ao fazer upload das fotos' });
    }
  },

  // Definir foto principal
  async setMainPhoto(req: AuthenticatedRequest, res: Response) {
    try {
      const { vehicleId, photoId } = req.params;
      
      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }

      vehicle.photos = vehicle.photos.map(photo => ({
        ...photo,
        main: photo._id.toString() === photoId
      }));

      await vehicle.save();
      res.json(vehicle);
    } catch (error) {
      console.error('Erro ao definir foto principal:', error);
      res.status(500).json({ error: 'Erro ao definir foto principal' });
    }
  },

  // Deletar foto
  async deletePhoto(req: AuthenticatedRequest, res: Response) {
    try {
      const { vehicleId, photoId } = req.params;
      
      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }

      vehicle.photos = vehicle.photos.filter(photo => 
        photo._id.toString() !== photoId
      );

      await vehicle.save();
      res.json(vehicle);
    } catch (error) {
      console.error('Erro ao deletar foto:', error);
      res.status(500).json({ error: 'Erro ao deletar foto' });
    }
  },

  // Upload de documentos
  async uploadDocuments(req: AuthenticatedRequest, res: Response) {
    try {
      const vehicle = await Vehicle.findById(req.params.id);
      
      if (!vehicle) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }

      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ error: 'Nenhum documento enviado' });
      }

      const newDocuments = (req.files as Express.MulterS3.File[]).map(file => ({
        type: req.body.type || 'Outros',
        name: file.originalname,
        url: file.path
      }));

      vehicle.documents = [...(vehicle.documents || []), ...newDocuments];
      await vehicle.save();

      res.json(vehicle);
    } catch (error) {
      console.error('Erro ao fazer upload dos documentos:', error);
      res.status(500).json({ error: 'Erro ao fazer upload dos documentos' });
    }
  }
};