import React, { useState } from "react";
import TopNav from "../../mainPage/topnav/TopNav";
import "../styles/create_Course.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { BACKEND_URL } from "../../variables";
import { useCoursesInfoStore } from "../../store/Courses/CourseInfoStore";
import { useAuth } from "../../auth/AuthContext";
import { useTranslation } from "react-i18next";
import { getCsrfToken, getCsrfHeaders } from "../../Api/csrfHelper";

function Create_Course() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [quickDescription, setQuickDescription] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("inne");
  const password = "";
  const [img, setImg] = useState<File | null>(null);

  const addCourseToStore = useCoursesInfoStore(
    (state) => state.addNewCourseInfo,
  );

  const auth = useAuth();

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

      const csrfToken = await getCsrfToken();
      const result = await axios.post(
        `${BACKEND_URL}/courses/create`,
        formData,
        {
          withCredentials: true,
          headers: getCsrfHeaders(csrfToken),
        },
      );

      toast.success(t("create_course.success"));

      addCourseToStore(result.data.courseId, {
        title,
        quick_description: quickDescription,
        description,
        owner_name: auth.username,
        type,
        img: result.data.imgsrc,
        material_count: 0,
        created_at: null,
      });

      navigate(`/course/${result.data.courseId}/edit`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("create_course.error"));
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="Create_Course-container">
      <TopNav />

      <div className="form-wrapper">
        <h1>{t("create_course.title")}</h1>

        <form className="create-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>{t("create_course.course_title")}</label>
            <input
              type="text"
              placeholder={t("create_course.course_title_placeholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>{t("create_course.quick_description")}</label>
            <input
              type="text"
              placeholder={t("create_course.quick_description_placeholder")}
              value={quickDescription}
              onChange={(e) => setQuickDescription(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>{t("create_course.full_description")}</label>
            <textarea
              placeholder={t("create_course.full_description_placeholder")}
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
              <select
                className="course-type-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  fontSize: "1rem",
                }}>
                <option value="matematyka">{t("course_types.math")}</option>
                <option value="fizyka">{t("course_types.physics")}</option>
                <option value="informatyka">{t("course_types.it")}</option>
                <option value="języki">{t("course_types.languages")}</option>
                <option value="inne">{t("course_types.other")}</option>
              </select>
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

              <label htmlFor="file-input" style={{ cursor: "pointer" }}>
                {img
                  ? t("create_course.change_image")
                  : t("create_course.choose_image")}
              </label>

              {img && (
                <p className="file-info">
                  ✓ {t("create_course.image_selected")} {img.name}
                </p>
              )}
            </div>
          </div>

          <button
            id="save-btn"
            type="submit"
            disabled={isCreating}
            className="submit-btn">
            {isCreating
              ? t("create_course.uploading")
              : t("create_course.save_course")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Create_Course;
