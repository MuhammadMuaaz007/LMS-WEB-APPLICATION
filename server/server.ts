import { app } from "./app.js";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./utils/db.js";
import cloudinary from "cloudinary";
import http from "http";
import { initSocketServer } from "./socketServer.js";
const server = http.createServer(app);

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});
initSocketServer(server);

connectDB().then(() => {
  server.listen(process.env.PORT, () => {
    console.log(`Server is connected on the PORT:${process.env.PORT}`);
  });
});
