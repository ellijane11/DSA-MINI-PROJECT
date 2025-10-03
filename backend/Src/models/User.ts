import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'driver' | 'passenger';
  location?: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
  carInfo?: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['driver', 'passenger'], required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  carInfo: { type: String }
});

UserSchema.index({ location: "2dsphere" });

export const User = model<IUser>('User', UserSchema);
