// src/models/User.ts
import mongoose, { Document, Schema, Types } from 'mongoose';

// Interfaz del usuario
export interface IUser extends Document {
  _id: Types.ObjectId;
  name?: string;
  email: string;
  password: string;
  isVerified: boolean;
  verifyToken?: string | undefined;
  verifyTokenExpires?: Date | undefined;
}

// Esquema (usa SOLO isVerified)
const UserSchema = new Schema<IUser>({
  name: { type: String },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verifyToken: { type: String },
  verifyTokenExpires: { type: Date },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
