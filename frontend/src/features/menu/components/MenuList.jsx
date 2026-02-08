import { useState, useMemo } from "react";
import useMenu from "../hooks/useMenu";
import MenuItemCard from "./MenuItemCard";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import Navbar from "../../../shared/components/Navbar";
import { CATEGORY_IMAGES } from "../../../constants/categoryImages";
export default function MenuList() {
  const { menu = [], loading, error } = useMenu();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilters, setActiveFilters] = useState({
    veg: false,
    delivery: false,
    rating: false
  });
  const [sortBy, setSortBy] = useState("relevance");

  const categories = useMemo(() => {
    // Generate some "Inspiration" categories manually or from data
    // For now distinct from data
    const unique = ["all", ...new Set(menu.map(item => item.category))];
    return unique.filter(c => c);
  }, [menu]);

  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (activeCategory !== "all" && item.category !== activeCategory) return false;
      if (activeFilters.veg && !item.isVegetarian) return false;
      if (activeFilters.delivery && (item.deliveryTime > 30)) return false;
      if (activeFilters.rating && (item.rating < 4.0)) return false;
      return true;
    }).sort((a, b) => {
        if (sortBy === "price_low") return a.price - b.price;
        if (sortBy === "price_high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0; // relevance
    });
  }, [menu, searchTerm, activeCategory, activeFilters, sortBy]);

  const toggleFilter = (key) => {
    setActiveFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar showSearch searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />

      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 lg:px-8">
         <div className="md:hidden mb-8">
             <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text"
                    placeholder="Search for food..."
                    className="w-full p-3 pl-10 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-orange-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
         </div>

        {!searchTerm && (
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">Inspiration for your first order</h2>
                <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {categories.map((cat, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => setActiveCategory(activeCategory === cat ? 'all' : cat)}
                            className="flex flex-col items-center gap-3 cursor-pointer shrink-0 snap-start group"
                        >
                            <div className={`w-36 h-36 rounded-full overflow-hidden border-2 transition-all p-1 ${activeCategory === cat ? 'border-orange-500' : 'border-transparent group-hover:border-gray-200'}`}>
                                <img 
                                    src={CATEGORY_IMAGES?.[cat] || CATEGORY_IMAGES?.[String(cat).toLowerCase()] || CATEGORY_IMAGES?.all}
                                    onError={(e) => {
                                      e.currentTarget.src = CATEGORY_IMAGES?.all;
                                    }}
                                    alt={cat}
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                            <span className={`text-lg font-medium capitalize ${activeCategory === cat ? 'text-orange-600' : 'text-gray-600'}`}>
                                {cat}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <div className="sticky top-20 z-40 bg-white pb-6 pt-2">
            <div className="flex flex-wrap items-center gap-3">
                 <button 
                  onClick={() => toggleFilter('veg')}
                  className={`border px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilters.veg ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                 >
                     Pure Veg
                 </button>

                 <button 
                  onClick={() => toggleFilter('delivery')}
                  className={`border px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilters.delivery ? 'bg-orange-50 border-orange-500 text-orange-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                 >
                     Fast Delivery
                 </button>

                 <button 
                  onClick={() => toggleFilter('rating')}
                  className={`border px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilters.rating ? 'bg-yellow-50 border-yellow-500 text-yellow-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                 >
                     Rated 4.0+
                 </button>

                 <div className="ml-auto hidden sm:flex items-center gap-2">
                     <span className="text-gray-400 text-sm">Sort by</span>
                     <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-transparent text-gray-700 font-semibold text-sm outline-none cursor-pointer"
                     >
                         <option value="relevance">Relevance</option>
                         <option value="rating">Rating</option>
                         <option value="price_low">Cost: Low to High</option>
                         <option value="price_high">Cost: High to Low</option>
                     </select>
                     <FiChevronDown className="text-gray-600" />
                 </div>
            </div>
        </div>

        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {activeCategory !== 'all' ? `${activeCategory} Delivery in Your City` : 'Best Food in Your City'}
            </h2>

            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {[1,2,3,4,5,6,7,8].map(n => (
                        <div key={n} className="animate-pulse">
                            <div className="bg-gray-200 h-48 rounded-2xl mb-4" />
                            <div className="bg-gray-200 h-6 w-3/4 rounded mb-2" />
                            <div className="bg-gray-200 h-4 w-1/2 rounded" />
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div className="text-center py-20 text-red-500">
                    <p className="text-xl">{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 underline">Try Again</button>
                </div>
            )}

            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10">
                    {filteredMenu.map(item => (
                        <MenuItemCard key={item._id} item={item} />
                    ))}
                </div>
            )}
            
              {!loading && !error && filteredMenu.length === 0 && (
                 <div className="text-center py-20 bg-gray-50 rounded-xl">
                      <p className="text-2xl text-gray-400 font-bold mb-2">No items found</p>
                      <p className="text-gray-500">Try changing your filters or search term</p>
                 </div>
            )}
        </div>
      </div>
    </div>
  );
}
