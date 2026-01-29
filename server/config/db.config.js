import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

let isConnected = false;

const connectDB = async () => {
  // If already connected, return
  if (isConnected) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`💾 Database: MongoDB Atlas (Cloud)`);
    return conn;
  } catch (error) {
    isConnected = false;
    console.log(`⚠️  MongoDB Atlas unavailable: ${error.message}`);
    console.log(`🔄 Falling back to IN-MEMORY storage`);
    console.log(`📝 Note: Data will NOT persist after server restart`);
    throw error; // Throw to trigger fallback
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  console.error(`❌ MongoDB error: ${err.message}`);
});

export const isMongoDBConnected = () => isConnected;

export default connectDB;
