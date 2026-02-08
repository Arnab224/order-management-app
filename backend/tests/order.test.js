const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");

describe("Order API Tests", () => {
  let testMenuItem;

  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/foodify_test_orders"
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Order.deleteMany({});
    await MenuItem.deleteMany({});

    testMenuItem = await MenuItem.create({
      name: "Test Burger",
      description: "A test burger",
      price: 100,
      imageUrl: "test.jpg",
    });
  });

  describe("POST /api/orders", () => {
    test("should create a new order with valid data", async () => {
      const orderData = {
        items: [
          {
            menuItemId: testMenuItem._id,
            quantity: 2,
          },
        ],
        customerName: "John Doe",
        address: "123 Test St",
        phone: "1234567890",
      };

      const response = await request(app)
        .post("/api/orders")
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("_id");
      expect(response.body).toHaveProperty("customerName", "John Doe");
      expect(response.body).toHaveProperty("address", "123 Test St");
      expect(response.body).toHaveProperty("phone", "1234567890");
      expect(response.body).toHaveProperty("status", "ORDER_RECEIVED");
      expect(response.body.items).toHaveLength(1);
    });

    test("should fail to create order without required fields", async () => {
      const invalidOrderData = {
        items: [],
      };

      const response = await request(app)
        .post("/api/orders")
        .send(invalidOrderData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });

    test("should fail to create order with empty items even if customer info present", async () => {
      const invalidOrderData = {
        items: [],
        customerName: "John Doe",
        address: "123 Test St",
        phone: "1234567890",
      };

      const response = await request(app)
        .post("/api/orders")
        .send(invalidOrderData);

      expect(response.status).toBe(400);
      expect(response.body.errors.items).toMatch(/at least one item/i);

    });

    test("should create order with correct initial status", async () => {
      const orderData = {
        items: [
          {
            menuItemId: testMenuItem._id,
            quantity: 1,
          },
        ],
        customerName: "Jane Smith",
        address: "456 Test Ave",
        phone: "9876543210",
      };

      const response = await request(app)
        .post("/api/orders")
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("ORDER_RECEIVED");
    });

    test("should handle multiple items in order", async () => {
      const secondMenuItem = await MenuItem.create({
        name: "Test Pizza",
        description: "A test pizza",
        price: 200,
        imageUrl: "test2.jpg",
      });

      const orderData = {
        items: [
          {
            menuItemId: testMenuItem._id,
            quantity: 2,
          },
          {
            menuItemId: secondMenuItem._id,
            quantity: 1,
          },
        ],
        customerName: "Bob Johnson",
        address: "789 Test Blvd",
        phone: "5555555555",
      };

      const response = await request(app)
        .post("/api/orders")
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body.items).toHaveLength(2);
      expect(response.body.items[0].quantity).toBe(2);
      expect(response.body.items[1].quantity).toBe(1);
    });
  });

  describe("GET /api/orders/:id", () => {
    test("should get order status by id", async () => {
      const order = await Order.create({
        items: [
          {
            menuItemId: testMenuItem._id,
            quantity: 1,
          },
        ],
        customerName: "Test User",
        address: "Test Address",
        phone: "1234567890",
        status: "PREPARING",
      });

      const response = await request(app).get(`/api/orders/${order._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "PREPARING");
    });

    test("should return 404 for non-existent order", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/orders/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Order not found");
    });

    test("should return 400 for invalid order id format", async () => {
      const response = await request(app).get("/api/orders/invalid-id");

      expect(response.status).toBe(400);
    });

    test("should reflect status updates", async () => {
      const order = await Order.create({
        items: [
          {
            menuItemId: testMenuItem._id,
            quantity: 1,
          },
        ],
        customerName: "Test User",
        address: "Test Address",
        phone: "1234567890",
        status: "ORDER_RECEIVED",
      });

      await Order.findByIdAndUpdate(order._id, { status: "OUT_FOR_DELIVERY" });

      const response = await request(app).get(`/api/orders/${order._id}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("OUT_FOR_DELIVERY");
    });
  });

  describe("GET /api/orders/history/all", () => {
    test("should return all orders sorted by most recent first", async () => {
      const older = await Order.create({
        items: [{ menuItemId: testMenuItem._id, quantity: 1 }],
        customerName: "Older",
        address: "A",
        phone: "111",
      });

      const newer = await Order.create({
        items: [{ menuItemId: testMenuItem._id, quantity: 1 }],
        customerName: "Newer",
        address: "B",
        phone: "222",
      });

      const response = await request(app).get("/api/orders/history/all");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]._id).toBe(newer._id.toString());
      expect(response.body[1]._id).toBe(older._id.toString());
    });
  });

  describe("PATCH /api/orders/:id/status", () => {
    test("should update order status when valid", async () => {
      const order = await Order.create({
        items: [{ menuItemId: testMenuItem._id, quantity: 1 }],
        customerName: "Test User",
        address: "Test Address",
        phone: "1234567890",
        status: "ORDER_RECEIVED",
      });

      const response = await request(app)
        .patch(`/api/orders/${order._id}/status`)
        .send({ status: "PREPARING" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "PREPARING");
    });

    test("should reject invalid status", async () => {
      const order = await Order.create({
        items: [{ menuItemId: testMenuItem._id, quantity: 1 }],
        customerName: "Test User",
        address: "Test Address",
        phone: "1234567890",
      });

      const response = await request(app)
        .patch(`/api/orders/${order._id}/status`)
        .send({ status: "NOT_A_REAL_STATUS" });

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/invalid status/i);
    });
  });

  describe("PATCH /api/orders/:id/cancel", () => {
    test("should cancel a non-delivered order", async () => {
      const order = await Order.create({
        items: [{ menuItemId: testMenuItem._id, quantity: 1 }],
        customerName: "Test User",
        address: "Test Address",
        phone: "1234567890",
        status: "PREPARING",
      });

      const response = await request(app).patch(`/api/orders/${order._id}/cancel`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "CANCELLED");
    });

    test("should not cancel a delivered order", async () => {
      const order = await Order.create({
        items: [{ menuItemId: testMenuItem._id, quantity: 1 }],
        customerName: "Test User",
        address: "Test Address",
        phone: "1234567890",
        status: "DELIVERED",
      });

      const response = await request(app).patch(`/api/orders/${order._id}/cancel`);
      expect(response.status).toBe(409);
      expect(response.body.message).toMatch(/cannot cancel/i);
    });
  });

  describe("DELETE /api/orders/:id", () => {
    test("should delete an order", async () => {
      const order = await Order.create({
        items: [{ menuItemId: testMenuItem._id, quantity: 1 }],
        customerName: "Test User",
        address: "Test Address",
        phone: "1234567890",
      });

      const response = await request(app).delete(`/api/orders/${order._id}`);
      expect(response.status).toBe(204);

      const found = await Order.findById(order._id);
      expect(found).toBeNull();
    });
  });
});
