// src/models/Vehicle.ts
import { Schema, model, Document, Types, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// Interface base do veículo
export interface IVehicleBase {
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
  photos?: Array<{
    url: string;
    main: boolean;
  }>;
  documents?: Array<{
    type: string;
    name: string;
    url: string;
  }>;
  createdBy: Types.ObjectId;
}

// Interface para o documento do Mongoose
export type IVehicleDocument = Document & IVehicleBase;

// Interface para o modelo com paginação
export interface IVehicleModel extends PaginateModel<IVehicleDocument> {}

// Definição do schema
const vehicleSchema = new Schema({
  model: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Disponível', 'Vendido', 'Em Manutenção'],
    default: 'Disponível'
  },
  color: { type: String, required: true, trim: true },
  details: {
    type: {
      km: { type: Number },
      fuel: { type: String },
      transmission: { type: String },
      features: [{ type: String }]
    },
    required: false
  },
  photos: [{
    url: { type: String },
    main: { type: Boolean }
  }],
  documents: [{
    type: { type: String },
    name: { type: String },
    url: { type: String }
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Adiciona plugin de paginação
vehicleSchema.plugin(mongoosePaginate);

// Índices
vehicleSchema.index({ model: 1, brand: 1 });
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ price: 1 });
vehicleSchema.index({ createdBy: 1 });

// Exporta o modelo
export const Vehicle = model<IVehicleDocument, IVehicleModel>('Vehicle', vehicleSchema);