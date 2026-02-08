import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useCart from "../../cart/hooks/useCart";
import useOrder from "../hooks/useOrder";
import CartItem from "../../cart/components/CartItem";
import { useToast } from "../../../shared/context/ToastContext";
import Navbar from "../../../shared/components/Navbar";

export default function CheckoutForm() {
  const { items, clearCart } = useCart();
  const { submitOrder, loading } = useOrder();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    customerName: "",
    address: "",
    phone: "",
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const submit = async e => {
    e.preventDefault();
    if (!form.customerName || !form.address || !form.phone) {
      addToast("Please fill all fields", "error");
      return;
    }
    if (items.length === 0) {
      addToast("Cart is empty", "error");
      return;
    }
    
    try {
      const order = await submitOrder({ ...form, items });
      clearCart();
      addToast("Order placed successfully!", "success");
      navigate(`/order/${order._id}`);
    } catch (error) {
      addToast("Failed to place order. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24 pb-12 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Complete Your Order</h1>
          <p className="text-gray-500 mt-2">Review your cart and add delivery details</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-2xl">🛍️</span>
                <span>Your Order</span>
              </h2>
              
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl block mb-4">🛒</span>
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                  <Link
                    to="/"
                    className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors"
                  >
                    Browse Menu
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-96 overflow-y-auto pr-2">
                    {items.map(item => (
                      <CartItem key={item.menuItemId} item={item} />
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{total}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <span className="text-green-600 font-medium">FREE</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Taxes</span>
                      <span>₹{Math.round(total * 0.05)}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between items-center">
                      <span className="font-bold text-xl">Total</span>
                      <span className="font-bold text-2xl text-green-600">
                        ₹{total + Math.round(total * 0.05)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-2xl">📍</span>
                <span>Delivery Details</span>
              </h2>
              
              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={form.customerName}
                    onChange={e => setForm({ ...form, customerName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    required
                    placeholder="House No., Street, Area, Landmark"
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-300 resize-none"
                    rows="4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 XXXXX XXXXX"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-300"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading || items.length === 0}
                      className="w-full bg-linear-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Placing Order...</span>
                      </>
                    ) : (
                      <>
                        <span>🎉</span>
                        <span>Place Order</span>
                        <span>₹{total + Math.round(total * 0.05)}</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  By placing this order, you agree to our Terms and Conditions
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
