import { Router, Request, Response } from "express";
import auth from "./auth/auth";
import rateLimiter from "./middleware/rate-limiter";
import csrfProtection from "./middleware/csrfProtection";
import { authenticateJWT } from "./middleware/authenticatejwt";
import courses from "./courses/coursesActions";
import { upload } from "./middleware/images";

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
  rateLimiter.loginLimiter,
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

router.get("/courses", whoisthis, courses.getCourses);
router.get("/courses/count", whoisthis, courses.getCoursesCount);
router.get("/courses/saved", authenticateJWT, courses.getSavedCoursesByUserid);
router.get("/courses/:id", whoisthis, courses.getCourseById);
router.post(
  "/courses/:id/sign",
  whoisthis,
  authenticateJWT,
  courses.signupToCourse
);
router.delete(
  "/courses/:id/unsign",
  whoisthis,
  authenticateJWT,
  courses.unsingCourse
);
router.post(
  "/courses/create",
  whoisthis,
  authenticateJWT,
  upload.single("img"),
  courses.createNewCourse
);
router.post(
  "/courses/:id/publish",
  whoisthis,
  authenticateJWT,
  courses.publishCourse
);
router.delete(
  "/courses/:id",
  whoisthis,
  authenticateJWT,
  courses.deleteCourseById
);
router.put(
  "/courses/:id/edit",
  whoisthis,
  authenticateJWT,
  upload.single("img"),
  courses.editCourseById
);
router.post(
  "/courses/:id/material",
  whoisthis,
  authenticateJWT,
  courses.addCourseMaterial
);
router.put(
  "/courses/:id/material/edit",
  whoisthis,
  authenticateJWT,
  courses.editCourseMaterial
);
router.delete(
  "/courses/:id/material/:page",
  whoisthis,
  authenticateJWT,
  courses.deleteCourseMaterial
);
router.get(
  "/courses/:id/material/count",
  whoisthis,
  authenticateJWT,
  courses.getCourseMaterialsCount
);
router.get(
  "/courses/:id/material",
  whoisthis,
  authenticateJWT,
  courses.getCourseMaterial
);
router.get("/courses/:id/comments", whoisthis, courses.getCourseComments);
router.post(
  "/courses/:id/comments",
  whoisthis,
  authenticateJWT,
  courses.addCourseReview
);
router.put(
  "/courses/:id/comments/edit",
  whoisthis,
  authenticateJWT,
  courses.editCourseReview
);
router.delete(
  "/courses/:id/comments",
  whoisthis,
  authenticateJWT,
  courses.deleteCourseReview
);

export default router;
