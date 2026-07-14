import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import http from "http";

dotenv.config();

const server = http.createServer(app);

connectDB().then(() => {
  server.listen(process.env.PORT, () => {
    console.log(
      `Server running on PORT ${process.env.PORT}`
    );
  });
});