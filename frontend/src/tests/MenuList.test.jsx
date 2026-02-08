import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MenuList from "../features/menu/components/MenuList";
import { CartProvider } from "../features/cart/context/CartContext";
import * as menuApi from "../features/menu/services/menu.api";
import { ToastProvider } from "../shared/context/ToastContext";

vi.mock("../features/menu/services/menu.api");

describe("MenuList Component", () => {
  const mockMenuData = [
    {
      _id: "1",
      name: "Test Burger",
      description: "A test burger",
      price: 100,
      imageUrl: "test.jpg",
    },
    {
      _id: "2",
      name: "Test Pizza",
      description: "A test pizza",
      price: 200,
      imageUrl: "test2.jpg",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading state initially", () => {
    vi.spyOn(menuApi, "fetchMenu").mockImplementation(
      () => new Promise(() => {}) 
    );

    render(
      <BrowserRouter>
        <ToastProvider>
          <CartProvider>
            <MenuList />
          </CartProvider>
        </ToastProvider>
      </BrowserRouter>
    );

    expect(
  document.querySelectorAll(".animate-pulse").length
).toBeGreaterThan(0);
  });

  it("should render menu items after loading", async () => {
    vi.spyOn(menuApi, "fetchMenu").mockResolvedValue({
      data: mockMenuData,
    });

    render(
      <BrowserRouter>
        <ToastProvider>
          <CartProvider>
            <MenuList />
          </CartProvider>
        </ToastProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Burger")).toBeInTheDocument();
      expect(screen.getByText("Test Pizza")).toBeInTheDocument();
    });
  });

  it("should display error message on fetch failure", async () => {
    vi.spyOn(menuApi, "fetchMenu").mockRejectedValue(
      new Error("Failed to load menu")
    );

    render(
      <BrowserRouter>
        <ToastProvider>
          <CartProvider>
            <MenuList />
          </CartProvider>
        </ToastProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load menu/i)).toBeInTheDocument();
    });
  });

  it("should display empty state when no menu items", async () => {
    vi.spyOn(menuApi, "fetchMenu").mockResolvedValue({
      data: [],
    });

    render(
      <BrowserRouter>
        <ToastProvider>
          <CartProvider>
            <MenuList />
          </CartProvider>
        </ToastProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No items found/i)).toBeInTheDocument();
    });
  });

  it("should display cart count", async () => {
    vi.spyOn(menuApi, "fetchMenu").mockResolvedValue({
      data: mockMenuData,
    });

    render(
      <BrowserRouter>
        <ToastProvider>
          <CartProvider>
            <MenuList />
          </CartProvider>
        </ToastProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/^Cart$/i)).toBeInTheDocument();
    });
  });

  it("should render all menu items in grid", async () => {
    vi.spyOn(menuApi, "fetchMenu").mockResolvedValue({
      data: mockMenuData,
    });

    render(
      <BrowserRouter>
        <ToastProvider>
          <CartProvider>
            <MenuList />
          </CartProvider>
        </ToastProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByAltText("Test Burger")).toBeInTheDocument();
      expect(screen.getByAltText("Test Pizza")).toBeInTheDocument();
    });
  });
});
