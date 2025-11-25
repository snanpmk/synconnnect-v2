// server/server.js
import dotenv from "dotenv";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

import app from "./app.js";
import connectDB from "./config/database.js";
import logger from "./utils/logger.js";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from parent folder
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// Create HTTP server
const server = http.createServer(app);

// Get PORT from environment or default
const PORT = process.env.PORT || 5000;

// Start server after DB connection
(async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    logger.info("Server closed.");
    process.exit(0);
  });
});
