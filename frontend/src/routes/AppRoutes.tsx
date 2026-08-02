import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../modules/auth/pages/Login";
import { RegisterPage } from "../modules/auth/pages/Register";
import { OrderPage } from "../modules/order/pages";
import { NotFoundPage } from "../modules/notFound";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/orders" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/orders" element={<OrderPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
