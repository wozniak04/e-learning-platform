import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopNav from "../mainPage/topnav/TopNav";
import { useCoursesInfoStore } from "../store/Courses/CourseInfoStore";
import { useSavedCoursesStore } from "../store/Courses/savedCoursesStore";
import "./styles/courseDetail.css";
import { toast } from "react-toastify";
import type { CourseDetail } from "../store/Storetypes";
import NotFoundPage from "../Not_Found";
import { useAuth } from "../auth/AuthContext";
import CourseComments from "./CourseComments";
import { useTranslation } from "react-i18next";
import Spinner from "../Spinner";
import { Link } from "react-router-dom";

function CourseDetails() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth();
  const { id } = useParams<{ id: string }>();

  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [courseDetail, setCourseDetail] = useState<CourseDetail | null>(null);

  const signuptoCourse = useSavedCoursesStore(
    (state) => state.addToSavedCourses,
  );
  const unsigntoCourse = useSavedCoursesStore(
    (state) => state.removeFromSavedCourse,
  );
  const fetchsavedCourses = useSavedCoursesStore(
    (state) => state.fetchsavedCourses,
  );
  const getCourseDetail = useCoursesInfoStore(
    (state) => state.getCourseInfoToDetail,
  );
  const loading = useCoursesInfoStore((state) => state.isLoading);

  useEffect(() => {
    try {
      fetchsavedCourses().then((res) => {
        setIsSaved(res.some((course) => course === id));
      });

      getCourseDetail(id!).then((data) => {
        if (data) setCourseDetail(data);
      });
    } catch (err: any) {
      toast.error(err.message || t("errors.course_fetch"));
    }
  }, [id]);

  if (loading) return <Spinner />;
  if (!courseDetail) return <NotFoundPage />;

  const handleSignUp = () => {
    signuptoCourse(id!)
      .then(() => {
        toast.success(t("course.signup_success"));
        setIsSaved(true);
      })
      .catch((error) => {
        if (error.message === "you are already signed up to this course") {
          setIsSaved(true);
          toast.info(t("course.already_signed"));
          return;
        }
        setIsSaved(false);
        toast.error(error.message || t("course.signup_error"));
      });
  };

  const handleUnSign = () => {
    unsigntoCourse(id!)
      .then(() => {
        setIsSaved(false);
        toast.success(t("course.unsign_success"));
      })
      .catch((error) => {
        setIsSaved(true);
        toast.error(error.message || t("course.unsign_error"));
      });
  };
  return (
    <div id="box">
      <TopNav />

      <div className="course-container">
        <Link to={`/course/${id}/chat`}>forum</Link>
        {auth.username === courseDetail.owner_name && (
          <button
            className="edit-course-button"
            onClick={() => navigate(`/course/${id}/edit`)}>
            {t("course.edit")}
          </button>
        )}

        <header className="course-header">
          <div className="course-image">
            <img
              src={
                courseDetail.img
                  ? courseDetail.img
                  : "https://www.e-learning.pl/wp-content/uploads/2023/06/elpl.jpg"
              }
              alt="Course"
            />
          </div>

          <div className="course-info">
            <h1>{courseDetail.title}</h1>

            <p className="owner">
              {t("course_details.owner")}
              {courseDetail.owner_name}
            </p>

            <div className="stats">
              <span>
                {t("course_details.materials")}
                {courseDetail.material_count}
              </span>

              {courseDetail.created_at && (
                <span>
                  {t("course_details.created")}{" "}
                  {courseDetail.created_at
                    .toLocaleString("pl-PL", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    .replace(",", "")}
                </span>
              )}
            </div>

            {!isSaved ? (
              <button className="enroll-btn" onClick={handleSignUp}>
                {t("course_details.signup")}
              </button>
            ) : (
              <div style={{ display: "flex", gap: "10px" }}>
                <button className="enroll-btn" onClick={handleUnSign}>
                  {t("course_details.unsignup")}
                </button>

                <button
                  className="enroll-btn"
                  onClick={() => navigate(`/course/${id}/learn`)}>
                  {t("course_details.go_to_course")}
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="course-description">
          <h2>{t("course_details.about")}</h2>
          <p>{courseDetail.description}</p>

          {courseDetail.type && (
            <p style={{ marginTop: "10px" }}>
              {t("course_details.type")}
              {courseDetail.type}
            </p>
          )}
        </section>

        <hr />

        <CourseComments courseUrl={id!} />
      </div>
    </div>
  );
}

export default CourseDetails;
