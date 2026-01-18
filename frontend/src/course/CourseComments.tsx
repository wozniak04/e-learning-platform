import { useEffect, useState } from "react";
import { useCourseCommentsStore } from "../store/Courses/CourseCommentsStore";
import "./styles/CourseComments.css";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";
import Spinner from "../Spinner";
import { useTranslation } from "react-i18next";

interface Props {
  courseUrl: string;
}

const CourseComments = ({ courseUrl }: Props) => {
  const { t } = useTranslation();
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
    return <div>{t("course.no_reviews")}</div>;

  return (
    <div className="comments-display-container">
      <div className="comments-header">
        <h3>
          {t("course_details.average")} {currentCourseData.average_rating} / 10
        </h3>

        <div className="sort-container">
          <label htmlFor="comment-sort">{t("course_details.sort")}</label>

          <select id="comment-sort" value={sortBy} onChange={handleSortChange}>
            <option value="date-desc">{t("sort.newest")}</option>
            <option value="date-asc">{t("sort.oldest")}</option>
            <option value="rating-desc">{t("sort.rating_high")}</option>
            <option value="rating-asc">{t("sort.rating_low")}</option>
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
                  {t("course_details.edit_review")}
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
              <div className="comment-rating">
                {t("course_details.rate")} {c.review_rating}/10
              </div>
              <p>{c.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseComments;
