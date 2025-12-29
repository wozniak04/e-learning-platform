import { useEffect } from "react";
import "./styles/courses.css";
import Course from "./Course_Card";
import { useCourseStore } from "../../store/coursesStore";
import { toast } from "react-toastify";

function Courses() {
  const courses = useCourseStore((state) => state.courses);
  const isLoading = useCourseStore((state) => state.isLoading);
  const fetchCourses = useCourseStore((state) => state.fetchCourses);
  const error = useCourseStore((state) => state.error);

  useEffect(() => {
    fetchCourses();
  }, []);

  if (isLoading) {
    return <div>Loading courses...</div>;
  } else if (error) {
    toast.error(`błąd podczas pobierania kursow z api: ${error}`);
  }
  return (
    <div className="courses-container">
      <h2>Courses Component</h2>
      {courses.map((course) => (
        <Course
          key={course.url}
          name={course.name}
          description={course.description}
          url={course.url}
          imgsrc={course.imgsrc ? course.imgsrc : null}
        />
      ))}
    </div>
  );
}

export default Courses;
