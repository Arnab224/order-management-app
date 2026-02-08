import useCart from "../../cart/hooks/useCart";
import { useToast } from "../../../shared/context/ToastContext";
import { FiStar, FiPlus, FiMinus } from "react-icons/fi";

export default function MenuItemCard({ item }) {
  const { addItem, updateQuantity, items, removeItem } = useCart();
  const { addToast } = useToast();
  
  const cartItem = items.find(i => i.menuItemId === item._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    addItem({
      menuItemId: item._id,
      name: item.name,
      price: item.price,
      quantity: 1,
      imageUrl: item.imageUrl
    });
    addToast(`${item.name} added`, "success");
  };

  const handleIncrement = () => {
    updateQuantity(item._id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity === 1) {
      removeItem(item._id);
    } else {
      updateQuantity(item._id, quantity - 1);
    }
  };

  return (
    <div className="group bg-white rounded-2xl p-4 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 h-full flex flex-col">
      <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-4 bg-gray-50">
        <img
          src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop"}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {item.discount && (
          <div className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-br-xl uppercase tracking-wider">
            {item.discount}% OFF
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-2">
                <div className={`w-4 h-4 border flex items-center justify-center p-0.5 ${item.isVegetarian ? 'border-green-600' : 'border-red-600'}`}>
                    <div className={`w-full h-full rounded-full ${item.isVegetarian ? 'bg-green-600' : 'bg-red-600'}`} />
                </div>
                {item.isBestSeller && (
                    <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-1 py-0.5 rounded">
                        BESTSELLER
                    </span>
                )}
            </div>
            <div className="flex items-center gap-1 bg-green-700 text-white text-xs font-bold px-1.5 py-0.5 rounded shadow-sm">
                <span>{item.rating || "4.2"}</span>
                <FiStar className="text-[10px] fill-white" />
            </div>
        </div>

        <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1 group-hover:text-orange-600 transition-colors">
            {item.name}
        </h3>

        <div className="flex items-center text-sm text-gray-500 mb-2">
           <span className="truncate">{item.category}</span>
           <span className="mx-1">•</span>
           <span>{item.deliveryTime || "30-40"} min</span>
        </div>

        <div className="mt-auto pt-3 border-t border-dashed border-gray-200 flex items-center justify-between">
            <div className="font-bold text-gray-800">
                ₹{item.price}
            </div>

            {quantity === 0 ? (
                <button
                    onClick={handleAdd}
                    className="relative px-8 py-2 bg-white text-green-600 font-bold uppercase text-sm border border-gray-300 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
                >
                    ADD
                    
                </button>
            ) : (
                <div className="flex items-center bg-green-600 text-white rounded-lg px-2 py-1.5 shadow-md min-w-[90px] justify-between">
                    <button onClick={handleDecrement} className="p-1 hover:bg-green-700 rounded transition-colors">
                        <FiMinus />
                    </button>
                    <span className="font-bold text-sm w-4 text-center">{quantity}</span>
                    <button onClick={handleIncrement} className="p-1 hover:bg-green-700 rounded transition-colors">
                        <FiPlus />
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
