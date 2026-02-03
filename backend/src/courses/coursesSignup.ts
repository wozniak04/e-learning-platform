import { Request, Response } from "express";
import courseDB from "../operations_with_db/courses";

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

export default {
    signupToCourse,
    unsingCourse,
};
