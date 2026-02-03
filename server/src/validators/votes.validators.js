import { z } from 'zod';

/**
 * Schema for submitting a vote
 * POST /api/votes
 */
const submitVoteSchema = z.object({
  commentId: z.string()
    .uuid("Invalid comment ID format"),
  type: z.enum(['LIKE', 'DISLIKE'], {
    errorMap: () => ({ message: "Vote type must be either 'LIKE' or 'DISLIKE'" })
  }),
  ipHash: z.string()
    .min(1, "IP hash is required")
});

/**
 * Schema for getting user votes
 * GET /api/votes/:postId?ipHash=...
 */
const getUserVotesSchema = z.object({
  postId: z.string()
    .uuid("Invalid post ID format"),
  ipHash: z.string()
    .min(1, "IP hash is required")
});

export {submitVoteSchema, getUserVotesSchema};