import pool from "./connectdb";

const getAllCourseTypes = async () => {
  try {
    const result = await pool.query("SELECT * FROM get_course_types();");
    return result.rows;
  } catch (error) {
    console.error("Error fetching course types:", error);
    return null;
  }
};
const getCourses = async (
  type: string | null,
  search: string | null,
  sort: string | null,
  limit: number,
  offset: number
) => {
  const query = `SELECT * FROM get_courses($1, $2, $3, $4, $5)`;
  const values = [
    type || null,
    search || null,
    sort || "newest",
    limit,
    offset,
  ];
  try {
    const result = await pool.query(query, values);
    if (!result) {
      return null;
    }
    return result.rows;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return null;
  }
};
const getCoursesCount = async (type: string | null, search: string | null) => {
  const query = `SELECT * FROM get_courses_count($1, $2)`;
  const values = [type || null, search || null];
  try {
    const result = await pool.query(query, values);
    if (!result) {
      return null;
    }
    return result.rows[0].get_courses_count;
  } catch (error) {
    console.error("Error fetching courses count:", error);
    return null;
  }
};

const getCourseById = async (courseId: string) => {
  const query = "SELECT * FROM get_course_details_by_url($1)";

  try {
    const result = await pool.query(query, [courseId]);
    if (!result) {
      return null;
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    return null;
  }
};
export default {
  getAllCourseTypes,
  getCourses,
  getCoursesCount,
  getCourseById,
};
