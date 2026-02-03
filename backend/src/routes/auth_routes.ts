import { Router, Request, Response } from "express";
import auth from "../auth/auth";
import rateLimiter from "../middleware/rate-limiter";
import csrfProtection from "../middleware/csrfProtection";
import { authenticateJWT } from "../middleware/authenticatejwt";

const whoisthis = (req: Request, res: Response, next: Function) => {
    console.log(req.method, req.originalUrl, "from", req.ip);
    next();
};

const authRoutes = Router();

authRoutes.post(
    "/login",
    whoisthis,
    csrfProtection,
    rateLimiter.loginLimiter,
    auth.loging
);

authRoutes.post(
    "/login/google",
    whoisthis,
    csrfProtection,
    rateLimiter.loginLimiter,
    auth.loging_with_google
);

authRoutes.post(
    "/register",
    whoisthis,
    csrfProtection,
    rateLimiter.registerLimiter,
    auth.register
);

authRoutes.delete("/logout", whoisthis, csrfProtection, auth.logout);

authRoutes.get("/csrf-token", csrfProtection, (req: Request, res: Response) => {
    res.json({ csrfToken: req.csrfToken() });
});

authRoutes.get("/me", authenticateJWT, (req: Request, res: Response) => {
    res.json({ user: req.user.login });
});

export default authRoutes;
