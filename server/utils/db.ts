import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  await mongoose.connect(process.env.DB_URL!);

  console.log(
    "MongoDB connected:",
    mongoose.connection.host
  );
};

export default connectDB;