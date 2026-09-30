import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { selectIsAuthenticated } from "../redux/selector";

// Sirf logged-in user ke liye (dashboard waghera)
export const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
};

// Login/Register: already logged in ho to dashboard bhej do
export const PublicOnlyRoute = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }
  return <Outlet />;
};
