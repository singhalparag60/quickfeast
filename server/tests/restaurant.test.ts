import { describe, it, expect, vi, beforeEach } from "vitest";
import { Restaurant } from "../models/Restaurant.ts";
import { seedRestaurants } from "../data/restaurants.seed-data.ts";
import { seedRestaurantsData } from "../seeds/seed-restaurants.ts";
import { restaurantRouter } from "../routes/restaurant.routes.ts";

describe("Restaurant Model & Schema Validation", () => {
  it("creates a valid restaurant document instance without database connection", async () => {
    const doc = new Restaurant({
      restaurantId: "test-cafe",
      name: "Test Cafe",
      cuisine: "Cafe · Desserts",
      rating: 4.8,
      deliveryMinutes: 15,
      image: "/assets/test.jpg",
      imageAlt: "Test cafe image",
      menuItems: [
        {
          itemId: "coffee-1",
          name: "Espresso",
          price: 120,
          rating: 4.9,
          ingredients: "Roasted beans, steamed water",
          image: "/assets/coffee.jpg",
        },
      ],
    });

    const error = await doc.validate().catch((err) => err);
    expect(error).toBeUndefined();
    expect(doc.restaurantId).toBe("test-cafe");
    expect(doc.menuItems).toHaveLength(1);
    expect(doc.menuItems[0]?.price).toBe(120);
  });

  it("fails validation when required fields are missing", async () => {
    const invalidDoc = new Restaurant({
      name: "Missing ID Cafe",
    });

    const error = await invalidDoc.validate().catch((err) => err);
    expect(error).toBeDefined();
    expect(error?.errors["restaurantId"]).toBeDefined();
    expect(error?.errors["cuisine"]).toBeDefined();
    expect(error?.errors["image"]).toBeDefined();
  });

  it("fails validation when rating is out of 0-5 bounds", async () => {
    const doc = new Restaurant({
      restaurantId: "invalid-rating",
      name: "Bad Rating",
      cuisine: "Fast Food",
      rating: 7.5,
      deliveryMinutes: 10,
      image: "/img.jpg",
      imageAlt: "Alt",
    });

    const error = await doc.validate().catch((err) => err);
    expect(error).toBeDefined();
    expect(error?.errors["rating"]).toBeDefined();
  });

  it("fails validation when menu item price is negative", async () => {
    const doc = new Restaurant({
      restaurantId: "neg-price",
      name: "Free Food",
      cuisine: "Free",
      deliveryMinutes: 10,
      image: "/img.jpg",
      imageAlt: "Alt",
      menuItems: [
        {
          itemId: "free-item",
          name: "Free Burger",
          price: -50,
          rating: 4,
          ingredients: "None",
          image: "/item.jpg",
        },
      ],
    });

    const error = await doc.validate().catch((err) => err);
    expect(error).toBeDefined();
    expect(error?.errors["menuItems.0.price"]).toBeDefined();
  });
});

describe("Seed Data Structure", () => {
  it("contains exactly 6 restaurants with 6 menu items each (36 total items)", () => {
    expect(seedRestaurants).toHaveLength(6);

    for (const r of seedRestaurants) {
      expect(r.restaurantId).toBeTruthy();
      expect(r.name).toBeTruthy();
      expect(r.cuisine).toBeTruthy();
      expect(r.menuItems).toHaveLength(6);
      for (const item of r.menuItems) {
        expect(item.itemId).toBeTruthy();
        expect(item.price).toBeGreaterThan(0);
        expect(item.rating).toBeGreaterThanOrEqual(0);
        expect(item.rating).toBeLessThanOrEqual(5);
      }
    }
  });

  it("safely generates bulk operations and calls bulkWrite on the model", async () => {
    const bulkWriteSpy = vi.spyOn(Restaurant, "bulkWrite").mockResolvedValueOnce({
      upsertedCount: 6,
      matchedCount: 0,
      modifiedCount: 0,
    } as any);

    const countSpy = vi.spyOn(Restaurant, "countDocuments").mockResolvedValueOnce(6 as any);

    const result = await seedRestaurantsData(seedRestaurants);

    expect(bulkWriteSpy).toHaveBeenCalledTimes(1);
    expect(result.upsertedCount).toBe(6);
    expect(result.total).toBe(6);

    bulkWriteSpy.mockRestore();
    countSpy.mockRestore();
  });
});

describe("Restaurant Router Endpoints", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // Helper to invoke routes registered in restaurantRouter
  function getRouteHandler(path: string, method: "get" | "post" = "get") {
    // In express 5, router.stack contains route objects
    const layer = (restaurantRouter.stack as any[]).find(
      (layer: any) => layer.route && layer.route.path === path && layer.route.methods[method]
    );
    if (!layer) {
      throw new Error(`Route handler not found for ${method.toUpperCase()} ${path}`);
    }
    return layer.route.stack[0].handle;
  }

  it("handles GET /api/restaurants successfully without external network dependency", async () => {
    const mockRestaurants = [
      {
        restaurantId: "bun-and-done",
        name: "Bun & Done",
        cuisine: "Burgers",
        rating: 4.8,
        deliveryMinutes: 20,
        menuItems: [],
      },
    ];

    const mockQuery = {
      select: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(mockRestaurants),
    };

    vi.spyOn(Restaurant, "find").mockReturnValue(mockQuery as any);

    const handler = getRouteHandler("/");

    let statusCode = 0;
    let responseBody: any = null;

    const req = { query: {} } as any;
    const res = {
      status: (code: number) => {
        statusCode = code;
        return {
          json: (body: any) => {
            responseBody = body;
          },
        };
      },
    } as any;

    await handler(req, res);

    expect(statusCode).toBe(200);
    expect(responseBody.success).toBe(true);
    expect(responseBody.count).toBe(1);
    expect(responseBody.data[0].name).toBe("Bun & Done");
  });

  it("returns 404 for non-existent restaurant on GET /api/restaurants/:id", async () => {
    const mockQuery = {
      select: vi.fn().mockResolvedValue(null),
      exec: vi.fn().mockResolvedValue(null),
    };

    vi.spyOn(Restaurant, "findOne").mockReturnValue(mockQuery as any);

    const handler = getRouteHandler("/:id");

    const req = { params: { id: "non-existent" } } as any;
    let statusCode = 0;
    let responseBody: any = null;
    const res: any = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(body: any) {
        responseBody = body;
        return this;
      },
    };

    await handler(req, res);

    expect(statusCode).toBe(404);
    expect(responseBody.success).toBe(false);
    expect(responseBody.message).toContain("non-existent");
  });

  it("handles search queries on GET /api/restaurants", async () => {
    const mockQuery = {
      select: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    };

    const findSpy = vi.spyOn(Restaurant, "find").mockReturnValue(mockQuery as any);

    const handler = getRouteHandler("/");

    const req = { query: { search: "pizza" } } as any;
    const res = {
      status: () => ({ json: () => {} }),
    } as any;

    await handler(req, res);

    expect(findSpy).toHaveBeenCalledWith({
      $or: [
        { name: { $regex: "pizza", $options: "i" } },
        { cuisine: { $regex: "pizza", $options: "i" } },
      ],
    });
  });
});
