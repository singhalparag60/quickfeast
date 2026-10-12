import { Router, type Request, type Response } from "express";
import { Restaurant } from "../models/Restaurant.ts";

export const restaurantRouter = Router();

/**
 * GET /api/restaurants
 * Returns list of all restaurants with menu items.
 * Supports optional query params:
 * - `sort`: "rating" | "fastest" | "name"
 * - `search`: substring search against name or cuisine
 */
restaurantRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { sort, search } = req.query;

    const filter: Record<string, unknown> = {};

    if (typeof search === "string" && search.trim() !== "") {
      const sanitizedSearch = search.trim();
      filter["$or"] = [
        { name: { $regex: sanitizedSearch, $options: "i" } },
        { cuisine: { $regex: sanitizedSearch, $options: "i" } },
      ];
    }

    const query = Restaurant.find(filter).select("-__v");

    if (sort === "rating") {
      query.sort({ rating: -1 });
    } else if (sort === "fastest") {
      query.sort({ deliveryMinutes: 1 });
    } else if (sort === "name") {
      query.sort({ name: 1 });
    }

    const restaurants = await query.exec();

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    console.error("[Restaurant API] Error retrieving restaurants:", error);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred while retrieving restaurants",
    });
  }
});

/**
 * GET /api/restaurants/:id
 * Returns a single restaurant by `restaurantId` (e.g. "pizza-social").
 */
restaurantRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string" || id.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurant ID provided",
      });
    }

    const restaurant = await Restaurant.findOne({ restaurantId: id.trim() }).select("-__v");

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: `Restaurant with ID '${id}' not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    console.error(`[Restaurant API] Error fetching restaurant ${req.params["id"]}:`, error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while retrieving the restaurant",
    });
  }
});
