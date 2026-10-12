import { Router } from "express";
import { isDatabaseConnected } from "../config/database.ts";

/**
 * Health check route router.
 * Defines endpoints for verifying server and database status.
 */
export const healthRouter = Router();

// GET /api/health -> Returns server health status, message, and current ISO timestamp
healthRouter.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "QuickFeast API is running",
    timestamp: new Date().toISOString(),
  });
});

// GET /api/health/db -> Returns database connection health without exposing credentials
healthRouter.get("/db", (_req, res) => {
  const connected = isDatabaseConnected();
  res.status(connected ? 200 : 503).json({
    status: connected ? "connected" : "disconnected",
    database: "quickfeast",
    timestamp: new Date().toISOString(),
  });
});
