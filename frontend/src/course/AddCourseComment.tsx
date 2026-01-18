import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCourseCommentsStore } from "../store/Courses/CourseCommentsStore";
import "./styles/AddComment.css";
import { toast } from "react-toastify";
import TopNav from "../mainPage/topnav/TopNav";

const AddComment = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const addComment = useCourseCommentsStore((state) => state.addComment);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || comment.length === 0) return;

    try {
      await addComment(id!, comment, rating);
      toast.success(t("comments.add_success"));
      navigate("/main");
    } catch (error) {
      console.error("Błąd podczas wysyłania:", error);
    }
  };

  return (
    <div className="main-layout">
      <TopNav />
      <div className="comment-container">
        <h2>{t("comments.add_title")}</h2>
        <form onSubmit={handleSubmit} className="comment-form">
          <div className="rating-section">
            <label>{t("course_details.rate")}</label>
            <select
              className="rating-select"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <textarea
            className="comment-textarea"
            placeholder={t("comments.placeholder")}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />

          <button type="submit" className="submit-button">
            {t("comments.submit_btn")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddComment;
