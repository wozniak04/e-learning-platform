import { useState, useContext, createContext } from "react";
import Cookies from "js-cookie";

interface AuthContextType {
  isAuthenticated: boolean;
  username: string;
  login: (user: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [username, setusername] = useState("");
  const login = (user: string) => {
    Cookies.set("username", user);
    Cookies.set("auth", "fsfdwawda");
    setisAuthenticated(true);
    setusername(user);
  };
  const logout = () => {
    Cookies.remove("username");
    Cookies.remove("auth");
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
