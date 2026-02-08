
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { socket } from "../../../shared/services/socket";
import { getOrderStatus } from "../services/order.api";
import Loader from "../../../shared/components/Loader";
import Navbar from "../../../shared/components/Navbar";
import { FiCheck, FiClock, FiMapPin, FiShoppingBag, FiChevronRight } from "react-icons/fi";

const statusSteps = {
  ORDER_RECEIVED: {
    label: "Order Received",
    icon: <FiShoppingBag />,
    step: 1,
    color: "blue",
    description: "We've received your order!",
  },
  PREPARING: {
    label: "Preparing",
    icon: <FiClock />,
    step: 2,
    color: "orange", 
    description: "Our chefs are working on your order",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    icon: <FiMapPin />,
    step: 3,
    color: "yellow",
    description: "Your food is on its way!",
  },
  DELIVERED: {
    label: "Delivered",
    icon: <FiCheck />,
    step: 4,
    color: "green",
    description: "Enjoy your meal!",
  },
};

export default function OrderStatus() {
  const { id } = useParams();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOrderStatus(id)
      .then(res => {
        setStatus(res.data.status);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load order status");
        setLoading(false);
      });

    socket.on("order-status-update", data => {
      if (data.orderId === id) {
        setStatus(data.status);
      }
    });

    return () => socket.off("order-status-update");
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 flex items-center justify-center min-h-[50vh]">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-center bg-white p-10 rounded-3xl shadow-sm border border-gray-100 max-w-md mx-4">
            <span className="text-6xl block mb-6">😕</span>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Oops!</h3>
            <p className="text-gray-500 mb-8">{error}</p>
            <Link
              to="/"
              className="bg-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors inline-block"
            >
              Back to Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentStep = statusSteps[status]?.step || 1;
  const currentStatus = statusSteps[status];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />

      <main className="pt-32 max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Track Order</h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              Order ID: <span className="font-mono font-medium text-gray-700">#{id.slice(-8).toUpperCase()}</span>
            </p>
          </div>
          <div className="text-right hidden sm:block">
             <span className="text-sm text-gray-400">Estimated Arrival</span>
             <p className="text-xl font-bold text-gray-800">25-30 Mins</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10 mb-8 overflow-hidden relative">
          
          <div className="flex justify-center mb-10">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-${currentStatus?.color}-50 text-${currentStatus?.color}-700`}>
              <span className="text-2xl">{currentStatus?.icon}</span>
              <span className="font-bold text-lg">{currentStatus?.label}</span>
            </div>
          </div>

          <div className="relative mb-12 mx-4 sm:mx-8">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
            
            <div 
              className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />

            <div className="relative flex justify-between">
              {Object.entries(statusSteps).map(([key, value]) => {
                const isActive = currentStep >= value.step;
                const isCurrent = status === key;

                return (
                  <div key={key} className="flex flex-col items-center group">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg transition-all duration-500 border-4 ${
                        isActive
                          ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200"
                          : "bg-white border-gray-200 text-gray-300"
                      } ${isCurrent ? "scale-110 ring-4 ring-orange-100" : ""}`}
                    >
                      {isActive ? <FiCheck className="w-5 h-5 sm:w-6 sm:h-6" /> : <span className="text-sm font-semibold">{value.step}</span>}
                    </div>
                    
                    <div className="absolute -bottom-10 w-32 text-center hidden sm:block">
                      <p className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                        isActive ? "text-gray-800" : "text-gray-300"
                      }`}>
                        {value.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 text-center mt-12 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {currentStatus?.description}
            </h3>
            
            {status === "ORDER_RECEIVED" && (
                <p className="text-gray-500">We are verifying your items. The kitchen will start shortly.</p>
            )}
            {status === "PREPARING" && (
                <p className="text-gray-500">Your food is being prepared with fresh ingredients.</p>
            )}
            {status === "OUT_FOR_DELIVERY" && (
                <p className="text-gray-500">Keep your phone nearby! The rider might call you.</p>
            )}
            {status === "DELIVERED" && (
                <p className="text-green-600 font-medium">Your Order has been Delivered</p>
            )}
          </div>
        </div>

        {status === "DELIVERED" ? (
             <div className="flex gap-4 justify-center">
                <Link
                    to="/"
                    className="flex items-center gap-2 bg-gray-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-900 transition-colors shadow-lg shadow-gray-200"
                >
                    Order Again <FiChevronRight />
                </Link>
             </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <span className="text-2xl">💬</span>
                    </div>
                    <div>
                        <p className="font-bold text-gray-800">Need Help?</p>
                        <p className="text-sm text-gray-500">Chat with support</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <span className="text-2xl">📞</span>
                    </div>
                    <div>
                        <p className="font-bold text-gray-800">Call Restaurant</p>
                        <p className="text-sm text-gray-500">Tap to call</p>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}

