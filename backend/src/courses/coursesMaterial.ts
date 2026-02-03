import { Request, Response } from "express";
import courseDB from "../operations_with_db/courses";

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
    addCourseMaterial,
    editCourseMaterial,
    deleteCourseMaterial,
    getCourseMaterialsCount,
    getCourseMaterial,
};
