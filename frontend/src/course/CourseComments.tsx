import { useEffect, useState } from "react";
import { useCourseCommentsStore } from "../store/Courses/CourseCommentsStore";
import "./styles/CourseComments.css";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";
import Spinner from "../Spinner";

interface Props {
  courseUrl: string;
}

const CourseComments = ({ courseUrl }: Props) => {
  const {
    fetchComments,
    sortComments,
    isLoading,
    comments: storeComments,
  } = useCourseCommentsStore();
  const auth = useAuth();
  const [sortBy, setSortBy] = useState("date-desc");

  const currentCourseData = storeComments[courseUrl];

  useEffect(() => {
    fetchComments(courseUrl);
  }, [courseUrl]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as any;
    setSortBy(value);
    sortComments(courseUrl, value);
  };

  if (isLoading && !currentCourseData) return <Spinner />;

  if (!currentCourseData || currentCourseData.comments.length === 0)
    return <div>Brak opinii dla tego kursu.</div>;

  return (
    <div className="comments-display-container">
      <div className="comments-header">
        <h3>Średnia ocena: {currentCourseData.average_rating} / 10</h3>

        <div className="sort-container">
          <label htmlFor="comment-sort">Sortuj według: </label>
          <select id="comment-sort" value={sortBy} onChange={handleSortChange}>
            <option value="date-desc">Najnowsze</option>
            <option value="date-asc">Najstarsze</option>
            <option value="rating-desc">Ocena: od najwyższej</option>
            <option value="rating-asc">Ocena: od najniższej</option>
          </select>
        </div>
      </div>

      <div className="comments-list">
        {currentCourseData.comments.map((c, index) => (
          <div key={`${c.user_name}-${index}`} className="comment-card">
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
                <small>{new Date(c.created_at).toLocaleDateString()}</small>
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
