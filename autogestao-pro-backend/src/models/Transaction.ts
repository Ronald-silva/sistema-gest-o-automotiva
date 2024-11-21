// src/models/Transaction.ts
import { Schema, model, Document, Types, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export enum TransactionType {
  INCOME = 'income',    // Receita
  EXPENSE = 'expense'   // Despesa
}

export enum CategoryType {
  // Receitas
  VEHICLE_SALE = 'vehicle_sale',      // Venda de veículo
  SERVICE = 'service',                // Serviços
  COMMISSION = 'commission',          // Comissões
  OTHER_INCOME = 'other_income',      // Outras receitas

  // Despesas
  VEHICLE_PURCHASE = 'vehicle_purchase', // Compra de veículo
  MAINTENANCE = 'maintenance',        // Manutenção
  RENT = 'rent',                      // Aluguel
  UTILITIES = 'utilities',            // Água, Luz, etc
  SALARY = 'salary',                  // Salários
  MARKETING = 'marketing',            // Marketing e Publicidade
  FUEL = 'fuel',                      // Combustível
  INSURANCE = 'insurance',            // Seguros
  TAX = 'tax',                        // Impostos
  SUPPLIES = 'supplies',              // Material de escritório
  OTHER_EXPENSE = 'other_expense'     // Outras despesas
}

export interface ITransaction extends Document {
  type: TransactionType;
  category: CategoryType;
  description: string;
  amount: number;
  date: Date;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'cancelled';
  vehicle?: Types.ObjectId;  // Referência ao veículo (opcional)
  attachments?: Array<{
    name: string;
    url: string;
  }>;
  notes?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema({
  type: {
    type: String,
    enum: Object.values(TransactionType),
    required: true
  },
  category: {
    type: String,
    enum: Object.values(CategoryType),
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'pix', 'check', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'completed'
  },
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: false
  },
  attachments: [{
    name: String,
    url: String
  }],
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Adiciona plugin de paginação
transactionSchema.plugin(mongoosePaginate);

// Índices para melhor performance
transactionSchema.index({ type: 1, date: -1 });
transactionSchema.index({ category: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdBy: 1 });
transactionSchema.index({ vehicle: 1 });

// Interface para o modelo com paginação
export interface TransactionModel extends PaginateModel<ITransaction> {}

export const Transaction = model<ITransaction, TransactionModel>('Transaction', transactionSchema);