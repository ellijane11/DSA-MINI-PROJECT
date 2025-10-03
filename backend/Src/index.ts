import 'dotenv/config'; 
console.log('🔍 DEBUG - MONGO_URI:', process.env.MONGO_URI);
console.log('🔍 DEBUG - PORT:', process.env.PORT);

import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import rideRoutes from './routes/rideRoutes';
import { connectDB } from './utils/db';
import { setupSocket } from './utils/socket';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: { 
    origin: ["http://localhost:3000", "http://localhost:3001"], // Add your Next.js port
    credentials: true 
  }
});

// Update CORS configuration
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"], // Add your Next.js port
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);

connectDB();
setupSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
