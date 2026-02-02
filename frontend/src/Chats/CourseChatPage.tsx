import { useParams } from "react-router-dom";
import CourseChat from "./CourseChat";
import TopNav from "../mainPage/topnav/TopNav";
import Spinner from "../Spinner";
import "./CourseChat.css";
import { useCoursesInfoStore } from "../store/Courses/CourseInfoStore";
import { useEffect, useState } from "react";

const CourseChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const course = useCoursesInfoStore((state) => state.coursesInfo);
  const coursefetcher = useCoursesInfoStore(
    (state) => state.fetchCourseInfoByUrl,
  );
  const [courseTitle, setCourseTitle] = useState("");

  useEffect(() => {
    coursefetcher(id!).then(() => {
      const courseName = course[id!].title;
      setCourseTitle(courseName);
    });
  }, [course, id]);

  if (!id) return <Spinner />;

  return (
    <div className="course-chat-page">
      <TopNav />

      <div className="chat-page-content">
        <header className="chat-page-header">
          <h2>Forum dyskusyjne kursu: {courseTitle}</h2>
        </header>
        <CourseChat courseId={id} />
      </div>
    </div>
  );
};

export default CourseChatPage;
