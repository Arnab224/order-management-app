import { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

const initialState = { items: [] };

function reducer(state, action) {
  switch (action.type) {
    case "ADD":
      const existing = state.items.find(
        i => i.menuItemId === action.payload.menuItemId
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.menuItemId === action.payload.menuItemId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };

    case "REMOVE":
      return {
        ...state,
        items: state.items.filter(i => i.menuItemId !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map(i =>
          i.menuItemId === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };

    case "CLEAR":
      return initialState;

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem: item => dispatch({ type: "ADD", payload: item }),
        removeItem: id => dispatch({ type: "REMOVE", payload: id }),
        updateQuantity: (id, quantity) => dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } }),
        clearCart: () => dispatch({ type: "CLEAR" }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
