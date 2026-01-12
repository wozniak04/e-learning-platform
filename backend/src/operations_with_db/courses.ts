import pool from "../config/connectdb";
import { nanoid } from "nanoid";
import { CourseMaterial } from "../types";

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

    return result.rows.reduce((acc, course) => {
      const { url, ...rest } = course;
      acc[url] = rest;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching courses: ", error);
    return null;
  }
};
const getCoursesCount = async (type: string | null, search: string | null) => {
  const query = `SELECT * FROM get_courses_count($1, $2);`;
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

const editCourseComment = async (
  url: string,
  user_id: string,
  rating: number,
  comment: string
): Promise<number> => {
  try {
    const result = await pool.query(
      "SELECT public.edit_course_review($1, $2, $3, $4) as status",
      [url, user_id, rating, comment]
    );

    return parseInt(result.rows[0].status);
  } catch (error) {
    console.error("error while editing course comment ", error);
    return 500;
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
  getCourses,
  getCoursesCount,
  getCourseById,
  getSavedCourses,
  signToCourse,
  removeSavedCourse,
  createNewCourse,
  get_course_owner_id,
  deleteCourseById,
  editCourseById,
  publishCourse,
  addCourseMaterial,
  editCourseMaterial,
  getCourseMaterialsCount,
  get_Course_material,
  deleteCoursePage,
  getCourseComments,
  addCourseComment,
  editCourseComment,
  deleteCourseComment,
};
