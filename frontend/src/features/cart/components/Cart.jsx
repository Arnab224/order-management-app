import useCart from "../hooks/useCart";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";

export default function Cart() {
  const { items, clearCart } = useCart();
  
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 200 ? 0 : 40;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Clear Cart
          </button>
        )}
      </div>
      
      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
          <Link
            to="/"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4">
              {items.map(item => (
                <CartItem key={item.menuItemId} item={item} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-xl text-gray-900">₹{total.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Inclusive of all taxes
                </p>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-orange-600 text-white text-center py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors mb-4"
              >
                Proceed to Checkout
              </Link>

              <div className="text-xs text-gray-500 space-y-1">
                <p className="flex items-center gap-1">
                  <span>🔒</span>
                  <span>Secure checkout</span>
                </p>
                <p className="flex items-center gap-1">
                  <span>🔄</span>
                  <span>Easy returns & refunds</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}