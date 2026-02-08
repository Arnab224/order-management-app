import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MenuItemCard from "../features/menu/components/MenuItemCard";
import { CartProvider } from "../features/cart/context/CartContext";
import { ToastProvider } from "../shared/context/ToastContext";

describe("MenuItemCard Component", () => {
  const mockItem = {
    _id: "1",
    name: "Test Burger",
    description: "A delicious test burger",
    price: 299,
    imageUrl: "https://example.com/burger.jpg",
  };

  it("should render menu item details", () => {
    render(
      <ToastProvider>
        <CartProvider>
          <MenuItemCard item={mockItem} />
        </CartProvider>
      </ToastProvider>
    );

    expect(screen.getByText("Test Burger")).toBeInTheDocument();
    expect(screen.getByText("Test Burger")).toBeInTheDocument();
expect(screen.getByText("₹299")).toBeInTheDocument();
    expect(screen.getByText("₹299")).toBeInTheDocument();
  });

  it("should display item image", () => {
    render(
      <ToastProvider>
        <CartProvider>
          <MenuItemCard item={mockItem} />
        </CartProvider>
      </ToastProvider>
    );

    const image = screen.getByAltText("Test Burger");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", mockItem.imageUrl);
  });

  it("should use placeholder image when imageUrl is missing", () => {
    const itemWithoutImage = { ...mockItem, imageUrl: "" };

    render(
      <ToastProvider>
        <CartProvider>
          <MenuItemCard item={itemWithoutImage} />
        </CartProvider>
      </ToastProvider>
    );

    const image = screen.getByAltText("Test Burger");
    expect(image.getAttribute("src") || "").toMatch(/images\.unsplash\.com/i);
  });

  it("should have Add button", () => {
    render(
      <ToastProvider>
        <CartProvider>
          <MenuItemCard item={mockItem} />
        </CartProvider>
      </ToastProvider>
    );

    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  it("should add item to cart when Add button is clicked", () => {
    render(
      <ToastProvider>
        <CartProvider>
          <MenuItemCard item={mockItem} />
        </CartProvider>
      </ToastProvider>
    );

    const addButton = screen.getByRole("button", { name: /add/i });
    fireEvent.click(addButton);

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should render with correct styling classes", () => {
    const { container } = render(
      <ToastProvider>
        <CartProvider>
          <MenuItemCard item={mockItem} />
        </CartProvider>
      </ToastProvider>
    );

    const card = container.firstChild;
    expect(card).toHaveClass("bg-white", "rounded-2xl");
  });
});
