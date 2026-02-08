import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "../features/cart/context/CartContext";
import OrderHistory from "../features/order/components/OrderHistory";
import * as orderApi from "../features/order/services/order.api";

vi.mock("../features/order/services/order.api");

describe("OrderHistory Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading state initially", () => {
    vi.spyOn(orderApi, "getAllOrders").mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <BrowserRouter>
        <CartProvider>
          <OrderHistory />
        </CartProvider>
      </BrowserRouter>
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should render empty state when there are no orders", async () => {
    vi.spyOn(orderApi, "getAllOrders").mockResolvedValue({ data: [] });

    render(
      <BrowserRouter>
        <CartProvider>
          <OrderHistory />
        </CartProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No orders yet/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Browse Menu/i })).toBeInTheDocument();
    });
  });

  it("should render a list of orders", async () => {
    vi.spyOn(orderApi, "getAllOrders").mockResolvedValue({
      data: [
        {
          _id: "64b2f4c3a1b2c3d4e5f6a7b8",
          status: "PREPARING",
          customerName: "John Doe",
          address: "123 Test Street",
          phone: "1234567890",
          createdAt: "2025-01-01T10:00:00.000Z",
          items: [{ menuItemId: "abc", quantity: 1 }],
        },
      ],
    });

    render(
      <BrowserRouter>
        <CartProvider>
          <OrderHistory />
        </CartProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Order History/i)).toBeInTheDocument();
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/123 Test Street/i)).toBeInTheDocument();
      expect(screen.getByText(/1 item ordered/i)).toBeInTheDocument();
    });
  });

  it("should show an error message if API fails", async () => {
    vi.spyOn(orderApi, "getAllOrders").mockRejectedValue(new Error("boom"));

    render(
      <BrowserRouter>
        <CartProvider>
          <OrderHistory />
        </CartProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load order history/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Back to Menu/i })).toBeInTheDocument();
    });
  });
});
