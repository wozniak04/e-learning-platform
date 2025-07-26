import express, { Request, Response } from "express";
import auth from "./auth/auth";
import cookieParser from "cookie-parser";
import rateLimiter from "./middleware/rate-limiter";
import csrfProtection from "./middleware/csrfProtection";
import { authenticateJWT } from "./middleware/authenticatejwt";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("init");
});
app.get("/login", rateLimiter.loginLimiter, auth.loging);
app.post(
  "/register",
  csrfProtection,
  rateLimiter.registerLimiter,
  auth.register
);
app.post("/logout", csrfProtection, auth.logout);
app.get(
  "/csrf-token",
  authenticateJWT,
  csrfProtection,
  (req: Request, res: Response) => {
    res.json({ csrfToken: req.csrfToken() });
  }
);
const port = process.env.PORT ? process.env.PORT : 3000;
app.listen(port, () => {
  console.log(`starting server at port ${port}...`);
});
