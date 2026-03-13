import { prisma } from "../../config/db.js";
import { moderateContent } from "../utils/moderateContent.js";
import dotenv from "dotenv";
dotenv.config();

/**
 * Create a top-level comment
 */
const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, authorName, avatarId } = req.body;

    // Validate input
    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Content cannot be empty" });
    }

    // LLM moderation: score the comment content
    const { score, status, reason } = await moderateContent(content);

    const comment = await prisma.comment.create({
      data: {
        postId,
        parentCommentId: null, // top-level comment
        content,
        authorName,
        avatarId,
        status,
        llmScore: score,
      },
    });

    // If auto-hidden, create a report for audit/moderation
    if (status === "HIDDEN") {
      try {
        await prisma.report.create({
          data: {
            commentId: comment.id,
            reason: reason,
            ipHash: "system-llm"
          }
        });
      } catch (reportErr) {
        console.error("Failed to create auto-moderation report:", reportErr);
      }
    }

    res.status(201).json(comment);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create comment" });
  }
}

/**
 * Reply to an existing comment
 */
const replyToComment = async (req, res) => {
  try {
    const { commentId } = req.params; // parent comment ID
    const { content, authorName, avatarId } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Content required" });
    }

    const parent = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!parent) return res.status(404).json({ error: "Parent comment not found" });


    // LLM moderation: score the reply content
    const { score, status, reason } = await moderateContent(content);

    const reply = await prisma.comment.create({
      data: {
        postId: parent.postId,
        parentCommentId: commentId,
        content,
        authorName,
        avatarId,
        status,
        llmScore: score,
      },
    });

    if (status === "HIDDEN") {
      try {
        await prisma.report.create({
          data: {
            commentId: reply.id,
            reason: reason,
            ipHash: "system-llm"
          }
        });
      } catch (reportErr) {
        console.error("Failed to create auto-moderation report:", reportErr);
      }
    }

    res.status(201).json(reply);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create reply" });
  }
}

/**
 * Build nested reply tree from flat comment array in memory
 * Avoids N+1 queries by fetching all descendants upfront
 */
const buildReplyTree = (comments, parentId = null) => {
  return comments
    .filter(c => c.parentCommentId === parentId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map(comment => ({
      ...comment,
      replies: buildReplyTree(comments, comment.id)
    }));
};

/**
 * Get all comments for a post with pagination and sorting
 * Optimized: Fetch top-level comments + all descendants in 2 queries, build tree in memory
 */
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { sort = 'top', page = '1', limit = '10' } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, Math.min(50, parseInt(limit, 10) || 10)); // Cap at 50
    const skip = (pageNum - 1) * pageSize;

    // Query 1: Fetch top-level comments only (apply pagination here)
    const topLevelComments = await prisma.comment.findMany({
      where: { postId, parentCommentId: null },
      skip,
      take: pageSize,
    });

    // If no top-level comments, return early
    if (topLevelComments.length === 0) {
      const totalCount = await prisma.comment.count({
        where: { postId, parentCommentId: null },
      });
      const totalPages = Math.ceil(totalCount / pageSize);
      return res.status(200).json({
        comments: [],
        pagination: {
          currentPage: pageNum,
          pageSize,
          totalCount,
          totalPages,
          hasNextPage: pageNum < totalPages,
        }
      });
    }

    // Query 2: Fetch ALL comments for this post (top-level + all descendants)
    // This is efficient because it's a single database query, not N+1
    const allCommentsForPost = await prisma.comment.findMany({
      where: { postId },
    });

    // Build nested reply tree in memory from flat array
    // For each top-level comment on this page, get all its descendants
    const commentsWithReplies = topLevelComments.map(comment => ({
      ...comment,
      replies: buildReplyTree(allCommentsForPost, comment.id)
    }));

    // Sort top-level comments by requested sort mode
    if (sort === 'latest') {
      commentsWithReplies.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else {
      // Default: 'top' sorting by vote score
      commentsWithReplies.sort((a, b) => {
        const scoreA = (a.likeCount || 0) - (a.dislikeCount || 0);
        const scoreB = (b.likeCount || 0) - (b.dislikeCount || 0);
        return scoreB - scoreA;
      });
    }

    // Get total count for pagination metadata
    const totalCount = await prisma.comment.count({
      where: { postId, parentCommentId: null },
    });

    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = pageNum < totalPages;

    res.status(200).json({
      comments: commentsWithReplies,
      pagination: {
        currentPage: pageNum,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
}

export { createComment, replyToComment, getCommentsByPost, buildReplyTree };