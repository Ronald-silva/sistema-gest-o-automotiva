// src/models/User.ts
import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Enum para papéis do usuário
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

// Interface para o documento do usuário
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  active: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Interface para o modelo de usuário
export interface UserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}

// Schema do Mongoose
const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  }
);

// Remove o campo `password` ao enviar o objeto JSON
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Hash da senha antes de salvar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Método estático para buscar usuário por e-mail
userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

// Índices para otimizar buscas
userSchema.index({ email: 1 });
userSchema.index({ active: 1 });

// Exportar o modelo
export const User = mongoose.model<IUser, UserModel>('User', userSchema);
