import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/CourseMaterialEditor.css";
import type { CourseMaterial } from "../../store/Storetypes";
import { toast } from "react-toastify";
import { useCourseMaterialStore } from "../../store/Courses/courseMaterialStore";
import { useNavigate, useParams } from "react-router";
import TopNav from "../../mainPage/topnav/TopNav";
import Spinner from "../../Spinner";

const CourseMaterialEditor = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchCourseMaterials = useCourseMaterialStore(
    (state) => state.fetchCourseMaterials,
  );
  const updateCourseMaterials = useCourseMaterialStore(
    (state) => state.setCourseMaterials,
  );
  const isLoading = useCourseMaterialStore((state) => state.isLoading);

  const [materials, setMaterials] = useState<CourseMaterial[]>([
    { title: "", content: "", page: 1 },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);

  const addPage = () => {
    if (materials.length >= 24) {
      toast.error(t("material_editor.max_lessons_error"));
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
      toast.success(t("material_editor.save_success"));
      navigate(`/course/${id}/edit`);
    } catch (error) {
      toast.error(t("material_editor.save_error"));
    }
  };

  useEffect(() => {
    fetchCourseMaterials(id!).then((res) => {
      if (res && res.length > 0) {
        setMaterials(res);
      }
    });
  }, [id, fetchCourseMaterials]);

  const currentItem = materials[activeIndex];

  if (isLoading) return <Spinner />;

  return (
    <div className="course-material-editor">
      <TopNav />
      <div className="form-wrapper">
        <h1>{t("material_editor.title")}</h1>

        <div className="pages-nav">
          {materials.map((_, i) => (
            <div
              key={i}
              className={`page-tab ${i === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(i)}>
              {i + 1}
            </div>
          ))}
          <button
            type="button"
            className="add-tab-btn"
            onClick={addPage}
            title={t("material_editor.add_page_tooltip")}
            hidden={materials.length >= 24}>
            +
          </button>
        </div>

        {currentItem && (
          <div className="active-lesson-container">
            <div className="material-header">
              <span className="page-badge">
                {t("material_editor.editing_lesson", {
                  page: currentItem.page,
                })}
              </span>
              <button
                type="button"
                className="remove-btn"
                onClick={() => removePage(activeIndex)}>
                {t("material_editor.remove_lesson")}
              </button>
            </div>

            <div className="create-form">
              <div className="input-group">
                <label>{t("material_editor.lesson_title")}</label>
                <input
                  type="text"
                  placeholder={t("material_editor.title_placeholder")}
                  value={currentItem.title ?? ""}
                  onChange={(e) => updateField("title", e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>{t("material_editor.content_label")}</label>
                <textarea
                  placeholder={t("material_editor.content_placeholder")}
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
          onClick={saveCourseMaterials}>
          {t("material_editor.save_all", { count: materials.length })}
        </button>
      </div>
    </div>
  );
};

export default CourseMaterialEditor;
