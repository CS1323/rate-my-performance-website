import { prisma } from "../../config/db.js";
import { hashIp } from "../utils/hashIp.js";

/**
 * Cast, change, or remove a vote on a comment
 */
export const submitVote = async (req, res) => {
  try {
    const { commentId, type } = req.body; // type = 'LIKE' or 'DISLIKE'
    const ipHash = await hashIp(req.ip);

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
      // Toggle vote
      await prisma.$transaction([
        prisma.vote.update({ where: { id: existingVote.id }, data: { type } }),

        prisma.comment.update({
          where: { id: commentId },
          data: {
            likeCount: type === "LIKE" 
              ? { increment: 1, decrement: 0 } 
              : { decrement: 1 },
            dislikeCount: type === "DISLIKE" 
              ? { increment: 1, decrement: 0 } 
              : { decrement: 1 },
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
    console.error(err);
    res.status(500).json({ error: "Failed to cast vote" });
  }
}