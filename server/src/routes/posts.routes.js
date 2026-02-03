import express from "express";
import { getPost } from "../controllers/posts.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { getPostSchema } from "../validators/posts.validators.js";

const router = express.Router();

// GET /api/posts/:slug
router.get("/:slug", validateRequest(getPostSchema), getPost)

export default router;