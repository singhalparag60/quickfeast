import dotenv from "dotenv";

// Load environment variables from .env file before anything else
dotenv.config();

import { app } from "./app.ts";
import { connectDatabase } from "./config/database.ts";

/**
 * Server entry point.
 * Establishes database connection before starting the HTTP listener.
 */
const PORT = process.env["PORT"] ? parseInt(process.env["PORT"], 10) : 5000;

async function startServer() {
  console.log("[QuickFeast Backend] Initializing database connection...");
  const dbConnected = await connectDatabase();

  if (!dbConnected) {
    console.warn(
      "[QuickFeast Backend] Warning: Server starting without active database connection. Check .env configuration and network access."
    );
  }

  app.listen(PORT, () => {
    console.log(`[QuickFeast Backend] Server listening on http://localhost:${PORT}`);
    console.log(`[QuickFeast Backend] Health check: http://localhost:${PORT}/api/health`);
    console.log(`[QuickFeast Backend] Database health: http://localhost:${PORT}/api/health/db`);
  });
}

void startServer();
