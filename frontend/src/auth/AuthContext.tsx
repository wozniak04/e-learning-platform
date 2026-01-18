import { useState, useContext, createContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { BACKEND_URL } from "../variables";
interface AuthContextType {
  isAuthenticated: boolean;
  username: string;
  isloading: boolean;
  login: (user: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [username, setusername] = useState("");
  const [isloading, setIsloading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/me`, { withCredentials: true })
      .then((res) => {
        if (res.data.user) {
          // console.log("wazny token");
          login(res.data.user);

          if (localStorage.getItem("lastPath"))
            navigate(localStorage.getItem("lastPath")!);
          else if (
            location.pathname !== "/login" &&
            location.pathname !== "/register"
          )
            navigate(location.pathname);
          else navigate("/main");

          localStorage.removeItem("lastPath");
        } else {
          logout();
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("nie wazny token");
        logout();
      })
      .finally(() => {
        setIsloading(false);
      });
  }, []);

  const login = (user: string) => {
    setisAuthenticated(true);
    setusername(user);
  };
  const logout = async () => {
    const tokencsrf = await axios.get(`${BACKEND_URL}/csrf-token`, {
      withCredentials: true,
    });
    axios
      .delete(`${BACKEND_URL}/logout`, {
        withCredentials: true,
        headers: { "x-csrf-token": tokencsrf.data.csrfToken },
      })
      .catch((error) => console.error("Logout failed:", error));

    setusername("");
    setisAuthenticated(false);
  };
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, username, isloading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext)!;
