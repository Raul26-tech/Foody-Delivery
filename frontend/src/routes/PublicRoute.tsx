import { Navigate, Outlet } from "react-router-dom";

import { LoadingScreen } from "../components/LoginScreen";
import { useAuth } from "../hooks/useAuth";

export function PublicRoute() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/orders" replace />;
  }

  return <Outlet />;
}
