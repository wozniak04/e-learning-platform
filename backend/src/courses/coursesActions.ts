import { Request, Response } from "express";
import courseDB from "../operations_with_db/courses";

const getAllCourseTypes = async (req: Request, res: Response) => {
  try {
    const result = await courseDB.getAllCourseTypes();
    if (!result) {
      return res.status(500).json({ message: "Failed to fetch course types" });
    }
    //console.log("Course types fetched:", result);
    return res.status(200).json({ courseTypes: result });
  } catch (error) {
    console.error("Error fetching course types:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getCourses = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 12;
    const page = parseInt(req.query.page as string) || 1;
    const offset = (page - 1) * limit;

    const { type, search, sort } = req.query;
    const result = await courseDB.getCourses(
      type as string | null,
      search as string | null,
      sort as string | null,
      limit,
      offset
    );
    if (!result) {
      return res.status(500).json({ message: "Failed to fetch courses" });
    }
    return res.status(200).json({ courses: result });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getCoursesCount = async (req: Request, res: Response) => {
  try {
    const { type, search } = req.query;
    const result = await courseDB.getCoursesCount(
      type as string | null,
      search as string | null
    );
    if (!result) {
      return res.status(500).json({ message: "Failed to fetch courses count" });
    }
    return res.status(200).json({ count: result });
  } catch (error) {
    console.error("Error fetching courses count:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getCourseDetailById = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id;
    const result = await courseDB.getCourseById(courseId);
    if (!result) {
      return res.status(404).json({ message: "Course not found" });
    }
    return res.status(200).json({ course: result });
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const signupToCourse = async (req: Request, res: Response) => {
  try {
    const courseId = req.body.courseId;
    const userId = req.user.sub;
    if (!courseId || !userId)
      return res.status(400).json({ message: "bad request" });

    const result = await courseDB.signToCourse(userId, courseId);
    if (!result) return res.status(500);
    res.status(200).json({ message: "signed to course" });
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getSavedCoursesByUserid = async (req: Request, res: Response) => {
  try {
    console.log("dupa");
    const userId = req.user.sub;
    console.log(userId);
    if (!userId) return res.status(400).json({ message: "bad request" });
    const result = await courseDB.getSavedCourses(userId);
    if (!result) return res.status(404);

    res.status(200).json({ savedCourses: result });
  } catch (error) {
    console.error("Error fetching Saved Courses", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const removeSavedCourse = async (req: Request, res: Response) => {
  try {
    const courseId = req.body.courseId;
    const userId = req.user.sub;
    if (!courseId || !userId) res.status(400).json("bad request");

    const result = await courseDB.removeSavedCourse(userId, courseId);
    if (!result)
      res.status(404).json({ message: "couldn't remove course from saved" });

    res.status(200).json({ message: "removed course from saved" });
  } catch (error) {
    console.error("error while removing course from saved: ", error);
    res.status(500).json({ message: "error while removing course from saved" });
  }
};

export default {
  getAllCourseTypes,
  getCourses,
  getCoursesCount,
  getCourseDetailById,
  signupToCourse,
  getSavedCoursesByUserid,
  removeSavedCourse,
};
