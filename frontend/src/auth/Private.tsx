import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Spinner from "./Spinner";

function PrivateLayout() {
  const { isloading, isAuthenticated } = useAuth();

  if (isloading) return <Spinner />;
  //console.log("PrivateLayout - isAuthenticated:", isAuthenticated);
  //console.log("localStorage lastPath:", localStorage.getItem("lastPath"));
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateLayout;
