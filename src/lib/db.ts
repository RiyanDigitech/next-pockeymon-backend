import mongoose from 'mongoose';

let isConnected: boolean = false;  // Track connection state (production ke liye, multiple calls avoid)

export const connectDB = async () => {
  if (isConnected) {
    console.log('Already connected to MongoDB');
    return;
  }

  try {
        console.log('MONGODB_URI:', process.env.MONGODB_URI); // Debug log
await mongoose.connect(process.env.MONGODB_URI!);
    // await mongoose.connect(process.env.MONGODB_URI as string,{
    //     tls: true,
    // });
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};