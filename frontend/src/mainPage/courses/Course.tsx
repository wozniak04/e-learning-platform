import { useState, useEffect } from "react";

function Course() {
  const [page, setpage] = useState(1);
  const [maxpage, setmaxpage] = useState(0);
  useEffect(() => {
    setmaxpage(5);
  }, []);

  return (
    <div className="Course-container">
      <h2>
        Course Component - Page {page} of {maxpage}
      </h2>
    </div>
  );
}
export default Course;
