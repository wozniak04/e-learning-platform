import pool from "../../config/connectdb";
import { CourseMaterial } from "../../types";

const addCourseMaterial = async (
    materials: CourseMaterial[],
    url: string
): Promise<boolean> => {
    const query = `SELECT add_course_materials($1,$2);`;
    try {
        await pool.query(query, [url, JSON.stringify(materials)]);
        return true;
    } catch (error) {
        console.error("Error adding course material: ", error);
        return false;
    }
};

const editCourseMaterial = async (
    courseId: string,
    materials: CourseMaterial[],
    owner_id: number
): Promise<boolean> => {
    const query = `SELECT update_course_materials_by_url($1,$2,$3);`;
    try {
        await pool.query(query, [courseId, owner_id, JSON.stringify(materials)]);
        return true;
    } catch (error) {
        console.error("Error editing course material: ", error);
        return false;
    }
};

const deleteCoursePage = async (
    courseId: string,
    page: number
): Promise<boolean> => {
    const query = "SELECT delete_course_material_page($1, $2)";
    try {
        await pool.query(query, [courseId, page]);
        return true;
    } catch (error) {
        console.error("Error while deleting a Course Material Page", error);
        return false;
    }
};

const getCourseMaterialsCount = async (courseId: string) => {
    const query = `SELECT get_course_page_count($1) AS materials_count;`;
    try {
        const result = await pool.query(query, [courseId]);
        return result.rows[0].materials_count;
    } catch (error) {
        console.error("Error fetching course materials count: ", error);
        return null;
    }
};

const get_Course_material = async (
    courseId: string,
    startPage: Number,
    endPage: Number
) => {
    const query = `
        SELECT * FROM get_all_course_pages($1)
        WHERE (page >= COALESCE($2, -2147483648)) 
          AND (page <= COALESCE($3, 2147483647))
        ORDER BY page ASC;
    `;
    try {
        const result = await pool.query(query, [courseId, startPage, endPage]);
        return result.rows;
    } catch (error) {
        console.error("Error fetching course material: ", error);
        return null;
    }
};

export default {
    addCourseMaterial,
    editCourseMaterial,
    deleteCoursePage,
    getCourseMaterialsCount,
    get_Course_material,
};
