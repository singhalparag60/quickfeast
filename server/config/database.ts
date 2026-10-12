import mongoose from "mongoose";

/**
 * Tracks whether the database connection has been established.
 */
let isConnected = false;

/**
 * Connects to MongoDB Atlas using Mongoose.
 * Validates the MONGODB_URI environment variable before attempting connection.
 */
export async function connectDatabase(): Promise<boolean> {
  const uri = process.env["MONGODB_URI"];

  if (!uri || uri.trim() === "") {
    console.error(
      "[Database] Error: MONGODB_URI environment variable is missing or empty in .env"
    );
    return false;
  }

  try {
    // Attempt Mongoose connection to MongoDB Atlas
    await mongoose.connect(uri);
    isConnected = true;
    console.log("[Database] Successfully connected to MongoDB Atlas (database: quickfeast)");
    return true;
  } catch (error) {
    isConnected = false;
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Database] Connection failed: ${errorMessage}`);
    return false;
  }
}

/**
 * Helper to check current database connection status without revealing credentials.
 */
export function isDatabaseConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
