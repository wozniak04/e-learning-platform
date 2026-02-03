import { Request, Response } from "express";
import courseDB from "../operations_with_db/courses";

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
            return res
                .status(500)
                .json({ message: "error while publishing course", created_at: result });
        }
        return res.status(200).json({ message: "succes" });
    } catch (error) {
        console.error("error during publishin course: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default {
    createNewCourse,
    editCourseById,
    deleteCourseById,
    publishCourse,
};
