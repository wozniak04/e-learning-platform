import { Request, Response } from "express";
import courseDB from "../operations_with_db/courses";
import { getUserIdFromRequest } from "../middleware/authenticatejwt";

const getCourses = async (req: Request, res: Response) => {
  try {
    const { type, search, sort, limit, offset } = req.query;
    const userId = await getUserIdFromRequest(req);
    const result = await courseDB.getCourses(
      userId,
      type as string | null,
      search as string | null,
      sort as string | null,
      parseInt(limit as string) || 12,
      parseInt(offset as string) || 0
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
const getCourseById = async (req: Request, res: Response) => {
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
    const courseId = req.params.id;
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
const unsingCourse = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id;
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

const createNewCourse = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      quick_description,
      type = null,
      password = null,
    } = req.body;
    if (!title || !description || !quick_description) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const img_url = req.file ? (req.file as any).path : null;
    const userId = req.user.sub;
    const result = await courseDB.createNewCourse(
      userId,
      title,
      description,
      quick_description,
      type,
      img_url,
      password
    );
    if (!result) {
      return res.status(500).json({ message: "Failed to create new course" });
    }
    return res.status(200).json({
      message: "Course created successfully",
      courseId: result,
      imgsrc: img_url,
    });
  } catch (error) {
    console.error("Error creating new course:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const publishCourse = async (req: Request, res: Response) => {
  const courseId = req.params.id;
  const userId = req.user.sub;

  if (!courseId || !userId) {
    return res.status(400).json({ message: "bad request" });
  }
  try {
    const ownerId = await courseDB.get_course_owner_id(courseId);
    if (ownerId !== userId) {
      return res.status(403).json({ message: "forbidden" });
    }
    const result = await courseDB.publishCourse(courseId);
    if (!result) {
      return res.status(500).json({ message: "error while publishing course" });
    }
    return res.status(200);
  } catch (error) {
    console.error("error during publishin course: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const editCourseById = async (req: Request, res: Response) => {
  const courseId = req.params.id;
  const userId = req.user.sub;
  const {
    title = null,
    type = null,
    quick_description = null,
    description = null,
    password = null,
  } = req.body;
  if (!courseId || !userId) {
    return res.status(400).json({ message: "bad request" });
  }
  const img_url = req.file ? (req.file as any).path : null;
  try {
    const ownerId = await courseDB.get_course_owner_id(courseId);
    if (ownerId !== userId) {
      return res.status(403).json({ message: "forbidden" });
    }
    const result = await courseDB.editCourseById(
      courseId,
      title,
      type,
      quick_description,
      description,
      img_url,
      password
    );
    if (!result) {
      return res.status(500).json({ message: "Failed to edit course" });
    }
    return res
      .status(200)
      .json({ message: "Course edited successfully", imgsrc: img_url });
  } catch (error) {
    console.error("Error fetching course owner ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteCourseById = async (req: Request, res: Response) => {
  const courseId = req.params.id;
  const userId = req.user.sub;
  if (!courseId || !userId) {
    return res.status(400).json({ message: "bad request" });
  }
  try {
    const ownerId = await courseDB.get_course_owner_id(courseId);
    if (ownerId !== userId) {
      return res.status(403).json({ message: "forbidden" });
    }
    const result = await courseDB.deleteCourseById(courseId);
    if (!result) {
      return res.status(500).json({ message: "Failed to delete course" });
    }

    return res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course by ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const addCourseMaterial = async (req: Request, res: Response) => {
  const courseId = req.params.id;
  const userId = req.user.sub;
  const { materials } = req.body;
  if (!userId || !materials) {
    return res.status(400).json({ message: "bad request" });
  }
  try {
    const ownerId = await courseDB.get_course_owner_id(courseId);
    if (ownerId !== userId) {
      return res.status(403).json({ message: "forbidden" });
    }
    const result = await courseDB.addCourseMaterial(materials, courseId);
    if (!result) {
      return res.status(500).json({ message: "Failed to add course material" });
    }
    return res
      .status(200)
      .json({ message: "Course material added successfully" });
  } catch (error) {
    console.error("Error fetching course owner ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const editCourseMaterial = async (req: Request, res: Response) => {
  const courseId = req.params.id;
  const userId = req.user.sub;
  const { materials } = req.body;
  if (!courseId || !userId || !materials) {
    return res.status(400).json({ message: "bad request" });
  }
  try {
    const ownerId = await courseDB.get_course_owner_id(courseId);
    if (ownerId !== userId) {
      return res.status(403).json({ message: "forbidden" });
    }
    const result = await courseDB.editCourseMaterial(
      courseId,
      materials,
      ownerId
    );
    if (!result) {
      return res
        .status(500)
        .json({ message: "Failed to edit course material" });
    }
    return res
      .status(200)
      .json({ message: "Course material edited successfully" });
  } catch (error) {
    console.error("Error fetching course owner ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteCourseMaterial = async (req: Request, res: Response) => {
  const courseId = req.params.id;
  const userId = req.user.sub;
  const page = req.params.page;
  if (!courseId || !userId || !page) {
    res.status(400).json({ message: "bad request" });
  }
  try {
    const ownerId = await courseDB.get_course_owner_id(courseId);
    if (ownerId !== userId) {
      return res.status(403).json({ message: "forbidden" });
    }
    const result = await courseDB.deleteCoursePage(courseId, parseInt(page));
    if (!result) {
      return res
        .status(500)
        .json({ message: "Failed to edit course material" });
    }
    return res
      .status(200)
      .json({ message: "Course material deleted successfully" });
  } catch (error) {
    console.error("Error fetching course owner ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getCourseMaterialsCount = async (req: Request, res: Response) => {
  const courseId = req.params.id;
  const userId = req.user.sub;
  if (!courseId || !userId) {
    return res.status(400).json({ message: "bad request" });
  }
  try {
    const result = await courseDB.getCourseMaterialsCount(courseId);
    if (!result) {
      return res
        .status(500)
        .json({ message: "Failed to fetch course materials count" });
    }
    return res.status(200).json({ materialsCount: result });
  } catch (error) {
    console.error("Error fetching course owner ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getCourseMaterial = async (req: Request, res: Response) => {
  const courseId = req.params.id;
  const startPage = req.query.startpage
    ? parseInt(req.query.startpage as string)
    : null;
  const endPage = req.query.endpage
    ? parseInt(req.query.endpage as string)
    : null;
  try {
    const result = await courseDB.get_Course_material(
      courseId,
      startPage as Number,
      endPage as Number
    );
    if (!result) {
      return res
        .status(500)
        .json({ message: "Failed to fetch course material" });
    }
    return res.status(200).json({ courseMaterial: result });
  } catch (error) {
    console.error("Error fetching course material:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getCourses,
  getCoursesCount,
  getCourseById,
  signupToCourse,
  getSavedCoursesByUserid,
  unsingCourse,
  createNewCourse,
  deleteCourseById,
  editCourseById,
  addCourseMaterial,
  editCourseMaterial,
  getCourseMaterialsCount,
  getCourseMaterial,
  deleteCourseMaterial,
  publishCourse,
};
