import { Routes, Route } from "react-router-dom";
import MenuList from "../features/menu/components/MenuList";
import CheckoutForm from "../features/order/components/CheckoutForm";
import OrderStatus from "../features/order/components/OrderStatus";
import OrderHistory from "../features/order/components/OrderHistory";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MenuList />} />
      <Route path="/checkout" element={<CheckoutForm />} />
      <Route path="/orders" element={<OrderHistory />} />
      <Route path="/order/:id" element={<OrderStatus />} />
    </Routes>
  );
}
