import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";

function PrivateLayout() {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <Spinner />;

  return auth.isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateLayout;
