import { useNavigate } from "react-router-dom";
import { useSavedCoursesStore } from "../../store/Courses/savedCoursesStore";
import { useTranslation } from "react-i18next";

interface Props {
  name: string;
  description: string;
  url: string;
  img: string | null;
}

function Course(props: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isSavedCourse = useSavedCoursesStore((state) => state.isInSavedCourse);

  const handleClick = () => {
    navigate(`/course/${props.url}`);
  };

  return (
    <div className="course-card" onClick={handleClick}>
      <p style={{ color: "green" }}>
        {isSavedCourse(props.url) ? t("course_card.saved") : ""}
      </p>

      <img
        src={
          props.img
            ? props.img
            : "https://www.e-learning.pl/wp-content/uploads/2023/06/elpl.jpg"
        }
        alt={props.name}
      />

      <h3>{props.name}</h3>
      <p>{props.description}</p>
    </div>
  );
}

export default Course;
