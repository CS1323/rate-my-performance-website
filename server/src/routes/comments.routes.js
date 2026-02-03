import express from "express";
import { getCommentsByPost, createComment, replyToComment } from "../controllers/comments.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createCommentSchema, getCommentsByPostSchema, replyToCommentSchema } from "../validators/comments.validators.js";

const router = express.Router();

// GET /api/comments/post/:postId
router.get("/post/:postId", validateRequest(getCommentsByPostSchema), getCommentsByPost);

// POST /api/comments/post/:postId
router.post("/post/:postId", validateRequest(createCommentSchema), createComment);

// POST /api/comments/:commentId/reply
router.post("/:commentId/reply", validateRequest(replyToCommentSchema), replyToComment);

export default router;