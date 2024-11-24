// src/models/Vehicle.ts
import mongoose, { Schema, Document, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// Enum para o status do veículo
export enum VehicleStatus {
  AVAILABLE = 'Disponível',
  SOLD = 'Vendido',
  MAINTENANCE = 'Em Manutenção',
}

// Interface Base
export interface IVehicleBase {
  vehicleModel: string; // Renomeado para evitar conflito com Mongoose
  brand: string;
  year: number;
  price: number;
  status: VehicleStatus;
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
    _id?: Types.ObjectId | string;
  }>;
  documents?: Array<{
    type: string;
    name: string;
    url: string;
    _id?: Types.ObjectId | string;
  }>;
  createdBy: Types.ObjectId;
}

// Interface do Documento Mongoose
export type IVehicle = IVehicleBase & Document;

// Interface para o Modelo Mongoose com Paginação
interface VehicleModel extends mongoose.PaginateModel<IVehicle> {}

// Schema do Mongoose
const vehicleSchema = new Schema<IVehicle>(
  {
    vehicleModel: { // Usando vehicleModel para evitar conflito
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
      min: 1900,
      max: new Date().getFullYear() + 1, // Permite até o próximo ano
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(VehicleStatus),
      default: VehicleStatus.AVAILABLE,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      km: {
        type: Number,
        min: 0,
      },
      fuel: {
        type: String,
        enum: ['Gasolina', 'Etanol', 'Flex', 'Diesel', 'Elétrico', 'Híbrido'],
      },
      transmission: {
        type: String,
        enum: ['Manual', 'Automático', 'CVT', 'Automatizado'],
      },
      features: [String],
    },
    photos: [
      {
        url: {
          type: String,
          required: true,
        },
        main: {
          type: Boolean,
          default: false,
        },
      },
    ],
    documents: [
      {
        type: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  }
);

// Métodos do Documento
vehicleSchema.methods.isAvailable = function (): boolean {
  return this.status === VehicleStatus.AVAILABLE;
};

vehicleSchema.methods.setMainPhoto = function (photoId: string): void {
  this.photos = this.photos.map(
    (photo: { url: string; main: boolean; _id?: Types.ObjectId | string }) => ({
      ...photo,
      main: photo._id?.toString() === photoId,
    })
  );
};

vehicleSchema.methods.addPhotos = function (
  newPhotos: Array<{ url: string; main: boolean }>
): void {
  this.photos = [...this.photos, ...newPhotos];
};

vehicleSchema.methods.removePhoto = function (photoId: string): void {
  this.photos = this.photos.filter(
    (photo: { url: string; main: boolean; _id?: Types.ObjectId | string }) =>
      photo._id?.toString() !== photoId
  );
};

// Índices para otimização
vehicleSchema.index({ vehicleModel: 1, brand: 1 });
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ price: 1 });
vehicleSchema.index({ createdBy: 1 });
vehicleSchema.index({ year: 1 });

// Plugin de paginação
vehicleSchema.plugin(mongoosePaginate);

// Exportação do Modelo
export const Vehicle = mongoose.model<IVehicle, VehicleModel>(
  'Vehicle',
  vehicleSchema
);
