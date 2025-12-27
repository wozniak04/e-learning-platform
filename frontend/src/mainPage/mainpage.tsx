import { useAuth } from "../auth/AuthContext";
import "./mainpage.css";
import TopNav from "./topnav/TopNav";
import Courses from "./courses/Courses";
import { toast } from "react-toastify";
function MainPage() {
  const auth = useAuth();

  const wylogowanie = () => {
    toast.info("Wylogowano pomyślnie.");
    auth.logout();
  };

  return (
    <>
      <div className="box">
        <TopNav username={auth.username} wylogowanie={wylogowanie} />
        <Courses />
      </div>
    </>
  );
}
export default MainPage;
