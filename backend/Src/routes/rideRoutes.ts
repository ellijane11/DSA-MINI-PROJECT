import express from 'express';
import { createRideRequest } from '../controllers/rideController';

const router = express.Router();

router.post('/request', createRideRequest);

export default router;
