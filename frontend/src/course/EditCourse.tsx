import React, { useEffect } from "react";
import TopNav from "../mainPage/topnav/TopNav";
import { useCourseDetailStore } from "../store/Courses/courseDetailStore";
import "./styles/create_Course.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function EditCourse() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {}, [id]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateCourseInformation(id!);
      toast.success("Kurs został edytowany pomyślnie!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="Create_Course-container">
      <TopNav />

      <div className="form-wrapper">
        <h1>Edytuj kurs</h1>

        <form className="create-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Tytuł kursu*</label>
            <input
              type="text"
              placeholder="..."
              value={currentCourseDetail.name}
              onChange={(e) => updatetitle(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Krótki opis (max 50 słów)*</label>
            <input
              type="text"
              placeholder="Krótki tekst zachęcający do kursu..."
              value={currentCourseDetail.quick_description}
              onChange={(e) => updatequick_description(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Pełny opis*</label>
            <textarea
              placeholder="Szczegółowy program kursu i informacje..."
              value={description}
              onChange={(e) => updatedescription(e.target.value)}
              required
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div className="input-group">
              <label>Typ kursu</label>
              <input
                type="text"
                placeholder="Np :(programowanie, matematyka...)"
                value={type}
                onChange={(e) => updatetype(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Hasło (opcjonalnie)</label>
              <input
                type="password"
                placeholder="Ustaw, jeśli kurs prywatny"
                value={password || ""}
                onChange={(e) => updatepassword(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Zdjęcie okładki</label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => updateimg(e.target.files?.[0] || null)}
                id="file-input"
                hidden
              />
              <label
                htmlFor="file-input"
                style={{ cursor: "pointer", color: "var(--muted)" }}
              >
                {img
                  ? "Zmień zdjęcie"
                  : "Kliknij, aby wybrać zdjęcie (PNG, JPG)"}
              </label>
              {img && <p className="file-info">✓ Wybrano: {img.name}</p>}
            </div>
          </div>
          <Link to={`course/${id}/materials`}>
            <button className="submit-btn">Dodaj materiały</button>
          </Link>
          <button
            id="save-btn"
            type="submit"
            disabled={isCreating}
            className="submit-btn"
          >
            {isCreating ? "Trwa przesyłanie..." : "opublikuj zmiany"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditCourse;
