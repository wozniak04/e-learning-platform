import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCourseCommentsStore } from "../store/Courses/CourseCommentsStore";
import "./styles/AddComment.css";
import { toast } from "react-toastify";
import TopNav from "../mainPage/topnav/TopNav";

const AddComment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addComment = useCourseCommentsStore((state) => state.addComment);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || comment.length === 0) return;
    console.log(comment);
    try {
      await addComment(id!, comment, rating);
      toast.success("Komentarz dodany pomyślnie");
      navigate("/main");
    } catch (error) {
      console.error("Błąd podczas wysyłania:", error);
    }
  };

  return (
    <div className="main-layout">
      <TopNav />
      <div className="comment-container">
        <h2>Dodaj opinię o kursie</h2>
        <form onSubmit={handleSubmit} className="comment-form">
          <div className="rating-section">
            <label>Ocena: </label>
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
            placeholder="Twoja opinia..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />

          <button type="submit" className="submit-button">
            Wyślij komentarz
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddComment;
