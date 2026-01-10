import React, { useEffect, useState } from "react";
import TopNav from "../../mainPage/topnav/TopNav";
import "../styles/create_Course.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { BACKEND_URL } from "../../variables";
import { useCoursesInfoStore } from "../../store/Courses/CourseInfoStore";
import Spinner from "../../Spinner";
import type { CourseInfo } from "../../store/Storetypes";
import DeleteCourseModal from "./DeleteCourseModal";

function EditCourse() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [ispublished, setispublished] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [quickDescription, setQuickDescription] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [password, setPassword] = useState("");
  const [img, setImg] = useState<File | null>(null);
  const updateCourseInfo = useCoursesInfoStore(
    (state) => state.updateCourseInfo
  );
  const isLoading = useCoursesInfoStore((state) => state.isLoading);
  const fetchCourseInfoByUrl = useCoursesInfoStore(
    (state) => state.fetchCourseInfoByUrl
  );
  const deleteCourse = useCoursesInfoStore((state) => state.deleteCourse);
  const updatetitle = (val: string) => setTitle(val);

  const updatequick_description = (val: string) => setQuickDescription(val);

  const updatedescription = (val: string) => setDescription(val);
  const updatetype = (val: string) => setType(val);
  const updatepassword = (val: string) => setPassword(val);
  const updateimg = (file: File | null) => setImg(file);

  const updateCourseInformation = async () => {
    setIsCreating(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("quick_description", quickDescription);
      if (type) formData.append("type", type);
      if (password) formData.append("password", password);
      if (img) formData.append("img", img);
      updateCourseInfo(id!, formData as Partial<CourseInfo>);
      toast.success("Kurs został edytowany pomyślnie!");
    } catch (error) {
      toast.error("Błąd podczas edytowania kursu");
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        if (id) {
          const info = await fetchCourseInfoByUrl(id);
          if (info) {
            setTitle(info.title ?? "");
            setQuickDescription(info.quick_description ?? "");
            setDescription(info.description ?? "");
            setType(info.type ?? "");
            setispublished(info.created_at !== null);
          }
        }
      } catch (error) {
        console.error("Błąd pobierania danych kursu:", error);
      }
    };

    loadCourseData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCourseInformation();
      toast.success("Kurs został edytowany pomyślnie!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const handlePublish = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/courses/${id}/publish`,
        {},
        { withCredentials: true }
      );

      response.status === 200;
      toast.success("Opublikowano kurs!");

      setispublished(true);

      setTimeout(() => navigate("/main"), 1500);
    } catch (error) {
      toast.error("Nie udało się opublikować kursu");
      console.error("Błąd podczas publikowania: ", error);
    }
  };
  const handleDeleteClick = async () => {
    try {
      await deleteCourse(id!);
      toast.success("usunięto kurs");
      navigate("/main");
    } catch (error) {
      console.error(error);
      toast.error("nie udało sie usunąć kursu");
    }
  };

  if (isLoading) {
    return <Spinner />;
  }
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
              value={title}
              onChange={(e) => updatetitle(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Krótki opis (max 50 słów)*</label>
            <input
              type="text"
              placeholder="..."
              value={quickDescription}
              onChange={(e) => updatequick_description(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Pełny opis*</label>
            <textarea
              placeholder="..."
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
                value={type}
                onChange={(e) => updatetype(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Hasło (opcjonalnie)</label>
              <input
                type="password"
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
                {img ? "Zmień zdjęcie" : "Kliknij, aby wybrać zdjęcie"}
              </label>
              {img && <p className="file-info">✓ {img.name}</p>}
            </div>
          </div>
          <Link to={`/course/${id}/materials`}>
            <button type="button" className="submit-btn">
              Dodaj materiały
            </button>
          </Link>
          <button
            id="save-btn"
            type="submit"
            disabled={isCreating}
            className="submit-btn"
          >
            {isCreating ? "Trwa przesyłanie..." : "zapisz zmiany"}
          </button>
        </form>
        <button hidden={ispublished} onClick={handlePublish}>
          opublikuj kurs
        </button>
        <div className="danger-zone">
          <button
            type="button"
            className="delete-btn-outline"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Usuń kurs
          </button>

          {showDeleteConfirm && (
            <DeleteCourseModal
              onConfirm={handleDeleteClick}
              onCancel={() => setShowDeleteConfirm(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default EditCourse;
