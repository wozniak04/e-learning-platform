declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
import express from "express";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
import cors from "cors";
import { connectRedis } from "./redis";
import router from "./routes";
import logger from "./middleware/logger";

dotenv.config();

const app = express();
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

app.use("/", router);
const startServer = async () => {
  await connectRedis();
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  app
    .listen(port, () => {
      console.log(`starting server at url http://localhost:${port}`);
    })
    .on("error", (err) => {
      console.error("Failed to start server:", err);
    });
};
startServer();
export default app;
