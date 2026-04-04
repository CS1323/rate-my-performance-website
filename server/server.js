// Sentry is initialized via NODE_OPTIONS='--import ./instrument.js'
// This is the recommended approach for ESM applications

import express from "express";
import compression from "compression";
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
import analyticsRoutes from "./src/routes/analytics.routes.js";

connectDB();

const app = express();

// Trust Vercel/Render proxy headers for accurate IP identification
// Required for: rate limiting to work correctly, GA geolocation data
app.set('trust proxy', true);

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

// Analytics proxy routes — mounted at root so /gtag/js and /g/collect
app.use("/", analyticsRoutes)

// API Routes
app.use("/api/posts", postsRoutes)
app.use("/api/comments", commentsRoutes)
app.use("/api/votes", votesRoutes)
app.use("/api/reports", reportsRoutes)
app.use("/api/ads", adsRoutes)

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