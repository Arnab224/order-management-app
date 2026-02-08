import { BrowserRouter } from "react-router-dom";
import Routes from "./routes";
import { CartProvider } from "../features/cart/context/CartContext";
import { ToastProvider } from "../shared/context/ToastContext";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <Routes />
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
