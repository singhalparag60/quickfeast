import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health.routes.ts";
import { restaurantRouter } from "./routes/restaurant.routes.ts";

/**
 * Express application configuration.
 * Configures core middleware and mounts route handlers.
 */
export const app = express();

// Middleware: Enable Cross-Origin Resource Sharing (CORS)
// Allows frontend clients (e.g., Vite development server) to make HTTP requests
app.use(cors());

// Middleware: Parse incoming request bodies with JSON payloads
app.use(express.json());

// Mount routes
app.use("/api/health", healthRouter);
app.use("/api/restaurants", restaurantRouter);
