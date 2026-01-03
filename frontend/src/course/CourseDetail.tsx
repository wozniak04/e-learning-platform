import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TopNav from "../mainPage/topnav/TopNav";
import { useCourseDetailStore } from "../store/Courses/courseDetailStore";
import { useSavedCoursesStore } from "../store/Courses/savedCoursesStore";
import "./styles/courseDetail.css";
import { toast } from "react-toastify";

function Course() {
  const { id } = useParams<{ id: string }>();
  const isSavedCourse = useSavedCoursesStore((state) => state.isInSavedCourse);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const signuptoCourse = useSavedCoursesStore(
    (state) => state.addToSavedCourses
  );
  const unsigntoCourse = useSavedCoursesStore(
    (state) => state.removeFromSavedCourse
  );
  const fetchsavedCourses = useSavedCoursesStore(
    (state) => state.fetchsavedCourses
  );
  const courseDetail = useCourseDetailStore(
    (state) => state.currentCourseDetail
  );
  const fetchCourseDetail = useCourseDetailStore(
    (state) => state.fetchCoursesDetail
  );

  const loading = useCourseDetailStore((state) => state.isLoading);
  useEffect(() => {
    try {
      fetchsavedCourses();
      setIsSaved(isSavedCourse(id!));
      fetchCourseDetail(id);
    } catch (err: any) {
      toast.error(err.message || "Nie udało się pobrać danych kursu");
    }
  }, [id, fetchCourseDetail]);

  if (loading) {
    return <div>loading</div>;
  } else if (!courseDetail) {
    return;
  }

  const handleSignUp = () => {
    signuptoCourse(id!)
      .then(() => {
        toast.success("zapisano sie na kurs!");
        setIsSaved(true);
      })
      .catch((error) => {
        if (error.message === "you are already signed up to this course") {
          setIsSaved(true);
          toast.info("Jesteś już zapisany na ten kurs");
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
            <h1>{courseDetail.name}</h1>
            <p className="owner">Prowadzący: {courseDetail.owner_name}</p>
            <div className="stats">
              <span>Ocena: {courseDetail.average_rating} / 10</span>
              <span>Opinie: ({courseDetail.reviews_count})</span>
              <span>Materiały: {courseDetail.material_count}</span>
            </div>

            {!isSaved ? (
              <button className="enroll-btn" onClick={handleSignUp}>
                Zapisz się na kurs
              </button>
            ) : (
              <button className="enroll-btn" onClick={handleUnSign}>
                wypisz sie z kursu
              </button>
            )}
          </div>
        </header>

        {/* Sekcja opisu */}
        <section className="course-description">
          <h2>O kursie</h2>
          <p>{courseDetail.description}</p>
          {courseDetail.type && <p>Typ kursu: {courseDetail.type}</p>}
        </section>

        <hr />

        {/* Sekcja komentarzy (miejsce na Twój przyszły kod) */}
        <section className="course-comments">
          <h2>Sekcja komentarzy</h2>
          <div className="comment-placeholder">
            <p>Tu pojawią się opinie użytkowników...</p>
            {/* Tutaj będziesz mógł zmapować listę komentarzy */}
          </div>
        </section>
      </div>
    </div>
  );
}
export default Course;
