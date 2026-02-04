import express from "express";
import { config } from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { connectDB, disconnectDB } from "./config/db.js";
import { errorHandler, notFound } from "./src/middleware/error.middleware.js";

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

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve images from /images
app.use("/images", express.static(join(__dirname, "images")));

// API Routes
app.use("/api/posts", postsRoutes)
app.use("/api/comments", commentsRoutes)
app.use("/api/votes", votesRoutes)
app.use("/api/reports", reportsRoutes)
app.use("/api/ads", adsRoutes)

// Error middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

// Handle unhandles promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});