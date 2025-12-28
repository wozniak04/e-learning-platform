import "./mainpage.css";
import TopNav from "./topnav/TopNav";
import Courses from "./courses/Courses";

function MainPage() {
  return (
    <>
      <div id="box">
        <TopNav />
        <Courses />
      </div>
    </>
  );
}
export default MainPage;
