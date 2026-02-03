import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import { connectRedis } from "./config/redis";
import { setupCors } from "./config/cors";
import { setupSocket } from "./config/socket";
import { setupMiddleware } from "./config/middleware";
import router from "./routes/routes";
import { setupChatSocket } from "./chatSocket";
import "./config/types";

dotenv.config();

const app = express();
const httpServer = createServer(app);

setupCors(app);
const io = setupSocket(httpServer);
setupMiddleware(app, io);

app.use("/", router);

setupChatSocket(io);


const startServer = async () => {
  try {
    await connectRedis();
    const port = process.env.PORT ? Number(process.env.PORT) : 3000;


    httpServer.listen(port, () => {
      console.log(`Server ready at http://localhost:${port}`);
      console.log(`WebSockets & SSE enabled on the same port`);
    });

    httpServer.on("error", (err) => {
      console.error("Failed to start server:", err);
    });
  } catch (error) {
    console.error("Redis connection failed:", error);
    process.exit(1);
  }
};

startServer();

export { io };
export default app;