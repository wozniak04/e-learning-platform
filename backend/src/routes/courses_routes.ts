import { Router, Request, Response } from "express";
import courses from "../courses/coursesActionsIndex";
import { upload } from "../middleware/images";
import { authenticateJWT } from "../middleware/authenticatejwt";
import csrfProtection from "../middleware/csrfProtection";

const whoisthis = (req: Request, res: Response, next: Function) => {
    console.log(req.method, req.originalUrl, "from", req.ip);
    next();
};

const coursesRoutes = Router();

coursesRoutes.get("/", whoisthis, courses.getCourses);

coursesRoutes.get("/saved", authenticateJWT, courses.getSavedCoursesByUserid);

coursesRoutes.get("/:id", whoisthis, courses.getCourseById);

coursesRoutes.post(
    "/:id/sign",
    whoisthis,
    csrfProtection,
    authenticateJWT,
    courses.signupToCourse
);

coursesRoutes.delete(
    "/:id/unsign",
    whoisthis,
    csrfProtection,
    authenticateJWT,
    courses.unsingCourse
);

coursesRoutes.post(
    "/create",
    whoisthis,
    csrfProtection,
    authenticateJWT,
    upload.single("img"),
    courses.createNewCourse
);

coursesRoutes.post(
    "/:id/publish",
    whoisthis,
    csrfProtection,
    authenticateJWT,
    courses.publishCourse
);

coursesRoutes.delete(
    "/:id",
    whoisthis,
    csrfProtection,
    authenticateJWT,
    courses.deleteCourseById
);

coursesRoutes.put(
    "/:id/edit",
    whoisthis,
    csrfProtection,
    authenticateJWT,
    upload.single("img"),
    courses.editCourseById
);

coursesRoutes.post(
    "/:id/material",
    whoisthis,
    csrfProtection,
    authenticateJWT,
    courses.addCourseMaterial
);

coursesRoutes.put(
    "/:id/material/edit",
    whoisthis,
    csrfProtection,
    authenticateJWT,
    courses.editCourseMaterial
);

coursesRoutes.delete(
    "/:id/material/:page",
    whoisthis,
    csrfProtection,
    authenticateJWT,
    courses.deleteCourseMaterial
);

coursesRoutes.get(
    "/:id/material/count",
    whoisthis,
    authenticateJWT,
    courses.getCourseMaterialsCount
);

coursesRoutes.get(
    "/:id/material",
    whoisthis,
    authenticateJWT,
    courses.getCourseMaterial
);

coursesRoutes.get("/:id/comments", whoisthis, courses.getCourseComments);

coursesRoutes.post(
    "/:id/comment",
    whoisthis,
    csrfProtection,
    authenticateJWT,
    courses.addCourseReview
);

coursesRoutes.delete(
    "/:id/comments",
    whoisthis,
    csrfProtection,
    authenticateJWT,
    courses.deleteCourseReview
);

export default coursesRoutes;
