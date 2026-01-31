import express from "express";

const router = express.Router();

// GET /api/posts/:slug
router.get("/:slug", getPostBySlug)