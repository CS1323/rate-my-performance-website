import { z } from 'zod';

/**
 * Schema for getting a post
 * GET /api/posts/:slug
 */
export const getPostSchema = z.object({
  slug: z.string()
    .min(1, "Post slug is required")
    .max(255, "Slug cannot exceed 255 characters")
});
