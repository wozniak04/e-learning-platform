import { useEffect, useState } from "react";
import "./styles/courses.css";
import Course from "./Course_Card";
import { useCoursesInfoStore } from "../../store/Courses/CourseInfoStore";
import { useSavedCoursesStore } from "../../store/Courses/savedCoursesStore";
import type { FetchCourseInfoParams } from "../../store/Storetypes";
import { toast } from "react-toastify";
import CourseFilter from "./CourseFilter";
import Spinner from "../../Spinner";
import { useTranslation } from "react-i18next";

function Courses() {
  const { t } = useTranslation();

  const [params, setparams] = useState<FetchCourseInfoParams>({
    search: undefined,
    type: undefined,
    sort: undefined,
    onlysaved: undefined,
  });

  const courses = useCoursesInfoStore((state) => state.coursesCard);
  const [page, setPage] = useState(1);

  const fetchCourseInfoToCards = useCoursesInfoStore(
    (state) => state.getCourseInfoToCards,
  );

  const fetchCoursesSaved = useSavedCoursesStore(
    (state) => state.fetchsavedCourses,
  );

  const totalPages = useCoursesInfoStore((state) => state.totalPages);
  const savedCourses = useSavedCoursesStore((state) => state.savedCourses);
  const isLoading = useCoursesInfoStore((state) => state.isLoading);

  const onAplyFilter = async (params: FetchCourseInfoParams) => {
    setparams(params);

    if (page === 1) await fetchCourseInfoToCards(1, params, true, savedCourses);

    setPage(1);
  };

  useEffect(() => {
    const loadCourses = async () => {
      try {
        await fetchCoursesSaved();
        await fetchCourseInfoToCards(page, params, false, savedCourses);
      } catch (error) {
        console.error(error);
        toast.error(t("courses.load_error"));
      }
    };

    loadCourses();
  }, [page, params]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading && courses.length === 0) return <Spinner />;

  return (
    <div className="courses-container">
      <CourseFilter onApply={onAplyFilter} />

      <div className="courses">
        {courses.map((course) => (
          <Course
            key={course.url}
            name={course.title}
            description={course.description}
            url={course.url}
            img={course.img ? course.img : null}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="pagination-container">
          <p className="pagination-status">
            {t("course.page")}
            {page}/{totalPages}
          </p>
          <div className="buttons-for-pagination-container">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}>
              {t("previous")}
            </button>

            <button
              className="pagination-btn"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}>
              {t("next")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;
