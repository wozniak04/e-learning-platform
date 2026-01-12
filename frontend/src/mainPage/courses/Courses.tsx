import { useEffect, useState } from "react";
import "./styles/courses.css";
import Course from "./Course_Card";
import { useCoursesInfoStore } from "../../store/Courses/CourseInfoStore";
import type { FetchCourseInfoParams, CourseCard } from "../../store/Storetypes";
import { toast } from "react-toastify";
import CourseFilter from "./CourseFilter";

function Courses() {
  const [params, setparams] = useState<FetchCourseInfoParams>({
    search: undefined,
    type: undefined,
    sort: undefined,
    onlysaved: undefined,
  });
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [page, setPage] = useState(1);
  const getCourseInfoToCards = useCoursesInfoStore(
    (state) => state.getCourseInfoToCards
  );
  const isLoading = useCoursesInfoStore((state) => state.isLoading);
  const onAplyFilter = (params: FetchCourseInfoParams) => {
    setparams(params);
    console.log(params);
    if (page === 1) {
      getCourseInfoToCards(page, params);
    }
    setPage(1);
  };
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getCourseInfoToCards(page, params);
        setCourses(data);
      } catch (error) {
        console.error(error);
        toast.error("Błąd podczas ładowania kursów");
      }
    };

    loadCourses();
  }, [page, getCourseInfoToCards]);

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
            imgsrc={course.imgsrc ? course.imgsrc : null}
          />
        ))}
      </div>
    </div>
  );
}

export default Courses;
