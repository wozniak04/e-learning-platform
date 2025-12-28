import { useNavigate } from "react-router-dom";

interface Props {
  name: string;
  description: string;
  url: string;
  imgsrc?: string;
}

function Course(props: Props) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/course/${props.url}`);
  };
  return (
    <>
      <div className="course-card" onClick={handleClick}>
        <img
          src={props.imgsrc ? props.imgsrc : "https://via.placeholder.com/150"}
          alt={props.name}
        />
        <h3>{props.name}</h3>
        <p>{props.description}</p>
      </div>
    </>
  );
}
export default Course;
