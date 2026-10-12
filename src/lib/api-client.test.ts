import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fetchRestaurants,
  fetchRestaurantById,
  normalizeRestaurant,
  normalizeMenuItem,
  API_BASE_URL,
} from "./api-client";

describe("Frontend API Client", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("normalizes backend restaurant document to frontend interface", () => {
    const raw = {
      restaurantId: "test-spot",
      name: "Test Spot",
      cuisine: "Bistro",
      rating: 4.8,
      deliveryMinutes: 20,
      image: "/assets/test.jpg",
      imageAlt: "Test image",
      highlight: "Staff Pick",
      description: "Cozy bistro",
    };

    const normalized = normalizeRestaurant(raw);
    expect(normalized.id).toBe("test-spot");
    expect(normalized.name).toBe("Test Spot");
    expect(normalized.highlight).toBe("Staff Pick");
    expect(normalized.description).toBe("Cozy bistro");
  });

  it("normalizes backend menu item to frontend MenuItem interface", () => {
    const raw = {
      itemId: "dish-1",
      name: "Croissant",
      price: 150,
      rating: 4.9,
      ingredients: "Butter, flour",
      image: "/assets/croissant.jpg",
      category: "Bakery",
    };

    const normalized = normalizeMenuItem(raw, "test-spot");
    expect(normalized.id).toBe("dish-1");
    expect(normalized.restaurantId).toBe("test-spot");
    expect(normalized.name).toBe("Croissant");
    expect(normalized.category).toBe("Bakery");
  });

  it("fetchRestaurants fetches and maps restaurants from /api/restaurants", async () => {
    const mockData = [
      {
        restaurantId: "bun-and-done",
        name: "Bun & Done",
        cuisine: "Burgers",
        rating: 4.8,
        deliveryMinutes: 20,
        image: "/assets/burger.jpg",
        imageAlt: "Burger",
      },
    ];

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        count: 1,
        data: mockData,
      }),
    });

    const result = await fetchRestaurants({ sort: "rating", search: "burger" });

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/restaurants?sort=rating&search=burger`,
      { headers: { Accept: "application/json" } }
    );
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("bun-and-done");
  });

  it("fetchRestaurants throws friendly error on HTTP failure", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({
        success: false,
        message: "Database connection temporarily unavailable",
      }),
    });

    await expect(fetchRestaurants()).rejects.toThrow(
      "Database connection temporarily unavailable"
    );
  });

  it("fetchRestaurantById fetches and returns restaurant and normalized menu items", async () => {
    const mockData = {
      restaurantId: "pizza-social",
      name: "Pizza Social",
      cuisine: "Pizza",
      rating: 4.7,
      deliveryMinutes: 25,
      image: "/assets/pizza.jpg",
      imageAlt: "Pizza",
      menuItems: [
        {
          itemId: "ps-margherita",
          name: "Margherita Pizza",
          price: 299,
          rating: 4.8,
          ingredients: "Tomatoes, cheese",
          image: "/assets/pizza.jpg",
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockData,
      }),
    });

    const result = await fetchRestaurantById("pizza-social");

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/restaurants/pizza-social`,
      { headers: { Accept: "application/json" } }
    );
    expect(result.restaurant.id).toBe("pizza-social");
    expect(result.menuItems).toHaveLength(1);
    expect(result.menuItems[0]?.id).toBe("ps-margherita");
  });

  it("fetchRestaurantById throws when restaurant is not found (404)", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({
        success: false,
        message: "Restaurant with ID 'ghost' not found",
      }),
    });

    await expect(fetchRestaurantById("ghost")).rejects.toThrow(
      "Restaurant with ID 'ghost' not found"
    );
  });
});
