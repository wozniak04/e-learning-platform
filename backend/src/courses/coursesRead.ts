import { Request, Response } from "express";
import courseDB from "../operations_with_db/courses";
import { getUserIdFromRequest } from "../middleware/authenticatejwt";

const getCourses = async (req: Request, res: Response) => {
    try {
        const { type, search, sort, limit, offset, onlySaved } = req.query;
        const userId = await getUserIdFromRequest(req);
        const result = await courseDB.getCourses(
            userId,
            type as string | null,
            search as string | null,
            sort as string | null,
            parseInt(limit as string) || 12,
            parseInt(offset as string) || 0,
            onlySaved === "true"
        );
        if (!result) {
            return res.status(500).json({ message: "Failed to fetch courses" });
        }
        return res.status(200).json({ courses: result.courses, totalCount: result.total_Count });
    } catch (error) {
        console.error("Error fetching courses:", error);
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

const getSavedCoursesByUserid = async (req: Request, res: Response) => {
    try {
        const userId = req.user.sub;
        if (!userId) return res.status(400).json({ message: "bad request" });
        const result = await courseDB.getSavedCourses(userId);
        if (!result) return res.status(404);

        res.status(200).json({ savedCourses: result });
    } catch (error) {
        console.error("Error fetching Saved Courses", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default {
    getCourses,
    getCourseById,
    getSavedCoursesByUserid,
};
