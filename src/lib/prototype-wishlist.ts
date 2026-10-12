/**
 * QuickFeast Wishlist / Favorites Prototype Layer
 *
 * NOTE: Prototype data/state layer using localStorage.
 * Structured cleanly with types and event sync so it can be seamlessly replaced
 * with a REST/GraphQL API or MongoDB database in later fullstack phases.
 */

import { getCurrentSession } from "./prototype-auth";
import { getMenuItemById, getRestaurantById, type MenuItem } from "./customer-restaurants";

export interface WishlistItem {
  foodItemId: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  ingredients: string;
  category?: string | undefined;
  savedAt: string; // ISO date string
}

function getWishlistStorageKey(customerId: string): string {
  return `quickfeast_wishlist_${customerId}`;
}

function getActiveCustomerId(): string {
  const session = getCurrentSession();
  return session?.id ?? "guest";
}

export function getWishlist(customerId?: string): WishlistItem[] {
  if (typeof window === "undefined") return [];
  const cid = customerId ?? getActiveCustomerId();
  try {
    const raw = localStorage.getItem(getWishlistStorageKey(cid));
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to read wishlist from localStorage:", err);
    return [];
  }
}

export function saveWishlist(items: WishlistItem[], customerId?: string): void {
  if (typeof window === "undefined") return;
  const cid = customerId ?? getActiveCustomerId();
  try {
    localStorage.setItem(getWishlistStorageKey(cid), JSON.stringify(items));
    window.dispatchEvent(new Event("quickfeast_wishlist_change"));
  } catch (err) {
    console.error("Failed to save wishlist to localStorage:", err);
  }
}

export function isItemInWishlist(foodItemId: string, customerId?: string): boolean {
  const current = getWishlist(customerId);
  return current.some((item) => item.foodItemId === foodItemId);
}

export function addToWishlist(
  item: {
    foodItemId: string;
    restaurantId?: string;
    restaurantName?: string;
    name?: string;
    image?: string;
    price?: number;
    rating?: number;
    ingredients?: string;
    category?: string | undefined;
  },
  customerId?: string
): WishlistItem[] {
  const current = getWishlist(customerId);
  if (current.some((i) => i.foodItemId === item.foodItemId)) {
    return current;
  }

  // Look up source menu item to ensure all fields are populated
  const sourceItem = getMenuItemById(item.foodItemId);
  const sourceRestaurant = sourceItem
    ? getRestaurantById(sourceItem.restaurantId)
    : undefined;

  const newItem: WishlistItem = {
    foodItemId: item.foodItemId,
    restaurantId: item.restaurantId ?? sourceItem?.restaurantId ?? "",
    restaurantName:
      item.restaurantName ??
      sourceRestaurant?.name ??
      "QuickFeast Partner",
    name: item.name ?? sourceItem?.name ?? "Delicious Dish",
    image: item.image ?? sourceItem?.image ?? "",
    price: item.price ?? sourceItem?.price ?? 0,
    rating: item.rating ?? sourceItem?.rating ?? 4.5,
    ingredients: item.ingredients ?? sourceItem?.ingredients ?? "",
    category: item.category ?? sourceItem?.category,
    savedAt: new Date().toISOString(),
  };

  current.unshift(newItem);
  saveWishlist(current, customerId);
  return current;
}

export function removeFromWishlist(
  foodItemId: string,
  customerId?: string
): WishlistItem[] {
  const current = getWishlist(customerId);
  const filtered = current.filter((item) => item.foodItemId !== foodItemId);
  saveWishlist(filtered, customerId);
  return filtered;
}

export function toggleWishlist(
  item: {
    foodItemId: string;
    restaurantId?: string;
    restaurantName?: string;
    name?: string;
    image?: string;
    price?: number;
    rating?: number;
    ingredients?: string;
    category?: string | undefined;
  },
  customerId?: string
): { isWishlisted: boolean; items: WishlistItem[] } {
  if (isItemInWishlist(item.foodItemId, customerId)) {
    const items = removeFromWishlist(item.foodItemId, customerId);
    return { isWishlisted: false, items };
  } else {
    const items = addToWishlist(item, customerId);
    return { isWishlisted: true, items };
  }
}

export function clearWishlist(customerId?: string): void {
  if (typeof window === "undefined") return;
  const cid = customerId ?? getActiveCustomerId();
  try {
    localStorage.removeItem(getWishlistStorageKey(cid));
    window.dispatchEvent(new Event("quickfeast_wishlist_change"));
  } catch (err) {
    console.error("Failed to clear wishlist:", err);
  }
}
