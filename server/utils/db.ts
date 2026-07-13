import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl: string = process.env.DB_URL || "";
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    const data = await mongoose.connect(dbUrl);
    isConnected = true;
    console.log(`MongoDB connected with server: ${data.connection.host}`);
  } catch (error: any) {
    console.log(error.message);
    setTimeout(connectDB, 5000); // fine on Railway/Render since process stays alive
  }
};

export default connectDB;