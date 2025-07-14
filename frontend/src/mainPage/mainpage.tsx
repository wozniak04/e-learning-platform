import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
function MainPage() {
  const auth = useAuth();
  const [username, setusername] = useState("");
  useEffect(() => {
    setusername(auth.username);
  }, []);
  return (
    <>
      <div>{username}</div>
    </>
  );
}
export default MainPage;
