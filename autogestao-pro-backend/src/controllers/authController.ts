// src/controllers/authController.ts
import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authController = {
  // Registro de usuário
  async register(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, role = 'user' } = req.body;

      // Verificar se o usuário já existe
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      // Criar novo usuário
      const user = new User({
        name,
        email,
        password,
        role,
        active: true
      });

      await user.save();

      // Gerar token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({ 
        error: 'Erro no servidor', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  },

  // Login
  async login(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Buscar usuário
      const user = await User.findOne({ email, active: true });
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verificar senha
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Gerar token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro no servidor' });
    }
  },

  // Obter usuário atual
  async getCurrentUser(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const user = await User.findById(req.user.id)
        .select('-password')
        .select('-__v');

      if (!user || !user.active) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ error: 'Erro no servidor' });
    }
  },

  // Atualizar perfil
  async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const { name, email, currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user.id);

      if (!user || !user.active) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Verificar email único se estiver mudando
      if (email && email !== user.email) {
        const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
        if (emailExists) {
          return res.status(400).json({ error: 'Email já está em uso' });
        }
        user.email = email;
      }

      // Atualizar nome se fornecido
      if (name) {
        user.name = name;
      }

      // Atualizar senha se fornecida
      if (currentPassword && newPassword) {
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
          return res.status(400).json({ error: 'Senha atual incorreta' });
        }
        user.password = newPassword;
      }

      await user.save();

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      res.status(500).json({ error: 'Erro no servidor' });
    }
  },

  // Alterar senha
  async changePassword(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user.id);

      if (!user || !user.active) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Verificar senha atual
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ error: 'Senha atual incorreta' });
      }

      // Atualizar senha
      user.password = newPassword;
      await user.save();

      res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      res.status(500).json({ error: 'Erro no servidor' });
    }
  },

  // Desativar conta
  async deactivateAccount(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const user = await User.findById(req.user.id);
      if (!user || !user.active) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      user.active = false;
      await user.save();

      res.json({ message: 'Conta desativada com sucesso' });
    } catch (error) {
      console.error('Erro ao desativar conta:', error);
      res.status(500).json({ error: 'Erro no servidor' });
    }
  },

  // Verificar token (útil para o frontend)
  async verifyToken(req: AuthenticatedRequest, res: Response) {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ valid: false });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      res.json({ valid: true, decoded });
    } catch (error) {
      res.json({ valid: false });
    }
  }
};