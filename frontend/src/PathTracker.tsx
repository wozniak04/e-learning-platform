import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function PathTracker() {
  const location = useLocation();

  useEffect(() => {
    const pathsToIgnore = ["/login", "/register", "/"];

    if (!pathsToIgnore.includes(location.pathname)) {
      console.log("Zapisuję ścieżkę:", location.pathname);
      localStorage.setItem("lastPath", location.pathname);
    }
  }, [location.pathname]);

  return null;
}

export default PathTracker;
