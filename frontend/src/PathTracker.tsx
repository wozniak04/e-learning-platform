import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";

function PathTracker() {
  const location = useLocation();
  const auth = useAuth();

  useEffect(() => {
    const pathsToIgnore = ["/login", "/register", "/"];

    if (!pathsToIgnore.includes(location.pathname) && !auth.isAuthenticated) {
      //console.log("Zapisuję ścieżkę:", location.pathname);
      localStorage.setItem("lastPath", location.pathname);
    }
  }, [location.pathname]);

  return null;
}

export default PathTracker;
