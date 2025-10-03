import { Schema, model, Document, Types } from 'mongoose';

export interface IRide extends Document {
  passenger: Types.ObjectId;
  destination: {
    type: string;
    coordinates: [number, number];
  };
  seatsNeeded: number;
  status: 'pending' | 'matched' | 'completed';
}

const RideSchema = new Schema<IRide>({
  passenger: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  destination: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  seatsNeeded: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'matched', 'completed'], default: 'pending' }
});

RideSchema.index({ destination: '2dsphere' });

export const Ride = model<IRide>('Ride', RideSchema);
