// src/models/Transaction.ts
import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// Enums para tipos de transação, categorias e status
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum CategoryType {
  FOOD = 'food',
  TRANSPORT = 'transport',
  HEALTH = 'health',
  EDUCATION = 'education',
  ENTERTAINMENT = 'entertainment',
  OTHER = 'other',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Interface base para os campos de uma transação
export interface ITransactionBase {
  type: TransactionType;
  category: CategoryType;
  description: string;
  amount: number;
  date: Date;
  paymentMethod: string; // Ex.: 'cash', 'credit_card', etc.
  status: TransactionStatus;
  vehicle?: Types.ObjectId; // Referência opcional para veículo
  createdBy: Types.ObjectId; // Referência ao usuário criador
  notes?: string; // Observações opcionais
}

// Interface para o documento da transação no Mongoose
export interface ITransaction extends ITransactionBase, Document {}

// Interface para o modelo com paginação
export interface TransactionModel extends mongoose.PaginateModel<ITransaction> {}

// Schema do Mongoose
const transactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(CategoryType),
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: [
        'cash',
        'credit_card',
        'debit_card',
        'bank_transfer',
        'pix',
        'check',
        'other',
      ],
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      required: true,
      default: TransactionStatus.PENDING,
    },
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  }
);

// Índices para otimização
transactionSchema.index({ type: 1 });
transactionSchema.index({ category: 1 });
transactionSchema.index({ createdBy: 1 });
transactionSchema.index({ date: 1 });

// Plugin de paginação
transactionSchema.plugin(mongoosePaginate);

// Exportação do modelo
export const Transaction = mongoose.model<ITransaction, TransactionModel>(
  'Transaction',
  transactionSchema
);
