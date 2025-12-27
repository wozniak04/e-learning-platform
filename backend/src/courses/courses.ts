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

export default { getAllCourseTypes, getCourses, getCoursesCount };
