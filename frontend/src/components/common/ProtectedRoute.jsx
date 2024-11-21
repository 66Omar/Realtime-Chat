import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthLoading from "./AuthLoading";
import { useContext } from "react";
import AuthContext from "@/src/contexts/AuthContext";

const ProtectedRoute = () => {
  const location = useLocation();
  const {token} = useContext(AuthContext)
  const loggingOut = false;

  return !token ? (
    <Navigate to={`/login?next=${location.pathname}`} />
  ) : loggingOut ? (
    <AuthLoading />
  ) : (
    <Outlet />
  );
};

export default ProtectedRoute;
