import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

function Course() {
  const [page, setpage] = useState(1);
  const [maxpage, setmaxpage] = useState(0);
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    setmaxpage(5);
  }, []);

  return (
    <div className="Course-container">
      <Link to="/main">Back to Main Page</Link>
      <h1>{id}</h1>
      <h2>
        Course Component - Page {page} of {maxpage}
      </h2>
    </div>
  );
}
export default Course;
