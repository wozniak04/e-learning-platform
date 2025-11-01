import { useState, useEffect } from "react";
import "./styles/courses.css";
import Course from "./Course";
interface course_props {
  courses?: {
    name: string;
    description: string;
    url: string;
  }[];
}
function Courses(props: course_props) {
  const exampleCourses = [
    {
      name: "Mathematics",
      description: "Learn about numbers and equations",
      url: "math",
    },
    {
      name: "Physics",
      description: "Explore the laws of nature",
      url: "physics",
    },
    {
      name: "Chemistry",
      description: "Study the composition of substances",
      url: "chemistry",
    },
  ];
  const [courses, setCourses] = useState(
    props.courses ? props.courses : exampleCourses
  );
  return (
    <div className="courses-container">
      <h2>Courses Component</h2>
      {courses.map((course) => (
        <Course
          key={course.url}
          name={course.name}
          description={course.description}
          url={course.url}
        />
      ))}
    </div>
  );
}

export default Courses;
