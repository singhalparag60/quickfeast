import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Restaurant } from "../models/Restaurant.ts";
import { seedRestaurants, type SeedRestaurant } from "../data/restaurants.seed-data.ts";
import { connectDatabase } from "../config/database.ts";

export interface SeedResult {
  upsertedCount: number;
  matchedCount: number;
  modifiedCount: number;
  total: number;
}

/**
 * Seeds restaurants into MongoDB idempotently.
 * Uses `bulkWrite` with `updateOne` + `{ upsert: true }` keyed by `restaurantId`.
 * Running multiple times updates existing documents without creating duplicates.
 */
export async function seedRestaurantsData(data: SeedRestaurant[] = seedRestaurants): Promise<SeedResult> {
  if (data.length === 0) {
    return { upsertedCount: 0, matchedCount: 0, modifiedCount: 0, total: 0 };
  }

  const operations = data.map((item) => ({
    updateOne: {
      filter: { restaurantId: item.restaurantId },
      update: {
        $set: {
          restaurantId: item.restaurantId,
          name: item.name,
          cuisine: item.cuisine,
          rating: item.rating,
          deliveryMinutes: item.deliveryMinutes,
          image: item.image,
          imageAlt: item.imageAlt,
          ...(item.highlight ? { highlight: item.highlight } : {}),
          ...(item.description ? { description: item.description } : {}),
          menuItems: item.menuItems,
        },
      },
      upsert: true,
    },
  }));

  const bulkResult = await Restaurant.bulkWrite(operations);

  return {
    upsertedCount: bulkResult.upsertedCount,
    matchedCount: bulkResult.matchedCount,
    modifiedCount: bulkResult.modifiedCount,
    total: await Restaurant.countDocuments(),
  };
}

/**
 * Standalone execution script (e.g. `npm run db:seed`)
 */
async function runStandaloneSeed() {
  console.log("[Seed] Connecting to database...");
  const connected = await connectDatabase();

  if (!connected) {
    console.error("[Seed] Aborting seed: Unable to establish database connection.");
    process.exit(1);
  }

  try {
    console.log(`[Seed] Processing ${seedRestaurants.length} restaurants...`);
    const result = await seedRestaurantsData();
    console.log(`[Seed] Success! Upserted: ${result.upsertedCount}, Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
    console.log(`[Seed] Total restaurants in database: ${result.total}`);
  } catch (error) {
    console.error("[Seed] Seeding error:", error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("[Seed] Disconnected from database.");
  }
}

// Run immediately if executed directly via node or tsx
const isDirectExecution =
  process.argv[1]?.endsWith("seed-restaurants.ts") || process.argv[1]?.endsWith("seed-restaurants.js");

if (isDirectExecution) {
  void runStandaloneSeed();
}
