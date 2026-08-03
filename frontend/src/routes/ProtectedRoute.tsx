import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LoadingScreen } from "../components/LoginScreen";

export function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuth();

  const location = useLocation();

  if (isInitializing) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
}
