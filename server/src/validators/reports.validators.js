import { z } from 'zod';

/**
 * Schema for reporting a comment
 * POST /api/reports
 */
export const reportCommentSchema = z.object({
  commentId: z.string()
    .uuid("Invalid comment ID format"),
  reason: z.string()
    .max(500, "Reason cannot exceed 500 characters")
    .optional()
    .nullable(),
  ipHash: z.string()
    .min(1, "IP hash is required")
});
