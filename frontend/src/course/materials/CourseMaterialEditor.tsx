import { useEffect, useState } from "react";
import "../styles/CourseMaterialEditor.css";
import type { CourseMaterial } from "../../store/Storetypes";
import { toast } from "react-toastify";
import { useCourseMaterialStore } from "../../store/Courses/courseMaterialStore";
import { useNavigate, useParams } from "react-router";
import TopNav from "../../mainPage/topnav/TopNav";
import Spinner from "../../Spinner";
const CourseMaterialEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fetchCourseMaterials = useCourseMaterialStore(
    (state) => state.fetchCourseMaterials
  );
  const updateCourseMaterials = useCourseMaterialStore(
    (state) => state.setCourseMaterials
  );
  const isLoading = useCourseMaterialStore((state) => state.isLoading);
  const [materials, setMaterials] = useState<CourseMaterial[]>([
    { title: "", content: "", page: 1 },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const addPage = () => {
    if (materials.length >= 24) {
      toast.error("Nie można dodać więcej niż 24 lekcje do kursu.");
      return;
    }
    const newPage = { title: "", content: "", page: materials.length + 1 };
    setMaterials([...materials, newPage]);
    setActiveIndex(materials.length);
  };

  const removePage = (idx: number) => {
    if (materials.length <= 1) return;

    const updated = materials
      .filter((_, i) => i !== idx)
      .map((item, i) => ({ ...item, page: i + 1 }));

    setMaterials(updated);

    setActiveIndex(Math.max(0, idx - 1));
  };

  const updateField = (field: keyof CourseMaterial, val: string) => {
    const updated = [...materials];
    updated[activeIndex] = { ...updated[activeIndex], [field]: val };
    setMaterials(updated);
  };
  const saveCourseMaterials = async () => {
    try {
      await updateCourseMaterials(id!, materials);
      toast.success("zaktualizowano materiały pomyślnie");
      navigate(`/course/${id}/edit`);
    } catch (error) {
      console.log(error);
      toast.error("błąd podczas aktualizacji materiałów", error!);
    }
  };

  useEffect(() => {
    fetchCourseMaterials(id!).then((res) => {
      if (res.length === 0) {
        console.log("No materials found for this course.");
        return;
      }
      setMaterials(res);
    });
  }, []);
  const currentItem = materials[activeIndex];

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div className="course-material-editor">
      <TopNav />
      <div className="form-wrapper">
        <h1>Materiały Kursu</h1>

        {/* PASEK Z NUMERKAMI (TABS) */}
        <div className="pages-nav">
          {materials.map((_, i) => (
            <div
              key={i}
              className={`page-tab ${i === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(i)}
            >
              {i + 1}
            </div>
          ))}
          <button
            type="button"
            className="add-tab-btn"
            onClick={addPage}
            title="Dodaj stronę"
            hidden={materials.length >= 24}
          >
            +
          </button>
        </div>

        {/* GŁÓWNY KOMPONENT EDYCJI */}
        {currentItem && (
          <div className="active-lesson-container">
            <div className="material-header">
              <span className="page-badge">
                Edytujesz Lekcję {currentItem.page}
              </span>
              <button
                type="button"
                className="remove-btn"
                onClick={() => removePage(activeIndex)}
              >
                Usuń tę lekcję
              </button>
            </div>

            <div className="create-form">
              <div className="input-group">
                <label>Tytuł lekcji</label>
                <input
                  type="text"
                  placeholder="Wpisz tytuł..."
                  value={currentItem.title ?? ""}
                  onChange={(e) => updateField("title", e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Treść (Markdown)</label>
                <textarea
                  placeholder="Napisz coś ciekawego..."
                  value={currentItem.content ?? ""}
                  onChange={(e) => updateField("content", e.target.value)}
                  rows={12}
                />
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          className="submit-btn"
          style={{ marginTop: "30px" }}
          onClick={saveCourseMaterials}
        >
          Zapisz cały program kursu ({materials.length} lekcji)
        </button>
      </div>
    </div>
  );
};

export default CourseMaterialEditor;
