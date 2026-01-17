import { useEffect, useState } from "react";
import { useCourseCommentsStore } from "../store/Courses/CourseCommentsStore";
import type { LocalCommentsState } from "../store/Storetypes";
import "./styles/CourseComments.css";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

interface Props {
  courseUrl: string;
}

const CourseComments = ({ courseUrl }: Props) => {
  const { fetchComments, isLoading } = useCourseCommentsStore();
  const auth = useAuth();
  const [comments, setComments] = useState<LocalCommentsState | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchComments(courseUrl);

        if (result) {
          setComments({
            average_rating: result.average_rating,
            comments: result.comments,
          });
        }
      } catch (error) {
        setComments({ average_rating: 0, comments: [] });
      }
    };

    loadData();
  }, [courseUrl]);

  if (isLoading) return <div>Ładowanie opinii...</div>;
  if (!comments || comments.comments.length === 0)
    return <div>Brak opinii dla tego kursu.</div>;

  return (
    <div className="comments-display-container">
      <h3>Średnia ocena: {comments.average_rating} / 10</h3>

      <div className="comments-list">
        {comments.comments.map((c, index) => (
          <div key={index} className="comment-card">
            <div className="comment-side-info">
              {auth.username === c.user_name && (
                <Link
                  to={`/course/${courseUrl}/AddComment`}
                  className="comment-edit-link">
                  edycja komentarza
                </Link>
              )}
              <img
                src={c.user_avatar}
                alt="avatar"
                className="comment-avatar"
              />
              <div className="comment-user-details">
                <strong>{c.user_name}</strong>
                <small>{c.created_at}</small>
              </div>
            </div>

            <div className="comment-main-content">
              <div className="comment-rating">Ocena: {c.review_rating}/10</div>
              <p>{c.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseComments;
