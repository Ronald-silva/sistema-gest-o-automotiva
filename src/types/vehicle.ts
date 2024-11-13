// src/types/vehicle.ts
export interface Vehicle {
    id: number;
    model: string;
    year: number;
    price: number;
    status: 'Disponível' | 'Vendido' | 'Em Manutenção';
    color: string;
    createdAt: Date;
    updatedAt: Date;
  }