import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL!);

    console.log("✅ Mongo Connected");
    console.log(conn.connection.host);
  } catch (err) {
    console.error("❌ Mongo Error");
    console.error(err);

    throw err;
  }
};

export default connectDB;