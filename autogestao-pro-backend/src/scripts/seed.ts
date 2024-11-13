// src/scripts/seed.ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Vehicle } from '../models/Vehicle';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Conectado ao MongoDB');

    // Limpar dados existentes
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    console.log('Dados existentes removidos');

    // Criar usuário admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Administrador',
      email: 'admin@autogestao.com',
      password: adminPassword,
      role: 'admin',
      active: true
    });
    console.log('Usuário admin criado');

    // Criar alguns veículos de exemplo
    const vehicles = await Vehicle.insertMany([
      {
        model: 'Honda Civic',
        brand: 'Honda',
        year: 2022,
        price: 120000,
        status: 'Disponível',
        color: 'Preto',
        details: {
          km: 15000,
          fuel: 'Flex',
          transmission: 'Automático',
          features: ['Ar condicionado', 'Direção hidráulica', 'Vidros elétricos']
        },
        createdBy: admin._id
      },
      {
        model: 'Toyota Corolla',
        brand: 'Toyota',
        year: 2021,
        price: 110000,
        status: 'Disponível',
        color: 'Prata',
        details: {
          km: 25000,
          fuel: 'Flex',
          transmission: 'Automático',
          features: ['Ar condicionado', 'Direção elétrica', 'Multimídia']
        },
        createdBy: admin._id
      },
      {
        model: 'Hyundai HB20',
        brand: 'Hyundai',
        year: 2023,
        price: 75000,
        status: 'Disponível',
        color: 'Branco',
        details: {
          km: 0,
          fuel: 'Flex',
          transmission: 'Manual',
          features: ['Ar condicionado', 'Direção hidráulica', 'Travas elétricas']
        },
        createdBy: admin._id
      }
    ]);

    console.log('Veículos de exemplo criados');
    console.log(`Foram criados ${vehicles.length} veículos`);

    console.log('\nDados de acesso do admin:');
    console.log('Email: admin@autogestao.com');
    console.log('Senha: admin123');

  } catch (error) {
    console.error('Erro ao popular banco de dados:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado do MongoDB');
  }
};

seedDatabase();