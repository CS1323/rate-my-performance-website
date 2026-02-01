import { prisma } from "../../config/db.js";
import { hashIp } from "../utils/hashIp.js";

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
    
    if (reportCount >= 5) {
      await prisma.comment.update({
        where: { id: commentId },
        data: { status: "HIDDEN" },
      });
    }

    res.status(201).json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to report comment" });
  }
}