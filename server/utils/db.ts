import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const dbUrl = process.env.DB_URL;

    if (!dbUrl) {
      throw new Error("DB_URL is missing");
    }

    const connection = await mongoose.connect(dbUrl);

    console.log(
      `MongoDB connected: ${connection.connection.host}`
    );

  } catch (error:any) {
    console.log("MongoDB Error:", error.message);

    setTimeout(connectDB, 5000);
  }
};

export default connectDB;