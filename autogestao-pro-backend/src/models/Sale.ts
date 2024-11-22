// src/models/Sale.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISale extends Document {
  vehicle: mongoose.Types.ObjectId;
  salePrice: number;
  customer: {
    name: string;
    document: string;
    phone: string;
    email: string;
  };
  paymentMethod: string;
  date: Date;
  notes?: string;
  status: 'pending' | 'completed' | 'cancelled';
  documents: Array<{
    type: string;
    name: string;
    url: string;
  }>;
  createdBy: mongoose.Types.ObjectId;
}

const saleSchema = new Schema({
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  salePrice: {
    type: Number,
    required: true
  },
  customer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    document: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    }
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'pix', 'financing', 'credit_card', 'debit_card'],
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  notes: String,
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'completed'
  },
  documents: [{
    type: String,
    name: String,
    url: String
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Índices
saleSchema.index({ vehicle: 1 });
saleSchema.index({ date: -1 });
saleSchema.index({ status: 1 });
saleSchema.index({ createdBy: 1 });
saleSchema.index({ 'customer.document': 1 });

// Middleware para atualizar o status do veículo quando uma venda é concluída
saleSchema.post('save', async function(doc) {
  if (doc.status === 'completed') {
    await mongoose.model('Vehicle').findByIdAndUpdate(doc.vehicle, {
      status: 'Vendido'
    });
  }
});

export const Sale = mongoose.model<ISale>('Sale', saleSchema);