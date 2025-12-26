import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import "./mainpage.css";
import TopNav from "./topnav/TopNav";
import Courses from "./courses/Courses";
function MainPage() {
  const auth = useAuth();

  const wylogowanie = () => {
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
