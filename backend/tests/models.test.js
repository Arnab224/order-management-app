const mongoose = require("mongoose");
const MenuItem = require("../models/MenuItem");
const Order = require("../models/Order");

describe("Model Tests", () => {
  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/foodify_test_models"
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await MenuItem.deleteMany({});
    await Order.deleteMany({});
  });

  describe("MenuItem Model", () => {
    test("should create a valid menu item", async () => {
      const menuItemData = {
        name: "Test Burger",
        description: "A delicious test burger",
        price: 150,
        imageUrl: "https://example.com/burger.jpg",
      };

      const menuItem = await MenuItem.create(menuItemData);

      expect(menuItem).toHaveProperty("_id");
      expect(menuItem.name).toBe("Test Burger");
      expect(menuItem.description).toBe("A delicious test burger");
      expect(menuItem.price).toBe(150);
      expect(menuItem.imageUrl).toBe("https://example.com/burger.jpg");
    });

    test("should fail without required name field", async () => {
      const menuItemData = {
        description: "A test item",
        price: 100,
      };

      await expect(MenuItem.create(menuItemData)).rejects.toThrow();
    });

    test("should fail without required price field", async () => {
      const menuItemData = {
        name: "Test Item",
        description: "A test item",
      };

      await expect(MenuItem.create(menuItemData)).rejects.toThrow();
    });

    test("should allow optional description and imageUrl", async () => {
      const menuItemData = {
        name: "Basic Item",
        price: 50,
      };

      const menuItem = await MenuItem.create(menuItemData);

      expect(menuItem).toHaveProperty("_id");
      expect(menuItem.name).toBe("Basic Item");
      expect(menuItem.price).toBe(50);
    });
  });

  describe("Order Model", () => {
    let testMenuItem;

    beforeEach(async () => {
      testMenuItem = await MenuItem.create({
        name: "Test Burger",
        description: "Test description",
        price: 100,
      });
    });

    test("should create a valid order", async () => {
      const orderData = {
        items: [
          {
            menuItemId: testMenuItem._id,
            quantity: 2,
          },
        ],
        customerName: "John Doe",
        address: "123 Test Street",
        phone: "1234567890",
      };

      const order = await Order.create(orderData);

      expect(order).toHaveProperty("_id");
      expect(order.customerName).toBe("John Doe");
      expect(order.address).toBe("123 Test Street");
      expect(order.phone).toBe("1234567890");
      expect(order.status).toBe("ORDER_RECEIVED");
      expect(order.items).toHaveLength(1);
      expect(order).toHaveProperty("createdAt");
      expect(order).toHaveProperty("updatedAt");
    });

    test("should fail without required customerName", async () => {
      const orderData = {
        items: [
          {
            menuItemId: testMenuItem._id,
            quantity: 1,
          },
        ],
        address: "123 Test St",
        phone: "1234567890",
      };

      await expect(Order.create(orderData)).rejects.toThrow();
    });

    test("should fail without required address", async () => {
      const orderData = {
        items: [
          {
            menuItemId: testMenuItem._id,
            quantity: 1,
          },
        ],
        customerName: "John Doe",
        phone: "1234567890",
      };

      await expect(Order.create(orderData)).rejects.toThrow();
    });

    test("should fail without required phone", async () => {
      const orderData = {
        items: [
          {
            menuItemId: testMenuItem._id,
            quantity: 1,
          },
        ],
        customerName: "John Doe",
        address: "123 Test St",
      };

      await expect(Order.create(orderData)).rejects.toThrow();
    });

    test("should only allow valid status values", async () => {
      const orderData = {
        items: [
          {
            menuItemId: testMenuItem._id,
            quantity: 1,
          },
        ],
        customerName: "John Doe",
        address: "123 Test St",
        phone: "1234567890",
        status: "INVALID_STATUS",
      };

      await expect(Order.create(orderData)).rejects.toThrow();
    });

    test("should allow valid status values", async () => {
      const validStatuses = ["ORDER_RECEIVED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];

      for (const status of validStatuses) {
        const orderData = {
          items: [
            {
              menuItemId: testMenuItem._id,
              quantity: 1,
            },
          ],
          customerName: "John Doe",
          address: "123 Test St",
          phone: "1234567890",
          status,
        };

        const order = await Order.create(orderData);
        expect(order.status).toBe(status);
        await Order.deleteMany({});
      }
    });

    test("should handle multiple items in order", async () => {
      const secondMenuItem = await MenuItem.create({
        name: "Test Pizza",
        description: "Test pizza",
        price: 200,
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
        customerName: "Jane Smith",
        address: "456 Test Ave",
        phone: "9876543210",
      };

      const order = await Order.create(orderData);

      expect(order.items).toHaveLength(2);
      expect(order.items[0].quantity).toBe(2);
      expect(order.items[1].quantity).toBe(1);
    });
  });
});
