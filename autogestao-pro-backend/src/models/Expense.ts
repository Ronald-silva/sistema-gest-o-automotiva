// src/models/Expense.ts
import mongoose, { Schema, Document } from 'mongoose';

export enum ExpenseCategory {
  RENT = 'rent',
  UTILITIES = 'utilities',
  SALARY = 'salary',
  TAX = 'tax',
  MAINTENANCE = 'maintenance',
  SUPPLIES = 'supplies',
  MARKETING = 'marketing',
  OTHER = 'other_expense'
}

export interface IExpense extends Document {
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: Date;
  paymentMethod: string;
  status: 'pending' | 'paid' | 'cancelled';
  dueDate?: Date;
  paidDate?: Date;
  relatedVehicle?: mongoose.Types.ObjectId;
  attachments?: Array<{
    name: string;
    url: string;
  }>;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
}

const expenseSchema = new Schema({
  category: {
    type: String,
    enum: Object.values(ExpenseCategory),
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
    enum: ['cash', 'bank_transfer', 'pix', 'credit_card', 'debit_card'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled'],
    default: 'paid'
  },
  dueDate: Date,
  paidDate: Date,
  relatedVehicle: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  attachments: [{
    name: String,
    url: String
  }],
  notes: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Índices
expenseSchema.index({ category: 1 });
expenseSchema.index({ date: -1 });
expenseSchema.index({ status: 1 });
expenseSchema.index({ dueDate: 1 });
expenseSchema.index({ createdBy: 1 });
expenseSchema.index({ relatedVehicle: 1 });

export const Expense = mongoose.model<IExpense>('Expense', expenseSchema);