import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllOrders } from "../services/order.api";
import Navbar from "../../../shared/components/Navbar";
import Loader from "../../../shared/components/Loader";

const statusConfig = {
  ORDER_RECEIVED: {
    label: "Order Received",
    icon: "📝",
    color: "bg-blue-100 text-blue-700",
    borderColor: "border-blue-200"
  },
  PREPARING: {
    label: "Preparing",
    icon: "👨‍🍳",
    color: "bg-yellow-100 text-yellow-700",
    borderColor: "border-yellow-200"
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    icon: "🚚",
    color: "bg-orange-100 text-orange-700",
    borderColor: "border-orange-200"
  },
  DELIVERED: {
    label: "Delivered",
    icon: "✅",
    color: "bg-green-100 text-green-700",
    borderColor: "border-green-200"
  },
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllOrders()
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load order history");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-[calc(100vh-6rem)]">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-[calc(100vh-6rem)]">
          <div className="text-center">
            <span className="text-6xl block mb-4">😞</span>
            <p className="text-red-600 font-semibold text-lg mb-4">{error}</p>
            <Link
              to="/"
              className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors inline-block"
            >
              Back to Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-24 pb-12 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Order History</h1>
          <p className="text-gray-500 mt-2">Track and view all your past orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl">
            <p className="text-6xl mb-4">📦</p>
            <p className="text-2xl text-gray-400 font-bold mb-2">No orders yet</p>
            <p className="text-gray-500 mb-6">Start by ordering some delicious food!</p>
            <Link
              to="/"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors font-semibold"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const statusInfo = statusConfig[order.status] || statusConfig.ORDER_RECEIVED;
              const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              });

              return (
                <Link
                  key={order._id}
                  to={`/order/${order._id}`}
                  className="block bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-orange-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="font-mono text-sm text-gray-500">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${statusInfo.color} ${statusInfo.borderColor} inline-flex items-center gap-2`}>
                          <span>{statusInfo.icon}</span>
                          <span>{statusInfo.label}</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">👤 {order.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📍 {order.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📞 {order.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>🕐 {orderDate}</span>
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-gray-500">
                        {order.items.length} item{order.items.length > 1 ? "s" : ""} ordered
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full font-semibold text-sm hover:bg-orange-100 transition-colors">
                        <span>Track Order</span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
