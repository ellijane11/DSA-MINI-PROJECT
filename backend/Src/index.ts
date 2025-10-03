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
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);

connectDB();
setupSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

