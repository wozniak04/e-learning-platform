import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopNav from "../mainPage/topnav/TopNav";
import { useCoursesInfoStore } from "../store/Courses/CourseInfoStore";
import { useSavedCoursesStore } from "../store/Courses/savedCoursesStore";
import "./styles/courseDetail.css";
import { toast } from "react-toastify";
import type { CourseDetail } from "../store/Storetypes";
import NotFoundPage from "../Not_Found";

function Course() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [Page, setPage] = useState<Number | null>(null);
  const [courseDetail, setCourseDetail] = useState<CourseDetail | null>(null);
  const signuptoCourse = useSavedCoursesStore(
    (state) => state.addToSavedCourses
  );
  const unsigntoCourse = useSavedCoursesStore(
    (state) => state.removeFromSavedCourse
  );
  const fetchsavedCourses = useSavedCoursesStore(
    (state) => state.fetchsavedCourses
  );
  const getPageOfSavedCourse = useSavedCoursesStore(
    (state) => state.getPageOfSavedCourse
  );
  const getCourseDetail = useCoursesInfoStore(
    (state) => state.getCourseInfoToDetail
  );
  const loading = useCoursesInfoStore((state) => state.isLoading);

  useEffect(() => {
    try {
      fetchsavedCourses().then((res) => {
        setIsSaved(res.some((course) => course.url === id));
        setPage(getPageOfSavedCourse(id!)!);
      });
      getCourseDetail(id!).then((data) => {
        if (data) {
          setCourseDetail(data);
        }
      });
    } catch (err: Error | any) {
      toast.error(err.message || "Nie udało się pobrać danych kursu");
    }
  }, [id]);

  if (loading) {
    return <div>loading</div>;
  } else if (!courseDetail) {
    return <NotFoundPage />;
  }

  const handleSignUp = () => {
    signuptoCourse(id!)
      .then(() => {
        toast.success("zapisano sie na kurs!");
        setIsSaved(true);
        setPage(1);
      })
      .catch((error) => {
        if (error.message === "you are already signed up to this course") {
          setIsSaved(true);
          toast.info("Jesteś już zapisany na ten kurs");
          setPage(getPageOfSavedCourse(id!)!);
          return;
        }
        setIsSaved(false);
        toast.error(error.message || "Nie udało się zapisać na kurs");
      });
  };
  const handleUnSign = () => {
    unsigntoCourse(id!)
      .then(() => {
        setIsSaved(false);
        setPage(null);
        toast.success("wypisano sie z kursu!");
      })
      .catch((error) => {
        setIsSaved(true);
        toast.error(error.message || "Nie udało się wypisać z kursu");
      });
  };

  return (
    <div id="box">
      <TopNav />
      <div className="course-container">
        <header className="course-header">
          <div className="course-image">
            <img
              src={
                courseDetail.imgsrc
                  ? courseDetail.imgsrc
                  : "https://www.e-learning.pl/wp-content/uploads/2023/06/elpl.jpg"
              }
            />
          </div>

          <div className="course-info">
            <h1>{courseDetail.title}</h1>
            <p className="owner">Prowadzący: {courseDetail.owner_name}</p>
            <div className="stats">
              {/* <span>Ocena: {courseDetail.average_rating} / 10</span>
              <span>Opinie: ({courseDetail.reviews_count})</span>
              <span>Materiały: {courseDetail.material_count}</span> */}
            </div>

            {!isSaved ? (
              <button className="enroll-btn" onClick={handleSignUp}>
                Zapisz się na kurs
              </button>
            ) : (
              <>
                <button className="enroll-btn" onClick={handleUnSign}>
                  wypisz sie z kursu
                </button>
                <button
                  className="enroll-btn"
                  onClick={() => navigate(`/course/${id}/learn/${Page}`)}
                >
                  przejdź do kursu
                </button>
              </>
            )}
          </div>
        </header>

        <section className="course-description">
          <h2>O kursie</h2>
          <p>{courseDetail.description}</p>
          {courseDetail.type && <p>Typ kursu: {courseDetail.type}</p>}
        </section>

        <hr />

        <section className="course-comments">
          <h2>Sekcja komentarzy</h2>
          <div className="comment-placeholder">
            <p>Tu pojawią się opinie użytkowników...</p>
          </div>
        </section>
      </div>
    </div>
  );
}
export default Course;
