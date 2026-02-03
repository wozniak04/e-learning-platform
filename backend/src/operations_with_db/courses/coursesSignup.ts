import pool from "../../config/connectdb";

const signToCourse = async (
    user_id: string,
    course_id: string
): Promise<boolean> => {
    const query = "SELECT add_course_to_saved_by_url($1, $2);";
    try {
        await pool.query(query, [user_id, course_id]);
        return true;
    } catch (error) {
        console.error("error while adding course to saved ones: ", error);
        return false;
    }
};

const removeSavedCourse = async (
    userId: string,
    courseId: string
): Promise<boolean> => {
    const query = "SELECT remove_course_from_saved_by_url($1,$2);";
    try {
        await pool.query(query, [userId, courseId]);
        return true;
    } catch (error) {
        console.error("error while removing course from saved: ", error);
        return false;
    }
};

const get_course_owner_id = async (courseId: string) => {
    const query = `SELECT get_course_owner_id_by_url($1) AS owner_id;`;
    try {
        const result = await pool.query(query, [courseId]);
        return result.rows[0].owner_id;
    } catch (error) {
        console.error("Error fetching course owner ID: ", error);
        return null;
    }
};

export default {
    signToCourse,
    removeSavedCourse,
    get_course_owner_id,
};
