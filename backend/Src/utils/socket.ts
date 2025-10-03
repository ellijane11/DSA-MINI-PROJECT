import { Server, Socket } from 'socket.io';
import { User } from '../models/User';

export const setupSocket = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('Client connected', socket.id);

        socket.on('driverLocationUpdate', async (data: { userId: string, coordinates: [number, number] }) => {
            await User.findByIdAndUpdate(data.userId, {
                location: { type: 'Point', coordinates: data.coordinates }
            });
            socket.broadcast.emit('driverLocationUpdated', data);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected', socket.id);
        });
    });
};
