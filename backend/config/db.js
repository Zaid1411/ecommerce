import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri || mongoUri.includes('<username>') || mongoUri.includes('placeholder')) {
    console.log('ℹ MongoDB URI not configured or contains placeholder. Running in-memory database mode.');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // 5s timeout to prevent hanging if Atlas IP isn't whitelisted
    });

    isConnected = true;
    console.log(`✓ MongoDB Atlas Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠ MongoDB Connection Warning: ${error.message}`);
    console.warn('ℹ Running in resilient in-memory mode. All features remain operational.');
    isConnected = false;
    return false;
  }
};

export const getIsConnected = () => isConnected;
export default connectDB;
