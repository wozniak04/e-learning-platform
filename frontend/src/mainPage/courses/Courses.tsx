import { useEffect } from "react";
import "./styles/courses.css";
import Course from "./Course_Card";
import { useCourseStore } from "../../store/Courses/coursesStore";
import { useSavedCoursesStore } from "../../store/Courses/savedCoursesStore";
import { toast } from "react-toastify";

function Courses() {
  const courses = useCourseStore((state) => state.courses);
  const isLoading = useCourseStore((state) => state.isLoading);
  const fetchCourses = useCourseStore((state) => state.fetchCourses);
  const fetchsavedCourses = useSavedCoursesStore(
    (state) => state.fetchsavedCourses
  );

  useEffect(() => {
    try {
      fetchsavedCourses();
      fetchCourses();
    } catch (error) {
      toast.error(error as string);
    }
  }, []);

  if (isLoading) return <div>Loading courses...</div>;

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
