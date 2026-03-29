import { prisma } from "../../config/db.js";
import logger from "../utils/logger.js";

/**
 * Get the default post (single post site)
 */
export const getPost = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await prisma.post.findUnique({
      where: { slug },
    });    

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);

  } catch (err) {
    logger.error("Error fetching post:", { error: err.message, stack: err.stack });
    res.status(500).json({ error: "Failed to fetch post" });
  }
}
