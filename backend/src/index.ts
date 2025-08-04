declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
import express, { Request, Response } from "express";
import auth from "./auth/auth";
import cookieParser from "cookie-parser";
import rateLimiter from "./middleware/rate-limiter";
import csrfProtection from "./middleware/csrfProtection";
import { authenticateJWT } from "./middleware/authenticatejwt";
import dotenv from "dotenv";
import cors from "cors";
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
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const host = process.env.HOST || "0.0.0.0";
app.listen(port, host, () => {
  console.log(`starting server at url http://${host}:${port}`);
});
