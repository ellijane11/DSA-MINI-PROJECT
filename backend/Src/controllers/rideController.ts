import { Request, Response } from 'express';
import { Ride } from '../models/Ride';

export const createRideRequest = async (req: Request, res: Response) => {
  try {
    const { passengerId, destination, seatsNeeded } = req.body;

    const ride = new Ride({
      passenger: passengerId,
      destination,
      seatsNeeded,
      status: 'pending'
    });

    await ride.save();

    res.status(201).json({ ride });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
