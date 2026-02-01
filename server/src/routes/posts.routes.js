import express from "express";
import { getPost } from "../controllers/posts.controller.js";

const router = express.Router();

// GET /api/posts/:slug
router.get("/:slug", getPost)

export default router;