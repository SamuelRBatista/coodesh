import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // já vai ler o .env na raiz do backend

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.log('MONGO_URI not set, skipping MongoDB connection');
      return;
    }
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.log('MongoDB connection failed:', error.message);
  }
};

export default connectDB;
