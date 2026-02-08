import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import useCart from "../../features/cart/hooks/useCart";

export default function Navbar({
  showSearch = false,
  searchTerm = "",
  onSearchTermChange,
  searchPlaceholder = "Search for restaurant, cuisine or a dish",
}) {
  const location = useLocation();
  const { items } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-8">
          <Link to="/" className="flex items-center gap-1 shrink-0">
            <span className="text-3xl font-extrabold italic text-black">
              foodify
            </span>
          </Link>

          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-2xl relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400 text-xl" />
              </div>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchTermChange?.(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:shadow-lg transition-all outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          )}

          <div className="flex items-center gap-6 text-gray-700">
            <Link
              to="/orders"
              className={`flex items-center gap-2 transition-colors ${
                location.pathname === "/orders"
                  ? "text-orange-600"
                  : "hover:text-orange-500"
              }`}
            >
              <span className="text-2xl">📦</span>
              <span className="font-medium hidden sm:block">Orders</span>
            </Link>

            <Link
              to="/checkout"
              className={`flex items-center gap-2 transition-colors ${
                location.pathname === "/checkout"
                  ? "text-orange-600"
                  : "hover:text-orange-500"
              }`}
            >
              <div className="relative">
                <FiShoppingCart className="text-2xl" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="font-medium hidden sm:block">Cart</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
