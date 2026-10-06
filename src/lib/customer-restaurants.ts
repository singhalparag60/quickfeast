import burgerImage from "@/assets/burger.jpg";
import pizzaImage from "@/assets/pizza.jpg";
import pokeImage from "@/assets/poke.jpg";
import sushiImage from "@/assets/sushi.jpg";
import curryImage from "@/assets/curry.jpg";
import feastImage from "@/assets/quickfeast-hero.jpg";

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryMinutes: number;
  image: string;
  imageAlt: string;
  highlight?: string;
}

// Demo catalog. Replace this collection with an API response when connected.
export const restaurants: Restaurant[] = [
  { id: "bun-and-done", name: "Bun & Done", cuisine: "Burgers · American", rating: 4.8, deliveryMinutes: 20, image: burgerImage, imageAlt: "Juicy cheeseburger with fresh toppings", highlight: "Local favorite" },
  { id: "pizza-social", name: "Pizza Social", cuisine: "Pizza · Italian", rating: 4.7, deliveryMinutes: 25, image: pizzaImage, imageAlt: "Freshly baked pizza with colorful toppings", highlight: "Crowd pleaser" },
  { id: "green-bowl", name: "The Green Bowl", cuisine: "Bowls · Healthy", rating: 4.9, deliveryMinutes: 15, image: pokeImage, imageAlt: "Fresh colorful poke bowl", highlight: "Fresh & feel-good" },
  { id: "maki-house", name: "Maki House", cuisine: "Sushi · Japanese", rating: 4.8, deliveryMinutes: 30, image: sushiImage, imageAlt: "Salmon nigiri and avocado sushi rolls" },
  { id: "spice-table", name: "Spice Table", cuisine: "Curry · Indian", rating: 4.6, deliveryMinutes: 25, image: curryImage, imageAlt: "Butter chicken with basmati rice and naan" },
  { id: "neighborhood-kitchen", name: "Neighborhood Kitchen", cuisine: "Comfort food · International", rating: 4.7, deliveryMinutes: 20, image: feastImage, imageAlt: "A generous spread of pizza, salad and crispy chicken" },
];

export type RestaurantSort = "recommended" | "rating" | "fastest";

export function findRestaurants(query: string, sort: RestaurantSort, catalog = restaurants) {
  const search = query.trim().toLocaleLowerCase();
  const result = catalog.filter((restaurant) => `${restaurant.name} ${restaurant.cuisine}`.toLocaleLowerCase().includes(search));
  if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
  if (sort === "fastest") result.sort((a, b) => a.deliveryMinutes - b.deliveryMinutes);
  return result;
}