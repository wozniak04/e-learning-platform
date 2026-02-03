import express, { Express } from "express";
import cookieParser from "cookie-parser";
import logger from "../middleware/logger";
import { Server as SocketServer } from "socket.io";

export const setupMiddleware = (
  app: Express,
  io: SocketServer
) => {
  app.use(express.json());
  app.use(cookieParser());
  app.use(logger);


  app.use((req, res, next) => {
    req.io = io;
    next();
  });
};
