const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const MenuItem = require("../models/MenuItem");

describe("Menu API Tests", () => {
  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/foodify_test_menu"
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await MenuItem.deleteMany({});
  });

  describe("GET /api/menu", () => {
    test("should return empty array when no menu items exist", async () => {
      const response = await request(app).get("/api/menu");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test("should return all menu items", async () => {
      const testItems = [
        {
          name: "Test Burger",
          description: "A test burger",
          price: 100,
          imageUrl: "test.jpg",
        },
        {
          name: "Test Pizza",
          description: "A test pizza",
          price: 200,
          imageUrl: "test2.jpg",
        },
      ];

      await MenuItem.insertMany(testItems);

      const response = await request(app).get("/api/menu");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty("name", "Test Burger");
      expect(response.body[1]).toHaveProperty("name", "Test Pizza");
    });

    test("should return menu items with correct structure", async () => {
      const testItem = {
        name: "Test Item",
        description: "Test description",
        price: 150,
        imageUrl: "test.jpg",
      };

      await MenuItem.create(testItem);

      const response = await request(app).get("/api/menu");

      expect(response.status).toBe(200);
      expect(response.body[0]).toHaveProperty("_id");
      expect(response.body[0]).toHaveProperty("name");
      expect(response.body[0]).toHaveProperty("description");
      expect(response.body[0]).toHaveProperty("price");
      expect(response.body[0]).toHaveProperty("imageUrl");
    });
  });
});
