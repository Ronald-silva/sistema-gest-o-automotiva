// src/controllers/authController.ts
import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authController = {
  // Login
  async login(req: Request, res: Response) {
    try {
      console.log('Tentativa de login:', { email: req.body.email });
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Buscar usuário
      const user = await User.findOne({ email });
      if (!user) {
        console.log('Usuário não encontrado:', email);
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verificar senha
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        console.log('Senha incorreta para:', email);
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Gerar token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      console.log('Login bem-sucedido:', { email: user.email, role: user.role });

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

  // Registro
  async register(req: Request, res: Response) {
    try {
      console.log('Tentativa de registro:', { 
        email: req.body.email,
        role: req.body.role 
      });

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, role = 'user' } = req.body;

      // Verificar se o usuário já existe
      const userExists = await User.findOne({ email });
      if (userExists) {
        console.log('Email já cadastrado:', email);
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      // Hash da senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Criar novo usuário
      const user = new User({
        name,
        email,
        password: hashedPassword,
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

      console.log('Registro bem-sucedido:', { email: user.email, role: user.role });

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

  // Obter usuário atual
  async getCurrentUser(req: AuthenticatedRequest, res: Response) {
    try {
      const user = await User.findById(req.user?.id).select('-password');
      
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
      res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  },

  // Atualizar perfil
  async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user?.id);

      if (!user || !user.active) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Verificar email único
      if (email && email !== user.email) {
        const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
        if (emailExists) {
          return res.status(400).json({ error: 'Este email já está em uso' });
        }
        user.email = email;
      }

      // Atualizar nome
      if (name) {
        user.name = name;
      }

      // Atualizar senha
      if (currentPassword && newPassword) {
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
          return res.status(400).json({ error: 'Senha atual incorreta' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
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
      res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
  }
};