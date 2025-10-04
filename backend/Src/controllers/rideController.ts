import { Request, Response } from 'express';
import { Ride } from '../models/Ride';
import { findNearestDrivers } from '../services/matchingService';

export const createRideRequest = async (req: Request, res: Response) => {
  try {
    const { passengerId, pickup, destination, date, time, seatsNeeded } = req.body;
    if (!passengerId || !pickup || !destination || !date) return res.status(400).json({ message: 'Missing fields' });

    const ride = new Ride({
      passenger: passengerId,
      destination: { type: 'Point', coordinates: [destination.lng, destination.lat] },
      seatsNeeded,
      status: 'pending',
      // store extra meta in a flexible field if needed
      // @ts-ignore
      meta: { pickup, date, time }
    } as any);

    await ride.save();

    // find nearest drivers (demo) — use pickup coords
    const drivers = await findNearestDrivers(pickup.lat, pickup.lng, 5);

    res.status(201).json({ ride, drivers });
  } catch (err) {
    console.error('createRideRequest error', err);
    res.status(500).json({ error: err });
  }
};
