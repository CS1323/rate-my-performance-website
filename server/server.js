// IMPORTANT: Import Sentry instrument.js at the very top before any other imports
import "./instrument.js";

import express from "express";
import compression from "compression";
import { config } from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as Sentry from "@sentry/node";
import { connectDB, disconnectDB } from "./config/db.js";
import { errorHandler, notFound } from "./src/middleware/error.middleware.js";
import { corsMiddleware } from "./src/middleware/cors.middleware.js";
import { limiter } from "./src/middleware/rateLimit.middleware.js";
import logger from "./src/utils/logger.js";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import Routes
import postsRoutes from "./src/routes/posts.routes.js";
import commentsRoutes from "./src/routes/comments.routes.js";
import votesRoutes from "./src/routes/votes.routes.js";
import reportsRoutes from "./src/routes/reports.routes.js";
import adsRoutes from "./src/routes/ads.routes.js";

config();

connectDB();

const app = express();

// CORS Middleware - Allow frontend domains specified in CORS_ORIGIN
app.use(corsMiddleware);

// Rate Limiting Middleware - Prevent abuse and spam
app.use(limiter);

// Compression middleware - gzip/deflate responses
app.use(compression());

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve images from /images with long-term caching
app.use("/images", express.static(join(__dirname, "images"), {
  maxAge: '365d',  // 1 year browser cache
  immutable: true  // Cache won't change
}));

// API Routes
app.use("/api/posts", postsRoutes)
app.use("/api/comments", commentsRoutes)
app.use("/api/votes", votesRoutes)
app.use("/api/reports", reportsRoutes)
app.use("/api/ads", adsRoutes)

// Debug endpoint for testing logging
app.get("/debug-log", (req, res) => {
  logger.error("Test error log entry from /debug-log endpoint", {
    timestamp: new Date().toISOString(),
    testData: "Manual test"
  });
  res.json({ message: "Logged test error - check logs/error.log" });
});

// Debug endpoint for testing Sentry error capture
app.get("/debug-sentry", (req, res) => {
  logger.error("About to throw test error from /debug-sentry", {
    timestamp: new Date().toISOString()
  });
  throw new Error("My first Sentry error!");
});

// Error middleware
app.use(notFound);
app.use(errorHandler);

// Sentry error handler - must be after all routes and error middleware
Sentry.setupExpressErrorHandler(app);

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  logger.info(`Server running on PORT ${PORT}`);
});

// Handle unhandles promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  logger.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});