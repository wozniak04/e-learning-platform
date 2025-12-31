import { useEffect } from "react";
import { useParams } from "react-router-dom";
import TopNav from "../mainPage/topnav/TopNav";
import { useCourseDetailStore } from "../store/courseDetailStore";
import { useSavedCoursesStore } from "../store/savedCoursesStore";
import "./styles/courseDetail.css";
import { toast } from "react-toastify";

function Course() {
  const { id } = useParams<{ id: string }>();
  const isSavedCourse = useSavedCoursesStore((state) => state.isInSavedCourse);
  const courseDetail = useCourseDetailStore(
    (state) => state.currentCourseDetail
  );
  const fetchCourseDetail = useCourseDetailStore(
    (state) => state.fetchCoursesDetail
  );

  const loading = useCourseDetailStore((state) => state.isLoading);
  useEffect(() => {
    try {
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
    alert("Zapisano na kurs!");
  };
  const handleUnSign = () => {
    alert("wypisano sie!");
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

            {!isSavedCourse(id!) ? (
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
