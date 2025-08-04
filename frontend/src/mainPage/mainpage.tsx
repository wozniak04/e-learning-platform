import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
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
      <div>{username}</div>
      <button onClick={wylogowanie}>wyloguj</button>
    </>
  );
}
export default MainPage;
