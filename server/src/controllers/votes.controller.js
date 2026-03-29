import { prisma } from "../../config/db.js";
import { hashIp } from "../utils/hashIp.js";
import logger from "../utils/logger.js";

/**
 * Cast, change, or remove a vote on a comment
 */
export const submitVote = async (req, res) => {
  try {
    const { commentId, type, ipHash } = req.body; // type = 'LIKE' or 'DISLIKE', ipHash from frontend
    if (!ipHash) {
      return res.status(400).json({ error: 'ipHash required' });
    }

    // Check for existing vote by this IP
    const existingVote = await prisma.vote.findUnique({
      where: { commentId_ipHash: { commentId, ipHash } },
    });

    if (!existingVote) {
      // First-time vote
      await prisma.$transaction([
        prisma.vote.create({ data: { commentId, ipHash, type } }),

        prisma.comment.update({
          where: { id: commentId },
          data: {
            likeCount: type === "LIKE" 
              ? { increment: 1 } 
              : undefined,
            dislikeCount: type === "DISLIKE" 
              ? { increment: 1 } 
              : undefined,
          },
        }),
      ]);

    } else if (existingVote.type !== type) {
      // Switch vote: decrement previous, increment new
      await prisma.$transaction([
        prisma.vote.update({ where: { id: existingVote.id }, data: { type } }),
        
        prisma.comment.update({
          where: { id: commentId },
          data: {
            likeCount:
              type === "LIKE"
                ? { increment: 1, decrement: 1 } // +1 LIKE, -1 DISLIKE
                : { decrement: 1 }, // -1 LIKE if switching to DISLIKE
            dislikeCount:
              type === "DISLIKE"
                ? { increment: 1, decrement: 1 } // +1 DISLIKE, -1 LIKE
                : { decrement: 1 }, // -1 DISLIKE if switching to LIKE
          },
        }),
      ]);

    } else {
      // Remove vote if same as previous
      await prisma.$transaction([
        prisma.vote.delete({ where: { id: existingVote.id } }),

        prisma.comment.update({
          where: { id: commentId },
          data: {
            likeCount: type === "LIKE" 
              ? { decrement: 1 } : undefined,
            dislikeCount: type === "DISLIKE" 
              ? { decrement: 1 } : undefined,
          },
        }),
      ]);
    }

    res.status(201).json({ success: true });

  } catch (err) {
    logger.error("Error casting vote:", { error: err.message, stack: err.stack });
    res.status(500).json({ error: "Failed to cast vote" });
  }
};

/**
 * Get the current user's votes for a specific post
 */
export const getUserVotes = async (req, res) => {
  try {
    const { postId } = req.params;
    const { ipHash } = req.query;

    if (!ipHash) {
      return res.status(400).json({ error: "ipHash required" });
    }

    // Get all votes from this IP on comments in this post
    const userVotes = await prisma.vote.findMany({
      where: {
        comment: {
          postId: postId,
        },
        ipHash: ipHash,
      },
    });

    // Convert to object format: { commentId: voteType }
    const voteMap = {};
    userVotes.forEach((vote) => {
      voteMap[vote.commentId] = vote.type;
    });

    res.json(voteMap);
  } catch (err) {
    logger.error("Error fetching user votes:", { error: err.message, stack: err.stack });
    res.status(500).json({ error: "Failed to fetch user votes" });
  }
};