import React from "react";
import TopNav from "../mainPage/topnav/TopNav";
import { useCreateNewCourseStore } from "../store/Courses/createCourseStore";
import "./styles/create_Course.css";

function Create_Course() {
  const {
    title,
    updatetitle,
    description,
    updatedescription,
    quick_description,
    updatequick_description,
    type,
    updatetype,
    img,
    updateimg,
    password,
    updatepassword,
    isCreating,
    createNewCourse,
  } = useCreateNewCourseStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createNewCourse();
      alert("Kurs został pomyślnie utworzony!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="Create_Course-container">
      <TopNav />

      <div className="form-wrapper">
        <h1>Stwórz nowy kurs</h1>

        <form onSubmit={handleSubmit} className="create-form">
          <div className="input-group">
            <label>Tytuł kursu*</label>
            <input
              type="text"
              placeholder="..."
              value={title}
              onChange={(e) => updatetitle(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Krótki opis (max 50 słów)*</label>
            <input
              type="text"
              placeholder="Krótki tekst zachęcający do kursu..."
              value={quick_description}
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

          <button type="submit" disabled={isCreating} className="submit-btn">
            {isCreating ? "Trwa przesyłanie..." : "Opublikuj kurs"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Create_Course;
