import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartProvider, useCart } from "../features/cart/context/CartContext";

function TestComponent() {
  const { items, addItem, removeItem, clearCart } = useCart();

  return (
    <div>
      <div>Items: {items.length}</div>
      <button
        onClick={() =>
          addItem({
            menuItemId: "1",
            name: "Test Item",
            price: 100,
            quantity: 1,
          })
        }
      >
        Add Item
      </button>
      <button onClick={() => removeItem("1")}>Remove Item</button>
      <button onClick={clearCart}>Clear Cart</button>
      {items.map((item) => (
        <div key={item.menuItemId}>
          {item.name} - Qty: {item.quantity}
        </div>
      ))}
    </div>
  );
}

describe("CartContext", () => {
  it("should start with empty cart", () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByText("Items: 0")).toBeInTheDocument();
  });

  it("should add item to cart", () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton = screen.getByText("Add Item");
    fireEvent.click(addButton);

    expect(screen.getByText("Items: 1")).toBeInTheDocument();
    expect(screen.getByText(/Test Item - Qty: 1/)).toBeInTheDocument();
  });

  it("should increase quantity when adding same item", () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton = screen.getByText("Add Item");
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    expect(screen.getByText("Items: 1")).toBeInTheDocument();
    expect(screen.getByText(/Test Item - Qty: 2/)).toBeInTheDocument();
  });

  it("should remove item from cart", () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton = screen.getByText("Add Item");
    const removeButton = screen.getByText("Remove Item");

    fireEvent.click(addButton);
    expect(screen.getByText("Items: 1")).toBeInTheDocument();

    fireEvent.click(removeButton);
    expect(screen.getByText("Items: 0")).toBeInTheDocument();
  });

  it("should clear entire cart", () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton = screen.getByText("Add Item");
    const clearButton = screen.getByText("Clear Cart");

    fireEvent.click(addButton);
    fireEvent.click(addButton);
    expect(screen.getByText("Items: 1")).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(screen.getByText("Items: 0")).toBeInTheDocument();
  });
});
