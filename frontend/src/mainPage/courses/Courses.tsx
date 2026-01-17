import { useEffect, useState } from "react";
import "./styles/courses.css";
import Course from "./Course_Card";
import { useCoursesInfoStore } from "../../store/Courses/CourseInfoStore";
import { useSavedCoursesStore } from "../../store/Courses/savedCoursesStore";
import type { FetchCourseInfoParams } from "../../store/Storetypes";
import { toast } from "react-toastify";
import CourseFilter from "./CourseFilter";
import { COURSES_PER_PAGE } from "../../variables";

function Courses() {
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
  const totalCountOfCards = useCoursesInfoStore((state) => state.totalCount);
  const savedCourses = useSavedCoursesStore((state) => state.savedCourses);
  const isLoading = useCoursesInfoStore((state) => state.isLoading);
  const totalPages = Math.ceil(totalCountOfCards / COURSES_PER_PAGE);

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
        toast.error("Błąd podczas ładowania kursów");
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

  if (isLoading && courses.length === 0) return <div>Ładowanie...</div>;

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
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}>
            Poprzednia
          </button>

          <div className="pagination-numbers">
            {[...Array(totalPages)].map((_, index) => (
              <div
                key={index + 1}
                className={`page-number ${page === index + 1 ? "active" : ""}`}
                onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </div>
            ))}
          </div>

          <button
            className="pagination-btn"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}>
            Następna
          </button>
        </div>
      )}
    </div>
  );
}
export default Courses;
