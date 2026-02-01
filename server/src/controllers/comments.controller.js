import { prisma } from "../../config/db.js";

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

    const comment = await prisma.comment.create({
      data: {
        postId,
        parentCommentId: null, // top-level comment
        content,
        authorName,
        avatarId,
      },
    });

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

    const reply = await prisma.comment.create({
      data: {
        postId: parent.postId,
        parentCommentId: commentId,
        content,
        authorName,
        avatarId,
      },
    });

    res.status(201).json(reply);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create reply" });
  }
}

/**
 * Get all comments for a post (nested tree)
 */
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Fetch flat list of comments
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: [{ createdAt: "asc" }],
    });

    // Build nested tree
    const map = new Map();
    const roots = [];

    for (const comment of comments) {
      comment.replies = [];
      map.set(comment.id, comment);

      if (!comment.parentCommentId) roots.push(comment);
      else {
        const parent = map.get(comment.parentCommentId);
        if (parent) parent.replies.push(comment);
      }
    }

    res.status(200).json(roots);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
}

export { createComment, replyToComment, getCommentsByPost };