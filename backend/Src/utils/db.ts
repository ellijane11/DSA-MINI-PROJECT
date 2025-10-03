import mongoose from 'mongoose';

const mongoURI = 'mongodb://localhost:27017/ridesharedb';

export const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};
