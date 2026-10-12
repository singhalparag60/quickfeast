import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IMenuItem {
  itemId: string;
  name: string;
  price: number;
  rating: number;
  ingredients: string;
  image: string;
  imageAlt?: string;
  category?: string;
}

export interface IRestaurant extends Document {
  restaurantId: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryMinutes: number;
  image: string;
  imageAlt: string;
  highlight?: string;
  description?: string;
  menuItems: IMenuItem[];
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    itemId: {
      type: String,
      required: [true, "Menu item ID is required"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Menu item name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [0, "Rating must be between 0 and 5"],
      max: [5, "Rating must be between 0 and 5"],
      default: 4.5,
    },
    ingredients: {
      type: String,
      required: [true, "Ingredients description is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image URL/path is required"],
      trim: true,
    },
    imageAlt: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const RestaurantSchema = new Schema<IRestaurant>(
  {
    restaurantId: {
      type: String,
      required: [true, "Restaurant ID is required"],
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Restaurant name is required"],
      trim: true,
    },
    cuisine: {
      type: String,
      required: [true, "Cuisine is required"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [0, "Rating must be between 0 and 5"],
      max: [5, "Rating must be between 0 and 5"],
      default: 4.5,
    },
    deliveryMinutes: {
      type: Number,
      required: [true, "Delivery minutes is required"],
      min: [1, "Delivery minutes must be at least 1"],
    },
    image: {
      type: String,
      required: [true, "Restaurant image path is required"],
      trim: true,
    },
    imageAlt: {
      type: String,
      required: [true, "Image alt text is required"],
      trim: true,
    },
    highlight: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    menuItems: {
      type: [MenuItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compiling model in dev hot-reload environments
export const Restaurant: Model<IRestaurant> =
  mongoose.models["Restaurant"] || mongoose.model<IRestaurant>("Restaurant", RestaurantSchema);
