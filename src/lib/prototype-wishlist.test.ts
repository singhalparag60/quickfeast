import { beforeEach, describe, expect, it } from "vitest";
import {
  addToWishlist,
  clearWishlist,
  getWishlist,
  isItemInWishlist,
  removeFromWishlist,
  toggleWishlist,
} from "./prototype-wishlist";

describe("Prototype Wishlist Layer", () => {
  const customerId = "test-customer-123";

  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with empty wishlist", () => {
    expect(getWishlist(customerId)).toEqual([]);
    expect(isItemInWishlist("bd-classic-cheeseburger", customerId)).toBe(false);
  });

  it("adds food item to wishlist with auto-populated details", () => {
    const items = addToWishlist(
      {
        foodItemId: "bd-classic-cheeseburger",
      },
      customerId
    );

    expect(items).toHaveLength(1);
    expect(items[0]?.foodItemId).toBe("bd-classic-cheeseburger");
    expect(items[0]?.name).toBe("Classic Cheeseburger");
    expect(items[0]?.restaurantName).toBe("Bun & Done");
    expect(items[0]?.price).toBe(249);
    expect(isItemInWishlist("bd-classic-cheeseburger", customerId)).toBe(true);
  });

  it("does not duplicate already wishlisted item", () => {
    addToWishlist({ foodItemId: "bd-classic-cheeseburger" }, customerId);
    addToWishlist({ foodItemId: "bd-classic-cheeseburger" }, customerId);
    expect(getWishlist(customerId)).toHaveLength(1);
  });

  it("removes food item from wishlist", () => {
    addToWishlist({ foodItemId: "bd-classic-cheeseburger" }, customerId);
    addToWishlist({ foodItemId: "ps-margherita" }, customerId);
    expect(getWishlist(customerId)).toHaveLength(2);

    const updated = removeFromWishlist("bd-classic-cheeseburger", customerId);
    expect(updated).toHaveLength(1);
    expect(updated[0]?.foodItemId).toBe("ps-margherita");
    expect(isItemInWishlist("bd-classic-cheeseburger", customerId)).toBe(false);
  });

  it("toggles wishlist state on/off accurately", () => {
    const res1 = toggleWishlist({ foodItemId: "ps-margherita" }, customerId);
    expect(res1.isWishlisted).toBe(true);
    expect(res1.items).toHaveLength(1);

    const res2 = toggleWishlist({ foodItemId: "ps-margherita" }, customerId);
    expect(res2.isWishlisted).toBe(false);
    expect(res2.items).toHaveLength(0);
  });

  it("clears all wishlist items for a customer", () => {
    addToWishlist({ foodItemId: "bd-classic-cheeseburger" }, customerId);
    addToWishlist({ foodItemId: "ps-margherita" }, customerId);
    expect(getWishlist(customerId)).toHaveLength(2);

    clearWishlist(customerId);
    expect(getWishlist(customerId)).toHaveLength(0);
  });

  it("isolates wishlist by customerId", () => {
    addToWishlist({ foodItemId: "bd-classic-cheeseburger" }, "customer-1");
    addToWishlist({ foodItemId: "ps-margherita" }, "customer-2");

    const list1 = getWishlist("customer-1");
    const list2 = getWishlist("customer-2");

    expect(list1).toHaveLength(1);
    expect(list1[0]?.foodItemId).toBe("bd-classic-cheeseburger");

    expect(list2).toHaveLength(1);
    expect(list2[0]?.foodItemId).toBe("ps-margherita");
  });
});
