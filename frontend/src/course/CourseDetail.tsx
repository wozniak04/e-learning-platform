import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import TopNav from "../mainPage/topnav/TopNav";
import { useCourseDetailStore } from "../store/courseDetailStore";
import "./styles/courseDetail.css";
import { toast } from "react-toastify";

function Course() {
  const { id } = useParams<{ id: string }>();
  const courseDetail = useCourseDetailStore(
    (state) => state.currentCourseDetail
  );
  const fetchCourseDetail = useCourseDetailStore(
    (state) => state.fetchCoursesDetail
  );
  const error = useCourseDetailStore((state) => state.error);
  const loading = useCourseDetailStore((state) => state.isLoading);
  useEffect(() => {
    fetchCourseDetail(id);
  }, [id, fetchCourseDetail]);

  if (loading) {
    return <div>loading</div>;
  }
  if (error) {
    toast.error(`Błąd podczas pobierania szczegółów kursu: ${error}`);
  }

  const handleEnroll = () => {
    alert("Zapisano na kurs!");
  };

  return (
    <div id="box">
      <TopNav />
      <div className="course-container">
        <header className="course-header">
          <div className="course-image">
            {courseDetail?.imgsrc ? (
              <img src={courseDetail.imgsrc} alt={courseDetail.name} />
            ) : (
              <div className="placeholder-img">Brak zdjęcia</div>
            )}
          </div>

          <div className="course-info">
            <h1>{courseDetail.name}</h1>
            <p className="owner">Prowadzący: {courseDetail.owner}</p>
            <div className="stats">
              <span>Ocena: {courseDetail.average_rating} / 10</span>
              <span>Opinie: ({courseDetail.reviews_count})</span>
              <span>Materiały: {courseDetail.material_count}</span>
            </div>

            {/* Przycisk akcji */}
            <button className="enroll-btn" onClick={handleEnroll}>
              Zapisz się na kurs
            </button>
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
