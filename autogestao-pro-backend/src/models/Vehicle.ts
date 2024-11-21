// src/models/Vehicle.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicle extends Document {
  model: string;
  brand: string;
  year: number;
  price: number;
  status: 'Disponível' | 'Vendido' | 'Em Manutenção';
  color: string;
  details?: {
    km?: number;
    fuel?: string;
    transmission?: string;
    features?: string[];
  };
  photos: Array<{
    url: string;
    main: boolean;
  }>;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const vehicleSchema = new Schema({
  model: {
    type: String,
    required: true,
    trim: true,
  },
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Disponível', 'Vendido', 'Em Manutenção'],
    default: 'Disponível',
  },
  color: {
    type: String,
    required: true,
    trim: true,
  },
  details: {
    km: Number,
    fuel: String,
    transmission: String,
    features: [String],
  },
  photos: [{
    url: String,
    main: {
      type: Boolean,
      default: false
    }
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true
});

export const Vehicle = mongoose.model<IVehicle>('Vehicle', vehicleSchema);