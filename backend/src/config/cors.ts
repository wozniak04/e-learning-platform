import cors from "cors";
import { Express } from "express";

export const setupCors = (app: Express) => {
  const origins = [
    process.env.FRONTEND_URL as string,
    process.env.FRONTEND_URL_HOST as string,
  ];

  app.use(
    cors({
      origin: origins,
      credentials: true,
    })
  );
};

export const getCorsOptions = () => {
  return {
    origin: [
      process.env.FRONTEND_URL as string,
      process.env.FRONTEND_URL_HOST as string,
    ],
    credentials: true,
  };
};
