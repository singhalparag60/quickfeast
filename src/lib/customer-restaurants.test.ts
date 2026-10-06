import { describe, expect, it } from "vitest";
import { findRestaurants, restaurants } from "./customer-restaurants";

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
});