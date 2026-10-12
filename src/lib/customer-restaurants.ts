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
  description?: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  price: number; // in INR (₹)
  rating: number;
  ingredients: string;
  image: string;
  imageAlt?: string;
  category?: string;
}

// 6 demo restaurants catalog
export const restaurants: Restaurant[] = [
  {
    id: "bun-and-done",
    name: "Bun & Done",
    cuisine: "Burgers · American",
    rating: 4.8,
    deliveryMinutes: 20,
    image: burgerImage,
    imageAlt: "Juicy cheeseburger with fresh toppings",
    highlight: "Local favorite",
    description: "Artisan smash burgers, crispy sides, and handcrafted shakes made fresh with premium brioche buns.",
  },
  {
    id: "pizza-social",
    name: "Pizza Social",
    cuisine: "Pizza · Italian",
    rating: 4.7,
    deliveryMinutes: 25,
    image: pizzaImage,
    imageAlt: "Freshly baked pizza with colorful toppings",
    highlight: "Crowd pleaser",
    description: "Wood-fired sourdough pizzas crafted with San Marzano tomatoes, artisanal cheeses, and fresh aromatic herbs.",
  },
  {
    id: "green-bowl",
    name: "The Green Bowl",
    cuisine: "Bowls · Healthy",
    rating: 4.9,
    deliveryMinutes: 15,
    image: pokeImage,
    imageAlt: "Fresh colorful poke bowl",
    highlight: "Fresh & feel-good",
    description: "Nourishing farm-to-table bowls, nutrient-rich salads, and fresh vibrant smoothies prepared daily.",
  },
  {
    id: "maki-house",
    name: "Maki House",
    cuisine: "Sushi · Japanese",
    rating: 4.8,
    deliveryMinutes: 30,
    image: sushiImage,
    imageAlt: "Salmon nigiri and avocado sushi rolls",
    description: "Authentic Tokyo-style sushi rolls, hand-rolled temaki, and sashimi crafted with fresh sashimi-grade catch.",
  },
  {
    id: "spice-table",
    name: "Spice Table",
    cuisine: "Curry · Indian",
    rating: 4.6,
    deliveryMinutes: 25,
    image: curryImage,
    imageAlt: "Butter chicken with basmati rice and naan",
    description: "Rich heritage curries, clay-oven tandoor delicacies, and slow-dum biryanis fragrant with whole spices.",
  },
  {
    id: "neighborhood-kitchen",
    name: "Neighborhood Kitchen",
    cuisine: "Comfort food · International",
    rating: 4.7,
    deliveryMinutes: 20,
    image: feastImage,
    imageAlt: "A generous spread of pizza, salad and crispy chicken",
    description: "Homestyle global comfort cooking — soul-warming mains, loaded platters, and wholesome family favorites.",
  },
];

// Menu items for each restaurant: exactly 6 items each (36 total)
export const menuItems: MenuItem[] = [
  // 1. Bun & Done (Burgers)
  {
    id: "bd-classic-cheeseburger",
    restaurantId: "bun-and-done",
    name: "Classic Cheeseburger",
    price: 249,
    rating: 4.8,
    ingredients: "Smash beef patty, aged cheddar cheese, crisp lettuce, pickles, and house secret sauce on toasted brioche.",
    image: burgerImage,
    category: "Burgers",
  },
  {
    id: "bd-crispy-chicken-burger",
    restaurantId: "bun-and-done",
    name: "Crispy Chicken Burger",
    price: 279,
    rating: 4.7,
    ingredients: "Buttermilk marinated fried chicken breast, spicy coleslaw, jalapeños, and smoky mayo on seeded bun.",
    image: burgerImage,
    category: "Burgers",
  },
  {
    id: "bd-bbq-bacon-burger",
    restaurantId: "bun-and-done",
    name: "BBQ Bacon Burger",
    price: 329,
    rating: 4.9,
    ingredients: "Double grilled patty, crispy smoked bacon, caramelized onions, melted cheddar, and sweet hickory BBQ sauce.",
    image: burgerImage,
    category: "Burgers",
  },
  {
    id: "bd-veggie-supreme-burger",
    restaurantId: "bun-and-done",
    name: "Veggie Supreme Burger",
    price: 219,
    rating: 4.6,
    ingredients: "Spiced quinoa and black bean patty, avocado crema, ripe tomatoes, red onion, and arugula on multigrain bun.",
    image: burgerImage,
    category: "Burgers",
  },
  {
    id: "bd-loaded-fries",
    restaurantId: "bun-and-done",
    name: "Loaded Cheese Fries",
    price: 189,
    rating: 4.7,
    ingredients: "Golden crispy skin-on fries smothered in warm cheddar cheese sauce, jalapeño bits, and chopped chives.",
    image: burgerImage,
    category: "Sides",
  },
  {
    id: "bd-chicken-wrap",
    restaurantId: "bun-and-done",
    name: "Crispy Tender Chicken Wrap",
    price: 239,
    rating: 4.5,
    ingredients: "Hand-breaded chicken tenders, shredded romaine lettuce, diced tomatoes, and herb garlic ranch rolled in a tortilla.",
    image: burgerImage,
    category: "Wraps",
  },

  // 2. Pizza Social (Pizza)
  {
    id: "ps-margherita",
    restaurantId: "pizza-social",
    name: "Margherita Pizza",
    price: 299,
    rating: 4.8,
    ingredients: "San Marzano crushed tomato sauce, fresh mozzarella fior di latte, sweet basil leaves, oregano, and extra virgin olive oil.",
    image: pizzaImage,
    category: "Vegetarian",
  },
  {
    id: "ps-farmhouse",
    restaurantId: "pizza-social",
    name: "Farmhouse Garden Pizza",
    price: 359,
    rating: 4.6,
    ingredients: "Herbed tomato sauce, mozzarella, bell peppers, button mushrooms, black olives, sweet corn, and red onions.",
    image: pizzaImage,
    category: "Vegetarian",
  },
  {
    id: "ps-pepperoni",
    restaurantId: "pizza-social",
    name: "Classic Pepperoni Pizza",
    price: 449,
    rating: 4.9,
    ingredients: "Slow-simmered tomato passata, whole milk mozzarella, spicy cured beef pepperoni slices, and chili honey drizzle.",
    image: pizzaImage,
    category: "Non-Veg",
  },
  {
    id: "ps-bbq-chicken",
    restaurantId: "pizza-social",
    name: "BBQ Chicken Pizza",
    price: 429,
    rating: 4.7,
    ingredients: "Smoked barbecue sauce, pulled roast chicken, red onions, cilantro, mozzarella, and smoked gouda cheese.",
    image: pizzaImage,
    category: "Non-Veg",
  },
  {
    id: "ps-four-cheese",
    restaurantId: "pizza-social",
    name: "Four Cheese Quattro Pizza",
    price: 399,
    rating: 4.8,
    ingredients: "White garlic sauce, creamy mozzarella, aged parmesan reggiano, gorgonzola blue cheese, and creamy ricotta.",
    image: pizzaImage,
    category: "Vegetarian",
  },
  {
    id: "ps-spicy-paneer",
    restaurantId: "pizza-social",
    name: "Spicy Paneer Tikka Pizza",
    price: 369,
    rating: 4.7,
    ingredients: "Tandoori spiced tomato reduction, marinated cottage cheese cubes, charred capsicum, mozzarella, and coriander.",
    image: pizzaImage,
    category: "Vegetarian",
  },

  // 3. The Green Bowl (Healthy Bowls & Salads)
  {
    id: "gb-avocado-salmon-poke",
    restaurantId: "green-bowl",
    name: "Avocado Salmon Poke Bowl",
    price: 489,
    rating: 4.9,
    ingredients: "Fresh diced salmon, ripe hass avocado, edamame beans, cucumber ribbons, sesame seeds, and ponzu dressing on brown sushi rice.",
    image: pokeImage,
    category: "Poke Bowls",
  },
  {
    id: "gb-teriyaki-tofu-bowl",
    restaurantId: "green-bowl",
    name: "Teriyaki Tofu Power Bowl",
    price: 329,
    rating: 4.7,
    ingredients: "Pan-seared organic tofu glazed in sweet teriyaki, steamed broccoli florets, shredded carrots, purple cabbage, and nutty quinoa.",
    image: pokeImage,
    category: "Vegan Bowls",
  },
  {
    id: "gb-mediterranean-quinoa",
    restaurantId: "green-bowl",
    name: "Mediterranean Quinoa Bowl",
    price: 349,
    rating: 4.8,
    ingredients: "Herbed fluffy quinoa, creamy feta cheese crumbles, kalamata olives, cherry tomatoes, crisp cucumbers, and lemon tahini dressing.",
    image: pokeImage,
    category: "Salads",
  },
  {
    id: "gb-superfood-crunch",
    restaurantId: "green-bowl",
    name: "Superfood Harvest Crunch",
    price: 319,
    rating: 4.6,
    ingredients: "Baby kale, baby spinach, roasted sweet potato wedges, toasted pumpkin seeds, dried cranberries, and zesty cider vinaigrette.",
    image: pokeImage,
    category: "Salads",
  },
  {
    id: "gb-spicy-tuna-bowl",
    restaurantId: "green-bowl",
    name: "Spicy Ahi Tuna Crunch Bowl",
    price: 499,
    rating: 4.8,
    ingredients: "Yellowfin ahi tuna tossed in sriracha sesame mayo, wakame seaweed salad, pickled ginger, crispy shallots, and warm jasmine rice.",
    image: pokeImage,
    category: "Poke Bowls",
  },
  {
    id: "gb-green-goddess-smoothie",
    restaurantId: "green-bowl",
    name: "Green Goddess Acai Bowl",
    price: 289,
    rating: 4.7,
    ingredients: "Organic frozen acai blend, baby spinach, kiwi slices, organic chia seeds, gluten-free almond granola, and raw clover honey.",
    image: pokeImage,
    category: "Smoothie Bowls",
  },

  // 4. Maki House (Sushi & Japanese)
  {
    id: "mh-salmon-avocado-roll",
    restaurantId: "maki-house",
    name: "Salmon Avocado Uramaki",
    price: 459,
    rating: 4.9,
    ingredients: "Fresh Atlantic salmon, creamy avocado, seasoned Japanese sushi rice, roasted nori seaweed, and white toasted sesame seeds.",
    image: sushiImage,
    category: "Maki & Rolls",
  },
  {
    id: "mh-california-roll",
    restaurantId: "maki-house",
    name: "Classic California Roll",
    price: 389,
    rating: 4.6,
    ingredients: "Snow crab meat blend, cool cucumber batons, fresh avocado, nori, seasoned sushi rice, and flying fish tobiko.",
    image: sushiImage,
    category: "Maki & Rolls",
  },
  {
    id: "mh-spicy-tuna-maki",
    restaurantId: "maki-house",
    name: "Spicy Tuna Crunch Maki",
    price: 479,
    rating: 4.8,
    ingredients: "Minced yellowfin tuna, spicy chili oil, scallions, tempura crunch flakes, nori wrap, and unagi sweet sauce.",
    image: sushiImage,
    category: "Maki & Rolls",
  },
  {
    id: "mh-crispy-tempura-shrimp",
    restaurantId: "maki-house",
    name: "Crispy Ebi Tempura Roll",
    price: 499,
    rating: 4.8,
    ingredients: "Flash-fried jumbo tiger prawns, avocado, cream cheese, spicy kewpie mayo, and crispy tempura crumble dusting.",
    image: sushiImage,
    category: "Special Rolls",
  },
  {
    id: "mh-vegetable-futomaki",
    restaurantId: "maki-house",
    name: "Garden Vegetable Futomaki",
    price: 349,
    rating: 4.5,
    ingredients: "Marinated shiitake mushrooms, crisp cucumber, sweet tamagoyaki omelet, pickled daikon radish, and avocado.",
    image: sushiImage,
    category: "Vegetarian",
  },
  {
    id: "mh-salmon-nigiri-platter",
    restaurantId: "maki-house",
    name: "Fresh Salmon Nigiri (4 pcs)",
    price: 429,
    rating: 4.9,
    ingredients: "Hand-pressed seasoned sushi rice topped with hand-sliced salmon fillets, fresh wasabi dab, and soy glaze.",
    image: sushiImage,
    category: "Nigiri",
  },

  // 5. Spice Table (Curry & Indian)
  {
    id: "st-butter-chicken",
    restaurantId: "spice-table",
    name: "Old Delhi Butter Chicken",
    price: 399,
    rating: 4.9,
    ingredients: "Tandoori grilled chicken morsels simmered in rich velvety tomato, cashew nut gravy, churned butter, and dried kasuri methi.",
    image: curryImage,
    category: "Curries",
  },
  {
    id: "st-paneer-butter-masala",
    restaurantId: "spice-table",
    name: "Paneer Butter Masala",
    price: 349,
    rating: 4.8,
    ingredients: "Fresh melt-in-mouth cottage cheese cooked in creamy spiced tomato-onion gravy finished with dairy cream and green cardamom.",
    image: curryImage,
    category: "Curries",
  },
  {
    id: "st-dal-makhani",
    restaurantId: "spice-table",
    name: "Slow-Cooked Dal Makhani",
    price: 289,
    rating: 4.7,
    ingredients: "Whole black lentils and kidney beans slow-simmered overnight over charcoal with garlic, fresh ginger, and cultured white butter.",
    image: curryImage,
    category: "Dal & Lentils",
  },
  {
    id: "st-dum-biryani",
    restaurantId: "spice-table",
    name: "Awadhi Murgh Dum Biryani",
    price: 419,
    rating: 4.8,
    ingredients: "Aged long-grain basmati rice and marinated chicken cooked on slow steam with saffron, brown caramelized onions, and mint.",
    image: curryImage,
    category: "Biryani",
  },
  {
    id: "st-garlic-butter-naan",
    restaurantId: "spice-table",
    name: "Tandoori Garlic Butter Naan",
    price: 79,
    rating: 4.6,
    ingredients: "Hand-stretched refined wheat bread baked in blazing clay oven, brushed with cultured butter and roasted minced garlic.",
    image: curryImage,
    category: "Breads",
  },
  {
    id: "st-tandoori-chicken",
    restaurantId: "spice-table",
    name: "Charcoal Tandoori Chicken Tikka",
    price: 379,
    rating: 4.7,
    ingredients: "Boneless chicken thighs marinated in Kashmiri red chili paste, hung spiced yogurt, mustard oil, and smoked over coal.",
    image: curryImage,
    category: "Appetizers",
  },

  // 6. Neighborhood Kitchen (Comfort food & International)
  {
    id: "nk-herb-roast-chicken",
    restaurantId: "neighborhood-kitchen",
    name: "Rosemary Roasted Half Chicken",
    price: 449,
    rating: 4.8,
    ingredients: "Slow-roasted tender half chicken with fresh rosemary, thyme, garlic butter pan gravy, and whipped mashed potatoes.",
    image: feastImage,
    category: "Comfort Mains",
  },
  {
    id: "nk-truffle-mac-cheese",
    restaurantId: "neighborhood-kitchen",
    name: "Baked Truffle Mac & Cheese",
    price: 329,
    rating: 4.7,
    ingredients: "Elbow pasta smothered in three-cheese béchamel sauce, white truffle oil essence, and baked panko golden herb crust.",
    image: feastImage,
    category: "Comfort Mains",
  },
  {
    id: "nk-grilled-chicken-steak",
    restaurantId: "neighborhood-kitchen",
    name: "Grilled Herb Chicken Steak",
    price: 419,
    rating: 4.6,
    ingredients: "Juicy grilled chicken breasts served with peppercorn mushroom cream sauce, butter tossed greens, and crispy French fries.",
    image: feastImage,
    category: "Steaks & Grills",
  },
  {
    id: "nk-caesar-salad",
    restaurantId: "neighborhood-kitchen",
    name: "Crispy Bacon Caesar Salad",
    price: 299,
    rating: 4.7,
    ingredients: "Crisp romaine hearts, toasted sourdough croutons, shaved parmesan flakes, crispy bacon bites, and homemade creamy Caesar dressing.",
    image: feastImage,
    category: "Salads",
  },
  {
    id: "nk-classic-lasagna",
    restaurantId: "neighborhood-kitchen",
    name: "Slow-Baked Bolognese Lasagna",
    price: 389,
    rating: 4.9,
    ingredients: "Layered handmade pasta sheets, slow-cooked meat ragu, velvety parmesan béchamel, and melted golden mozzarella.",
    image: feastImage,
    category: "Pasta",
  },
  {
    id: "nk-chili-cheese-toast",
    restaurantId: "neighborhood-kitchen",
    name: "Golden Chili Cheese Toasties",
    price: 199,
    rating: 4.5,
    ingredients: "Thick sourdough slices baked with sharp cheddar, spicy green chili bits, bell peppers, and fresh cilantro sprigs.",
    image: feastImage,
    category: "Starters",
  },
];

export type RestaurantSort = "recommended" | "rating" | "fastest";

export function findRestaurants(query: string, sort: RestaurantSort, catalog = restaurants) {
  const search = query.trim().toLocaleLowerCase();
  const result = catalog.filter((restaurant) =>
    `${restaurant.name} ${restaurant.cuisine}`.toLocaleLowerCase().includes(search)
  );
  if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
  if (sort === "fastest") result.sort((a, b) => a.deliveryMinutes - b.deliveryMinutes);
  return result;
}

export function getRestaurantById(id: string): Restaurant | undefined {
  return restaurants.find((r) => r.id === id);
}

export function getMenuItemsByRestaurantId(restaurantId: string): MenuItem[] {
  return menuItems.filter((item) => item.restaurantId === restaurantId);
}

export function getMenuItemById(id: string): MenuItem | undefined {
  return menuItems.find((item) => item.id === id);
}