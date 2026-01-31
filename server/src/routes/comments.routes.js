import express from "express";

const router = express.Router();

// GET /api/comments/post/:postId
router.get("/post/:postId", getCommentsByPost);

// POST /api/comments/post/:postId
router.post("/post/:postId", createComment);

// POST /api/comments/:commentId/reply
router.post("/:commentId/reply", replyToComment);