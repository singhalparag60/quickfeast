import type { Restaurant, MenuItem } from "./customer-restaurants";

/**
 * Base URL for the QuickFeast Express API backend.
 * Uses Vite's environment variable `VITE_API_BASE_URL` if set,
 * defaulting to `http://localhost:5000` for local development.
 */
export const API_BASE_URL: string =
  (typeof import.meta !== "undefined" && import.meta.env?.["VITE_API_BASE_URL"]) ||
  "http://localhost:5000";

export interface BackendMenuItem {
  itemId: string;
  name: string;
  price: number;
  rating: number;
  ingredients: string;
  image: string;
  imageAlt?: string;
  category?: string;
}

export interface BackendRestaurant {
  _id?: string;
  restaurantId: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryMinutes: number;
  image: string;
  imageAlt: string;
  highlight?: string;
  description?: string;
  menuItems?: BackendMenuItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

/**
 * Normalizes backend restaurant document to the frontend Restaurant interface.
 */
export function normalizeRestaurant(data: BackendRestaurant): Restaurant {
  return {
    id: data.restaurantId,
    name: data.name,
    cuisine: data.cuisine,
    rating: data.rating,
    deliveryMinutes: data.deliveryMinutes,
    image: data.image,
    imageAlt: data.imageAlt,
    ...(data.highlight ? { highlight: data.highlight } : {}),
    ...(data.description ? { description: data.description } : {}),
  };
}

/**
 * Normalizes backend menu item to the frontend MenuItem interface.
 */
export function normalizeMenuItem(item: BackendMenuItem, restaurantId: string): MenuItem {
  return {
    id: item.itemId,
    restaurantId,
    name: item.name,
    price: item.price,
    rating: item.rating,
    ingredients: item.ingredients,
    image: item.image,
    ...(item.imageAlt ? { imageAlt: item.imageAlt } : {}),
    ...(item.category ? { category: item.category } : {}),
  };
}

/**
 * Fetches all restaurants from the Express backend with optional sorting/filtering.
 */
export async function fetchRestaurants(options?: {
  sort?: string | undefined;
  search?: string | undefined;
}): Promise<Restaurant[]> {
  const url = new URL(`${API_BASE_URL}/api/restaurants`);
  if (options?.sort) {
    url.searchParams.set("sort", options.sort);
  }
  if (options?.search && options.search.trim() !== "") {
    url.searchParams.set("search", options.search.trim());
  }

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    let errorMsg = `Server error (${response.status})`;
    try {
      const errorJson = await response.json();
      if (errorJson.message) errorMsg = errorJson.message;
    } catch {
      // ignore json parse errors on non-ok status
    }
    throw new Error(errorMsg);
  }

  const result: ApiResponse<BackendRestaurant[]> = await response.json();

  if (!result.success || !Array.isArray(result.data)) {
    throw new Error(result.message || "Failed to load restaurants from server");
  }

  return result.data.map(normalizeRestaurant);
}

/**
 * Fetches a single restaurant and its menu items from the Express backend.
 */
export async function fetchRestaurantById(
  restaurantId: string
): Promise<{ restaurant: Restaurant; menuItems: MenuItem[] }> {
  if (!restaurantId || restaurantId.trim() === "") {
    throw new Error("Restaurant ID is required");
  }

  const response = await fetch(`${API_BASE_URL}/api/restaurants/${encodeURIComponent(restaurantId.trim())}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    let errorMsg = `Server error (${response.status})`;
    try {
      const errorJson = await response.json();
      if (errorJson.message) errorMsg = errorJson.message;
    } catch {
      // ignore json parse errors
    }
    throw new Error(errorMsg);
  }

  const result: ApiResponse<BackendRestaurant> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.message || `Restaurant '${restaurantId}' not found`);
  }

  const raw = result.data;
  const restaurant = normalizeRestaurant(raw);
  const menuItems = (raw.menuItems || []).map((item) => normalizeMenuItem(item, restaurant.id));

  return {
    restaurant,
    menuItems,
  };
}
