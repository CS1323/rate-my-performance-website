import express from "express";

// Import Routes
import postsRoutes from "./src/routes/posts.routes.js";
import commentsRoutes from "./src/routes/comments.routes.js";
import votesRoutes from "./src/routes/votes.routes.js";
import reportsRoutes from "./src/routes/reports.routes.js";
import quizRoutes from "./src/routes/quiz.routes.js";

const app = express();

// API Routes
app.use("/api/posts", postsRoutes)
app.use("/api/comments", commentsRoutes)
app.use("/api/votes", votesRoutes)
app.use("/api/reports", reportsRoutes)
app.use("/api/quiz", quizRoutes)

const PORT = 5001;
const server = app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});