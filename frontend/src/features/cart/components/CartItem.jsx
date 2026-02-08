import { useState } from "react";
import useCart from "../hooks/useCart";

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    updateQuantity(item.menuItemId, newQuantity);
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="w-24 h-24 flex-shrink-0">
        <img
          src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop"}
          alt={item.name}
          className="w-full h-full object-cover rounded"
        />
      </div>

      <div className="flex-1">
        <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
        <p className="text-gray-600 text-sm mb-2">₹{item.price} each</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center border rounded">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="px-3 py-1 hover:bg-gray-100"
              disabled={quantity <= 1}
            >
              −
            </button>
            <span className="px-4 py-1">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-3 py-1 hover:bg-gray-100"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-bold text-gray-900">
              ₹{(item.price * quantity).toFixed(2)}
            </span>
            <button
              onClick={() => removeItem(item.menuItemId)}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}