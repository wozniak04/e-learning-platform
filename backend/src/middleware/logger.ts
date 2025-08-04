import { Request, Response, NextFunction } from "express";
function logger(req: Request, res: Response, next: NextFunction) {
  // Logger middleware
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} from ${
      req.ip
    }`
  );
  next();
}
export default logger;
