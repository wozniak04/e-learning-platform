import pool from "./connectdb";
import { nanoid } from "nanoid";
const getAllCourseTypes = async () => {
  try {
    const result = await pool.query("SELECT * FROM get_course_types();");
    return result.rows;
  } catch (error) {
    console.error("Error fetching course types: ", error);
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

    return result.rows;
  } catch (error) {
    console.error("Error fetching courses: ", error);
    return null;
  }
};
const getCoursesCount = async (type: string | null, search: string | null) => {
  const query = `SELECT * FROM get_courses_count($1, $2)`;
  const values = [type || null, search || null];
  try {
    const result = await pool.query(query, values);

    return result.rows[0].get_courses_count;
  } catch (error) {
    console.error("Error fetching courses count: ", error);
    return null;
  }
};

const getCourseById = async (courseId: string) => {
  const query = "SELECT * FROM get_course_details_by_url($1)";

  try {
    const result = await pool.query(query, [courseId]);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching course by ID: ", error);
    return null;
  }
};
const signToCourse = async (
  user_id: string,
  course_id: string
): Promise<boolean> => {
  const query = "SELECT add_course_to_saved_by_url($1, $2)";
  try {
    await pool.query(query, [user_id, course_id]);
    return true;
  } catch (error) {
    console.error("error while adding course to saved ones: ", error);
    return false;
  }
};
const getSavedCourses = async (userId: string): Promise<string[] | null> => {
  const query = "SELECT * FROM get_user_saved_courses_urls($1);";
  try {
    const result = await pool.query(query, [userId]);

    return result.rows.map((row) => row.url);
  } catch (error) {
    console.error("error while adding course to saved ones: ", error);
    return null;
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
  const courseUrl = nanoid(10);
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
    return result.rows[0].create_new_course;
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

export default {
  getAllCourseTypes,
  getCourses,
  getCoursesCount,
  getCourseById,
  getSavedCourses,
  signToCourse,
  removeSavedCourse,
  createNewCourse,
};
