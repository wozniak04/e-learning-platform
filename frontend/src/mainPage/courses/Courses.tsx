import { useEffect, useState } from "react";
import "./styles/courses.css";
import Course from "./Course_Card";
import { useCoursesInfoStore } from "../../store/Courses/CourseInfoStore";
import type { CourseCard } from "../../store/Storetypes";
import { toast } from "react-toastify";

function Courses() {
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [page, setPage] = useState(1);
  const getCourseInfoToCards = useCoursesInfoStore(
    (state) => state.getCourseInfoToCards
  );
  const isLoading = useCoursesInfoStore((state) => state.isLoading);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getCourseInfoToCards(page);
        setCourses(data);
      } catch (error) {
        toast.error("Błąd podczas ładowania kursów");
      }
    };

    loadCourses();
  }, [page, getCourseInfoToCards]);

  if (isLoading && courses.length === 0) return <div>Ładowanie...</div>;
  return (
    <div className="courses-container">
      <h2>Courses Component</h2>
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
  );
}

export default Courses;
