import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../modules/auth/pages/Login";
import { OrderPage } from "../modules/order/pages";
import { FormOrderPage } from "../modules/order/pages/form";
import { NotFoundPage } from "../modules/notFound";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/orders" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<LoginPage />} />
      <Route path="/orders" element={<OrderPage />} />
      <Route path="/orders/new" element={<FormOrderPage />} />
      <Route path="/orders/:orderId" element={<FormOrderPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
