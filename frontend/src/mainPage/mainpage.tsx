import "./mainpage.css";
import TopNav from "./topnav/TopNav";
import Courses from "./courses/Courses";
import AdBanner from "./AdBanner";

function MainPage() {
  return (
    <div id="box">
      <AdBanner />
      <TopNav />
      <Courses />
    </div>
  );
}

export default MainPage;
