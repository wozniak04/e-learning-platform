import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import TopNav from "../../mainPage/topnav/TopNav";
import "../styles/learn.css";
import { useCourseMaterialStore } from "../../store/Courses/courseMaterialStore";
import { useParams, Link } from "react-router-dom";
import type { CourseMaterial } from "../../store/Storetypes";

function Learn() {
  const { id } = useParams();
  const fetchMaterial = useCourseMaterialStore(
    (state) => state.fetchCourseMaterials,
  );

  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const currentMaterial = materials.find((m) => m.page === currentPage);
  const totalPages = materials.length;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    fetchMaterial(id!).then((res) => {
      setMaterials(res || []);
    });
  }, [id, fetchMaterial]);

  return (
    <div className="box">
      <TopNav />

      <div className="learn-wrapper">
        <Link to={`/course/${id}`} className="back-link">
          ← Powrót do szczegółów
        </Link>
        <div className="pages">
          <div
            className={`nav-btn ${currentPage === 1 ? "disabled" : ""}`}
            onClick={() => handlePageChange(currentPage - 1)}>
            Poprzedni
          </div>

          <div className="numbers-wrapper">
            {materials.map((m, index) => (
              <div
                key={index}
                className={`page ${currentPage === m.page ? "active" : ""}`}
                onClick={() => handlePageChange(m.page)}>
                {m.page}
              </div>
            ))}
          </div>

          <div
            className={`nav-btn ${
              currentPage === totalPages ? "disabled" : ""
            }`}
            onClick={() => handlePageChange(currentPage + 1)}>
            Następny
          </div>
        </div>

        <div className="lesson-title">
          <h1>{currentMaterial?.title}</h1>
        </div>

        <div className="markdown-content">
          <ReactMarkdown>{currentMaterial?.content || ""}</ReactMarkdown>
        </div>
        {currentPage === totalPages && (
          <Link to={`/course/${id}/AddComment`}>
            <button>zakończ kurs</button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Learn;
