import { Router, Request, Response } from "express";
import auth from "./auth/auth";
import rateLimiter from "./middleware/rate-limiter";
import csrfProtection from "./middleware/csrfProtection";
import { authenticateJWT } from "./middleware/authenticatejwt";
import courses from "./courses/courses";

const whoisthis = (req: Request, res: Response, next: Function) => {
  console.log(req.method, req.originalUrl, "from", req.ip);
  next();
};
const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("init");
});
router.post(
  "/login",
  whoisthis,
  csrfProtection,
  rateLimiter.loginLimiter,
  auth.loging
);
router.post(
  "/login/google",
  whoisthis,
  csrfProtection,
  auth.loging_with_google
);
router.post(
  "/register",
  whoisthis,
  csrfProtection,
  rateLimiter.registerLimiter,
  auth.register
);
router.delete("/logout", whoisthis, csrfProtection, auth.logout);
router.get("/csrf-token", csrfProtection, (req: Request, res: Response) => {
  res.json({ csrfToken: req.csrfToken() });
});
router.get("/me", authenticateJWT, (req: Request, res: Response) => {
  res.json({ user: req.user.login });
});
router.get(
  "/courses/create/get_all_course_types",
  whoisthis,
  courses.getAllCourseTypes
);
router.get("/courses", whoisthis, courses.getCourses);
router.get("/courses/count", whoisthis, courses.getCoursesCount);

export default router;
