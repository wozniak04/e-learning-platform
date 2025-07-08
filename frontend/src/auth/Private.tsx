import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

function PrivateLayout() {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
export default PrivateLayout;
