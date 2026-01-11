import { useEffect, useState } from "react";
import { useCourseCommentsStore } from "../store/Courses/CourseCommentsStore";
import type { LocalCommentsState } from "../store/Storetypes";
import "./styles/CourseComments.css";

interface Props {
  courseUrl: string;
}

const CourseComments = ({ courseUrl }: Props) => {
  const { fetchComments, isLoading } = useCourseCommentsStore();

  const [localData, setLocalData] = useState<LocalCommentsState | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchComments(courseUrl);

        if (result) {
          setLocalData({
            average_rating: result.average_rating,
            comments: result.comments,
          });
        }
      } catch (error) {
        setLocalData({ average_rating: 0, comments: [] });
      }
    };

    loadData();
  }, [courseUrl]);

  if (isLoading) return <div>Ładowanie opinii...</div>;
  if (!localData || localData.comments.length === 0)
    return <div>Brak opinii dla tego kursu.</div>;

  return (
    <div className="comments-display-container">
      <h3>Średnia ocena: {localData.average_rating} / 10</h3>

      <div className="comments-list">
        {localData.comments.map((c, index) => (
          <div key={index} className="comment-card">
            <div className="comment-side-info">
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
