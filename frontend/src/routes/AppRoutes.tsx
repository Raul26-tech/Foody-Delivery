import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../modules/auth/pages/Login";
import { OrderPage } from "../modules/order/pages";
import { FormOrderPage } from "../modules/order/pages/form";
import { NotFoundPage } from "../modules/notFound";
import { PublicRoute } from "./PublicRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import { ProfilePage } from "../modules/profile";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/orders" element={<OrderPage />} />

        <Route path="/orders/new" element={<FormOrderPage />} />

        <Route path="/orders/:orderId" element={<FormOrderPage />} />

        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="/" element={<Navigate to="/orders" replace />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
