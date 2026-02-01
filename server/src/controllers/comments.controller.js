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