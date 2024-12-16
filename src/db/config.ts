import mongoose from "mongoose";
import dataModels from '@/models/dataModels';
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("MongoDB connected");
  } catch (err) {
    console.error('Database connection error:', err);
  }
};

export default connectDB;
