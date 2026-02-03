import pool from "../../config/connectdb";

const getCourseComments = async (
    url: string,
    search: string | null,
    sort: string | null,
    limit: string | null,
    offset: string | null
) => {
    const query = "SELECT * FROM get_course_reviews($1,$2,$3,$4,$5);";
    try {
        const result = await pool.query(query, [url, search, sort, limit, offset]);

        if (result.rowCount === 0) {
            return { average_rating: null, comments: [] };
        }
        const mappedresult = result.rows.map((x) => {
            const { course_average_rating, ...rest } = x;
            return rest;
        });
        return {
            average_rating: result.rows[0].course_average_rating,
            comments: mappedresult,
        };
    } catch (error) {
        console.error("error while fetchng course comments ", error);
        return null;
    }
};

const addCourseComment = async (
    url: string,
    user_id: string,
    rating: number,
    comment: string
): Promise<number> => {
    try {
        const result = await pool.query(
            "SELECT public.add_course_review($1, $2, $3, $4) as new_avg",
            [url, user_id, rating, comment]
        );

        return parseFloat(result.rows[0].new_avg);
    } catch (error) {
        console.error("error while adding course comment ", error);
        return -500;
    }
};

const deleteCourseComment = async (
    url: string,
    user_id: string
): Promise<number> => {
    try {
        const result = await pool.query(
            "SELECT public.delete_course_review($1, $2) as status",
            [url, user_id]
        );

        return parseInt(result.rows[0].status);
    } catch (error) {
        console.error("error while deleting course comment ", error);
        return 500;
    }
};

export default {
    getCourseComments,
    addCourseComment,
    deleteCourseComment,
};
