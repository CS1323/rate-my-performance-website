import { prisma } from "../../config/db.js";
import { hashIp } from "../utils/hashIp.js";
import logger from "../utils/logger.js";

/**
 * Report a comment for moderation
 */
export const reportComment = async (req, res) => {
  try {
    const { commentId, reason } = req.body;
    const ipHash = await hashIp(req.ip);

    await prisma.report.create({
      data: { commentId, reason, ipHash },
    });

    // Auto-hide if reports exceed threshold
    const reportCount = await prisma.report.count({ where: { commentId } });
    
    if (reportCount >= 1) {
      await prisma.comment.update({
        where: { id: commentId },
        data: { status: "HIDDEN" },
      });
    }

    res.status(201).json({ success: true });

  } catch (err) {
    logger.error("Error reporting comment:", { error: err.message, stack: err.stack });
    res.status(500).json({ error: "Failed to report comment" });
  }
}