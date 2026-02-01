import express from "express";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { connectRedis } from "./config/redis";
import router from "./routes";
import logger from "./middleware/logger";

dotenv.config();


interface userPayload {
  login: string;
  email: string;
  sub: string;
  jti: string;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user: userPayload;
      io: SocketServer;
    }
  }
}

const app = express();
const httpServer = createServer(app);

const io = new SocketServer(httpServer, {
  cors: {
    origin: [
      process.env.FRONTEND_URL as string,
      process.env.FRONTEND_URL_HOST as string,
    ],
    credentials: true,
  },
});


app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL as string,
      process.env.FRONTEND_URL_HOST as string,
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(logger);

app.use((req, res, next) => {
  req.io = io;
  next();
});


app.use("/", router);


io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});


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