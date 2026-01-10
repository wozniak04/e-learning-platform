import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import TopNav from "../mainPage/topnav/TopNav";
import "./styles/learn.css";
import { useCourseMaterialStore } from "../store/Courses/courseMaterialStore";
import { useParams } from "react-router-dom";
import type { CourseMaterial } from "../store/Storetypes";

function Learn() {
  const { id } = useParams();
  const fetchMaterial = useCourseMaterialStore(
    (state) => state.fetchCourseMaterials
  );

  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const currentMaterial = materials.find((m) => m.page === currentPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchMaterial(id!).then((res) => {
      setMaterials(res);
    });
  }, [id, fetchMaterial]);

  return (
    <div className="learn-wrapper">
      <TopNav />

      <nav className="learn-pagination-bar">
        <div className="pagination-inner">
          {materials.map((m) => (
            <button
              key={m.page}
              className={`page-square ${
                currentPage === m.page ? "active" : ""
              }`}
              onClick={() => handlePageChange(m.page)}
            >
              {m.page}
            </button>
          ))}
        </div>
      </nav>

      <main className="learn-main-content">
        {currentMaterial ? (
          <article className="content-card">
            <header className="content-header">
              <span className="page-label">Lekcja {currentMaterial.page}</span>
              <h1>{currentMaterial.title}</h1>
            </header>

            <hr className="content-divider" />

            <div className="markdown-render-area">
              <ReactMarkdown>{currentMaterial.content}</ReactMarkdown>
            </div>

            <footer className="content-footer">
              <button
                className="nav-arrow-btn"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                ← Poprzednia
              </button>

              <span className="page-counter">
                {currentPage} / {materials.length}
              </span>

              <button
                className="nav-arrow-btn"
                disabled={currentPage === materials.length}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Następna →
              </button>
            </footer>
          </article>
        ) : (
          <div className="learn-loading">
            {materials.length === 0 ? (
              <>
                <div className="spinner"></div>
                <p>Ładowanie materiałów kursu...</p>
              </>
            ) : (
              <p>Nie znaleziono wybranej strony.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Learn;
