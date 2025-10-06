import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import "./mainpage.css";
import TopNav from "./topnav/TopNav";
function MainPage() {
  const auth = useAuth();
  const [username, setusername] = useState("");
  const wylogowanie = () => {
    auth.logout();
  };
  useEffect(() => {
    setusername(auth.username);
  }, []);
  return (
    <>
      <div className="box">
        <TopNav username={username} wylogowanie={wylogowanie} />
      </div>
    </>
  );
}
export default MainPage;
