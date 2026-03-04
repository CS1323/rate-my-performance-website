import { prisma } from "../../config/db.js";
import OpenAI from "openai";
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
    let score = 0;
    let status = "VISIBLE";
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const prompt = `Rate the following comment for toxicity, threats, or inappropriate content on a scale from 0 (safe) to 10 (extremely unsafe):\n"""${content}"""\nScore:`;
      const response = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt,
        max_tokens: 1,
        temperature: 0.0,
        n: 1,
        stop: ["\n"]
      });
      const raw = response.choices[0].text.trim();
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed)) score = parsed;

      // Hide if score >= 7 (threshold)
      if (score >= 7) status = "HIDDEN";

    } catch (llmErr) {
      console.error("LLM moderation failed:", llmErr);
      score = 0;
      status = "VISIBLE";
    }

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
            reason: "Auto-moderated by LLM",
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
    let score = 0;
    let status = "VISIBLE";
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const prompt = `Rate the following comment for toxicity, threats, or inappropriate content on a scale from 0 (safe) to 10 (extremely unsafe):\n"""${content}"""\nScore:`;

      const response = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt,
        max_tokens: 1,
        temperature: 0.0,
        n: 1,
        stop: ["\n"]
      });

      const raw = response.choices[0].text.trim();
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed)) score = parsed;
      if (score >= 7) status = "HIDDEN";

    } catch (llmErr) {
      console.error("LLM moderation failed:", llmErr);
      score = 0;
      status = "VISIBLE";
    }

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
            reason: "Auto-moderated by LLM",
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
 * Recursively fetch all nested replies for a comment
 */
const fetchNestedReplies = async (commentId) => {
  const replies = await prisma.comment.findMany({
    where: { parentCommentId: commentId },
    orderBy: [{ createdAt: "asc" }],
  });

  // Recursively fetch replies of replies
  const repliesWithNested = await Promise.all(
    replies.map(async (reply) => {
      const nestedReplies = await fetchNestedReplies(reply.id);
      return { ...reply, replies: nestedReplies };
    })
  );

  return repliesWithNested;
};

/**
 * Get all comments for a post with pagination and sorting
 */
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { sort = 'top', page = '1', limit = '10' } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, Math.min(50, parseInt(limit, 10) || 10)); // Cap at 50
    const skip = (pageNum - 1) * pageSize;

    // Fetch top-level comments only (no parentCommentId)
    const topLevelComments = await prisma.comment.findMany({
      where: { postId, parentCommentId: null },
      skip,
      take: pageSize,
      orderBy: [{ createdAt: "asc" }],
    });

    // For each top-level comment, recursively fetch all nested replies
    const commentsWithReplies = await Promise.all(
      topLevelComments.map(async (comment) => {
        const replies = await fetchNestedReplies(comment.id);
        return { ...comment, replies };
      })
    );

    // Sort top-level comments by requested sort mode
    if (sort === 'latest') {
      commentsWithReplies.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else {
      // Default: 'top' sorting by score
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

export { createComment, replyToComment, getCommentsByPost };