import { Router, Request, Response } from "express";
import authRoutes from "./auth_routes";
import coursesRoutes from "./courses_routes";
import adsRoutes from "./add_route";

const whoisthis = (req: Request, res: Response, next: Function) => {
  console.log(req.method, req.originalUrl, "from", req.ip);
  next();
};

const router = Router();
router.get("/", (req: Request, res: Response) => {
  res.send("init");
});

router.use("/auth", authRoutes);
router.use("/courses", coursesRoutes);
router.use("/reklamy", adsRoutes);

export default router;
