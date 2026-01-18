import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TopNav from "../../mainPage/topnav/TopNav";
import "../styles/create_Course.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useCoursesInfoStore } from "../../store/Courses/CourseInfoStore";
import Spinner from "../../Spinner";
import type { CourseInfo } from "../../store/Storetypes";
import DeleteCourseModal from "./DeleteCourseModal";
import { useCourseMaterialStore } from "../../store/Courses/courseMaterialStore";

function EditCourse() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [materiallength, setmateriallength] = useState(0);
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
    (state) => state.updateCourseInfo,
  );
  const isLoading = useCoursesInfoStore((state) => state.isLoading);
  const fetchCourseInfoByUrl = useCoursesInfoStore(
    (state) => state.fetchCourseInfoByUrl,
  );
  const fetchCourseMaterials = useCourseMaterialStore(
    (state) => state.fetchCourseMaterials,
  );
  const deleteCourse = useCoursesInfoStore((state) => state.deleteCourse);
  const publishCourse = useCoursesInfoStore((state) => state.publishCourse);

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
      await updateCourseInfo(id!, formData as Partial<CourseInfo>);
    } catch (error) {
      toast.error(t("edit_course.error"));
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        if (id) {
          const info = await fetchCourseInfoByUrl(id);
          const material = await fetchCourseMaterials(id);
          if (info) {
            setTitle(info.title ?? "");
            setQuickDescription(info.quick_description ?? "");
            setDescription(info.description ?? "");
            setType(info.type ?? "");
            setispublished(info.created_at !== null);
          }
          if (material) {
            setmateriallength(material.length);
          }
        }
      } catch (error) {
        console.error("Error loading course data:", error);
      }
    };
    loadCourseData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCourseInformation();
      toast.success(t("edit_course.success"));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handlePublish = async () => {
    if (materiallength <= 0) {
      toast.info(t("edit_course.publish_info"));
      return;
    }
    try {
      await publishCourse(id!);
      navigate("/main");
    } catch (error) {
      toast.error(error as string);
    }
  };

  const handleDeleteClick = async () => {
    try {
      await deleteCourse(id!);
      toast.success(t("edit_course.delete_success"));
      navigate("/main");
    } catch (error) {
      toast.error(t("edit_course.delete_error"));
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="Create_Course-container">
      <TopNav />
      <div className="form-wrapper">
        <h1>{t("edit_course.title")}</h1>
        <Link to={`/course/${id}`} className="back-link">
          ← {t("edit_course.back_to_details")}
        </Link>
        <form className="create-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>{t("create_course.course_title")}</label>
            <input
              type="text"
              placeholder="..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>{t("create_course.quick_description")}</label>
            <input
              type="text"
              placeholder="..."
              value={quickDescription}
              onChange={(e) => setQuickDescription(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>{t("create_course.full_description")}</label>
            <textarea
              placeholder="..."
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
            }}>
            <div className="input-group">
              <label>{t("create_course.course_type")}</label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>{t("create_course.password")}</label>
              <input
                type="password"
                value={password || ""}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="input-group">
            <label>{t("create_course.cover_image")}</label>
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
                style={{ cursor: "pointer", color: "var(--muted)" }}>
                {img
                  ? t("create_course.change_image")
                  : t("create_course.choose_image")}
              </label>
              {img && <p className="file-info">✓ {img.name}</p>}
            </div>
          </div>
          <Link to={`/course/${id}/materials`}>
            <button type="button" className="submit-btn">
              {t("edit_course.add_materials")}
            </button>
          </Link>
          <button
            id="save-btn"
            type="submit"
            disabled={isCreating}
            className="submit-btn">
            {isCreating
              ? t("create_course.uploading")
              : t("edit_course.save_changes")}
          </button>
        </form>
        {!ispublished && (
          <button
            type="button"
            className="submit-btn"
            style={{ backgroundColor: "#22c55e", marginTop: "10px" }}
            onClick={handlePublish}>
            {t("edit_course.publish_btn")}
          </button>
        )}
        <div className="danger-zone">
          <button
            type="button"
            className="delete-btn-outline"
            onClick={() => setShowDeleteConfirm(true)}>
            {t("edit_course.delete_btn")}
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
