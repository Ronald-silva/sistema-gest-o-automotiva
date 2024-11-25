// src/middlewares/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface JwtPayload {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
      token?: string;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Log do header para debug
    console.log('Auth Header:', req.header('Authorization'));

    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('No token provided');
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;
    console.log('Decoded token:', decoded);

    const user = await User.findOne({ _id: decoded.id, active: true });
    
    if (!user) {
      console.log('User not found or inactive');
      throw new Error('User not found');
    }

    req.user = {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email
    };
    req.token = token;

    console.log('Auth successful for user:', user.email);
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Por favor, faça login.' });
  }
};