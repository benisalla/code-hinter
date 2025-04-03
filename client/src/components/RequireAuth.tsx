
import { useLocation, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./context/authStore";

interface AuthProp {
  allowedRole?: string;
  children: React.ReactNode;
}

const RequireAuth = ({ allowedRole }: AuthProp) => {
  const { user } = useAuth();
  const location = useLocation();

  // no roles provided then check for authentification only
  if(!allowedRole) {
    return user ? (
      <Outlet />
    ) : (
      <Navigate to="/sign-in" state={{ from: location }} replace />
    );
  }

  return user?.role === allowedRole ? (
    <Outlet />
  ) : user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/sign-in" state={{ from: location }} replace />
  );
};

export default RequireAuth;