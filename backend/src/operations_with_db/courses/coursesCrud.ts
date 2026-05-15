import pool from "../../config/connectdb";
import crypto from "crypto";

const createNewCourse = async (
    userId: string,
    title: string,
    description: string,
    quick_description: string,
    type: string | null = null,
    img_url: string | null = null,
    password: string | null = null,
    countFunction: number = 0
) => {

    const courseUrl = crypto.randomBytes(8).toString("base64url").substring(0, 10);
    const query = `SELECT create_new_course($1,$2,$3,$4,$5,$6,$7,$8);`;
    try {
        const result = await pool.query(query, [
            userId,
            title,
            courseUrl,
            type,
            quick_description,
            description,
            img_url,
            password,
        ]);
        return courseUrl;
    } catch (error) {
        if (countFunction < 2) {
            createNewCourse(
                userId,
                title,
                description,
                quick_description,
                type,
                img_url,
                password,
                countFunction + 1
            );
        } else {
            console.error("Error creating new course: ", error);
            return null;
        }
    }
};

const editCourseById = async (
    courseId: string,
    title: string | null = null,
    type: string | null = null,
    quick_description: string | null = null,
    description: string | null = null,
    img_url: string | null = null,
    password: string | null = null
) => {
    const query = `SELECT update_course_by_url($1,$2,$3,$4,$5,$6,$7);`;
    try {
        const result = await pool.query(query, [
            courseId,
            title,
            type,
            quick_description,
            description,
            img_url,
            password,
        ]);
        return result.rows[0].update_course_by_url;
    } catch (error) {
        console.error("Error editing course by ID: ", error);
        return null;
    }
};

const deleteCourseById = async (courseId: string) => {
    const query = `SELECT delete_course_by_url($1);`;
    try {
        await pool.query(query, [courseId]);
        return true;
    } catch (error) {
        console.error("Error deleting course by ID: ", error);
        return false;
    }
};

const publishCourse = async (course_id: string) => {
    const query = "SELECT publish_course($1) as published_at";
    try {
        const result = await pool.query(query, [course_id]);
        return result.rows[0].published_at;
    } catch (error) {
        console.error("error while publishing course", error);
        return false;
    }
};

export default {
    createNewCourse,
    editCourseById,
    deleteCourseById,
    publishCourse,
};
