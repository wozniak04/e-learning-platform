import pool from "../../config/connectdb";

const getCourses = async (
    userId: number | null,
    type: string | null,
    search: string | null,
    sort: string | null,
    limit: number,
    offset: number,
    onlySaved: boolean
) => {
    const query = `SELECT * FROM get_all_courses_info($1, $2, $3, $4, $5, $6, $7);`;
    const values = [
        userId,
        type || null,
        search || null,
        sort || "newest",
        limit,
        offset,
        onlySaved
    ];
    try {
        const result = await pool.query(query, values);
        let totalCount = 0
        return {
            courses: result.rows.reduce((acc, course) => {
                const { url, total_count, ...rest } = course;
                totalCount = total_count
                acc[url] = rest;
                return acc;
            }, {}),
            total_Count: totalCount
        };
    } catch (error) {
        console.error("Error fetching courses: ", error);
        return null;
    }
};

const getCourseById = async (courseId: string) => {
    const query = "select * from get_course_info_by_url($1);";

    try {
        const result = await pool.query(query, [courseId]);
        if (result.rows.length === 0) {
            return null;
        }
        return result.rows.reduce((acc, course) => {
            const { url, ...rest } = course;
            acc[url] = rest;
            return acc;
        }, {});
    } catch (error) {
        console.error("Error fetching course by ID: ", error);
        return null;
    }
};

const getSavedCourses = async (
    userId: string
): Promise<{ url: string; page: number }[] | null> => {
    const query = "SELECT * FROM get_user_saved_courses_urls($1);";
    try {
        const result = await pool.query(query, [userId]);
        return result.rows;
    } catch (error) {
        console.error("error while adding course to saved ones: ", error);
        return null;
    }
};

export default {
    getCourses,
    getCourseById,
    getSavedCourses,
};
