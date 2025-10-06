import { Router, Request, Response } from "express";
import auth from "./auth/auth";
import rateLimiter from "./middleware/rate-limiter";
import csrfProtection from "./middleware/csrfProtection";
import { authenticateJWT } from "./middleware/authenticatejwt";
const whoisthis = (req: Request, res: Response, next: Function) => {
  console.log(req.method, req.originalUrl, "from", req.ip);
  next();
};
const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("init");
});
router.post("/login", whoisthis, rateLimiter.loginLimiter, auth.loging);
router.post("/register", whoisthis, rateLimiter.registerLimiter, auth.register);
router.post("/logout", whoisthis, csrfProtection, auth.logout);
router.get(
  "/csrf-token",
  authenticateJWT,
  csrfProtection,
  (req: Request, res: Response) => {
    res.json({ csrfToken: req.csrfToken() });
  }
);
router.get("/me", authenticateJWT, (req: Request, res: Response) => {
  res.json({ user: req.user.login });
});

export default router;
