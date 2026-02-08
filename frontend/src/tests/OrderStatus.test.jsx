import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { act } from "react";
import { CartProvider } from "../features/cart/context/CartContext";
import * as orderApi from "../features/order/services/order.api";

vi.mock("../features/order/services/order.api");

vi.mock("../shared/services/socket", () => {
  const handlers = new Map();

  const socket = {
    on: vi.fn((event, cb) => {
      handlers.set(event, cb);
    }),
    off: vi.fn((event) => {
      handlers.delete(event);
    }),
    __emit: (event, data) => {
      const cb = handlers.get(event);
      if (cb) cb(data);
    },
  };

  return { socket };
});

import OrderStatus from "../features/order/components/OrderStatus";
import { socket } from "../shared/services/socket";

describe("OrderStatus Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading state initially", async () => {
  vi.spyOn(orderApi, "getOrderStatus").mockImplementation(
    () => new Promise(() => {}) 
  );

  render(
    <MemoryRouter initialEntries={["/order/abc123"]}>
      <CartProvider>
        <Routes>
          <Route path="/order/:id" element={<OrderStatus />} />
        </Routes>
      </CartProvider>
    </MemoryRouter>
  );

  expect(
  await screen.findByRole("status", { name: /loading/i })
).toBeInTheDocument();
});


  it("should update UI when socket emits a status change for the same order", async () => {
    const orderId = "64b2f4c3a1b2c3d4e5f6a7b8";

    vi.spyOn(orderApi, "getOrderStatus").mockResolvedValue({
      data: { status: "ORDER_RECEIVED" },
    });

    render(
      <MemoryRouter initialEntries={[`/order/${orderId}`]}>
        <CartProvider>
          <Routes>
            <Route path="/order/:id" element={<OrderStatus />} />
          </Routes>
        </CartProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/We are verifying your items/i)
      ).toBeInTheDocument();
    });

    act(() => {
      socket.__emit("order-status-update", {
        orderId,
        status: "PREPARING",
      });
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Your food is being prepared with fresh ingredients/i)
      ).toBeInTheDocument();
    });
  });

  it("should ignore socket updates for a different order id", async () => {
    const orderId = "64b2f4c3a1b2c3d4e5f6a7b8";

    vi.spyOn(orderApi, "getOrderStatus").mockResolvedValue({
      data: { status: "ORDER_RECEIVED" },
    });

    render(
      <MemoryRouter initialEntries={[`/order/${orderId}`]}>
        <CartProvider>
          <Routes>
            <Route path="/order/:id" element={<OrderStatus />} />
          </Routes>
        </CartProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/We are verifying your items/i)
      ).toBeInTheDocument();
    });

    act(() => {
      socket.__emit("order-status-update", {
        orderId: "some-other-id",
        status: "PREPARING",
      });
    });

    expect(
      screen.getByText(/We are verifying your items/i)
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/Your food is being prepared with fresh ingredients/i)
    ).not.toBeInTheDocument();
  });

  it("should unsubscribe from socket updates on unmount", async () => {
    const orderId = "64b2f4c3a1b2c3d4e5f6a7b8";

    vi.spyOn(orderApi, "getOrderStatus").mockResolvedValue({
      data: { status: "ORDER_RECEIVED" },
    });

    const { unmount } = render(
      <MemoryRouter initialEntries={[`/order/${orderId}`]}>
        <CartProvider>
          <Routes>
            <Route path="/order/:id" element={<OrderStatus />} />
          </Routes>
        </CartProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/We are verifying your items/i)
      ).toBeInTheDocument();
    });

    unmount();

    expect(socket.off).toHaveBeenCalledWith("order-status-update");
  });
});
