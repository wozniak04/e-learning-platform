import { Request, Response } from "express";
import courseDB from "../operations_with_db/courses";

const getCourseComments = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { search = null, sort = null, limit = null, offset = null } = req.query;
    try {
        const result = await courseDB.getCourseComments(
            id,
            search as string,
            sort as string,
            limit as string,
            offset as string
        );
        if (!result) {
            return res.status(404).json({ message: "no Course Found with this id" });
        }
        return res.status(200).json({ comments: result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error });
    }
};

const addCourseReview = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user_id = req.user.sub;
    const { rating, comment } = req.body;

    if (rating === undefined || !comment) {
        return res.status(400).json({ message: "bad request" });
    }

    const result = await courseDB.addCourseComment(id, user_id, rating, comment);

    if (result === -404)
        return res.status(404).json({ message: "course not found" });
    if (result === -400)
        return res.status(400).json({ message: "rating must be 1-10" });
    if (result < 0) return res.status(500).json({ message: "server error" });

    return res.status(200).json({
        message: "success",
        newAverage: result,
    });
};

const deleteCourseReview = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user_id = req.user.sub;

    const result = await courseDB.deleteCourseComment(id, user_id);

    if (result === 404) {
        return res.status(404).json({ message: "course not found" });
    }

    if (result === 403) {
        return res
            .status(403)
            .json({ message: "review not found or unauthorized" });
    }

    if (result === 200) {
        return res.status(200).json({ message: "success: review deleted" });
    }

    return res.status(500).json({ message: "server error" });
};

export default {
    getCourseComments,
    addCourseReview,
    deleteCourseReview,
};
