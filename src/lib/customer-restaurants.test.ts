import { describe, expect, it } from "vitest";
import {
  findRestaurants,
  getMenuItemsByRestaurantId,
  getRestaurantById,
  menuItems,
  restaurants,
} from "./customer-restaurants";

describe("customer restaurant search", () => {
  it("matches cuisine with surrounding whitespace and case differences", () => {
    expect(findRestaurants("  SUSHI  ", "recommended").map((item) => item.id)).toEqual(["maki-house"]);
  });
  it("matches restaurant names", () => {
    expect(findRestaurants("Bun & Done", "recommended").map((item) => item.id)).toEqual(["bun-and-done"]);
  });
  it("returns no results for an unknown restaurant", () => {
    expect(findRestaurants("unknown kitchen xyz", "recommended")).toEqual([]);
  });
  it("sorts by fastest delivery without changing the catalog", () => {
    expect(findRestaurants("", "fastest")[0]?.id).toBe("green-bowl");
    expect(restaurants[0]?.id).toBe("bun-and-done");
  });
  it("sorts highest rating first", () => {
    expect(findRestaurants("", "rating")[0]?.rating).toBe(4.9);
  });

  describe("Restaurant menu items catalog", () => {
    it("contains exactly 6 restaurants", () => {
      expect(restaurants).toHaveLength(6);
    });

    it("has at least 6 menu items for each of the 6 restaurants (at least 36 total)", () => {
      expect(menuItems.length).toBeGreaterThanOrEqual(36);

      for (const restaurant of restaurants) {
        const items = getMenuItemsByRestaurantId(restaurant.id);
        expect(items.length).toBeGreaterThanOrEqual(6);

        // Every item has valid attributes
        for (const item of items) {
          expect(item.id).toBeTruthy();
          expect(item.restaurantId).toBe(restaurant.id);
          expect(item.name).toBeTruthy();
          expect(item.price).toBeGreaterThan(0);
          expect(item.rating).toBeGreaterThanOrEqual(4.0);
          expect(item.rating).toBeLessThanOrEqual(5.0);
          expect(item.ingredients.length).toBeGreaterThan(10);
          expect(item.image).toBeTruthy();
        }
      }
    });

    it("finds restaurants by id correctly", () => {
      expect(getRestaurantById("pizza-social")?.name).toBe("Pizza Social");
      expect(getRestaurantById("bun-and-done")?.name).toBe("Bun & Done");
      expect(getRestaurantById("non-existent-id")).toBeUndefined();
    });
  });
});