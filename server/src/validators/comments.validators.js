import { z } from 'zod';

/**
 * Schema for creating a top-level comment
 * POST /api/comments/post/:postId
 */
const createCommentSchema = z.object({
  content: z.string()
    .min(1, "Content cannot be empty")
    .max(5000, "Content cannot exceed 5000 characters"),
  authorName: z.string()
    .min(1, "Author name is required")
    .max(50, "Author name cannot exceed 50 characters"),
  avatarId: z.number()
    .int("Avatar ID must be an integer")
    .min(1, "Avatar ID must be between 1 and 4")
    .max(4, "Avatar ID must be between 1 and 4")
});

/**
 * Schema for replying to a comment
 * POST /api/comments/:commentId/reply
 */
const replyToCommentSchema = z.object({
  content: z.string()
    .min(1, "Content cannot be empty")
    .max(5000, "Content cannot exceed 5000 characters"),
  authorName: z.string()
    .min(1, "Author name is required")
    .max(50, "Author name cannot exceed 50 characters"),
  avatarId: z.number()
    .int("Avatar ID must be an integer")
    .min(1, "Avatar ID must be between 1 and 4")
    .max(4, "Avatar ID must be between 1 and 4")
});

/**
 * Schema for getting comments by post (validates params)
 * GET /api/comments/post/:postId
 */
const getCommentsByPostSchema = z.object({
  postId: z.string()
    .uuid("Invalid post ID format")
});

export {createCommentSchema, replyToCommentSchema, getCommentsByPostSchema};