import React, { useState } from "react";
import TopNav from "../mainPage/topnav/TopNav";
import "./styles/create_Course.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { BACKEND_URL } from "../variables";

function Create_Course() {
  const navigate = useNavigate();

  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [quickDescription, setQuickDescription] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [password, setPassword] = useState("");
  const [img, setImg] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("quick_description", quickDescription);
      if (type) formData.append("type", type);
      if (password) formData.append("password", password);
      if (img) formData.append("img", img);

      const result = await axios.post(
        `${BACKEND_URL}/courses/create`,
        formData,
        { withCredentials: true }
      );

      toast.success("Kurs został zapisany pomyślnie!");
      navigate(`/course/${result.data.courseId}/edit`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Błąd podczas tworzenia kursu"
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="Create_Course-container">
      <TopNav />

      <div className="form-wrapper">
        <h1>Stwórz nowy kurs</h1>

        <form className="create-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Tytuł kursu*</label>
            <input
              type="text"
              placeholder="..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Krótki opis (max 50 słów)*</label>
            <input
              type="text"
              placeholder="Krótki tekst zachęcający do kursu..."
              value={quickDescription}
              onChange={(e) => setQuickDescription(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Pełny opis*</label>
            <textarea
              placeholder="Szczegółowy program kursu i informacje..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
                onChange={(e) => setType(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Hasło (opcjonalnie)</label>
              <input
                type="password"
                placeholder="Ustaw, jeśli kurs prywatny"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Zdjęcie okładki</label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImg(e.target.files?.[0] || null)}
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

          <button
            id="save-btn"
            type="submit"
            disabled={isCreating}
            className="submit-btn"
          >
            {isCreating ? "Trwa przesyłanie..." : "Zapisz kurs"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Create_Course;
