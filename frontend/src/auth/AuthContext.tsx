import { useState, useContext, createContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;
interface AuthContextType {
  isAuthenticated: boolean;
  username: string;
  login: (user: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [username, setusername] = useState("");

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/me`, { withCredentials: true })
      .then((res) => {
        if (res.data.user) {
          console.log("wazny token");
          login(res.data.user);
          navigate("/main");
        } else {
          logout();
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("nie wazny token");
        logout();
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
      .post(
        `${BACKEND_URL}/logout`,
        {},
        {
          withCredentials: true,
          headers: { "x-csrf-token": tokencsrf.data.csrfToken },
        }
      )
      .catch((error) => console.error("Logout failed:", error));
    setusername("");
    setisAuthenticated(false);
  };
  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext)!;
