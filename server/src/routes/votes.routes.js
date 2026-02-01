import express from "express";
import { submitVote, getUserVotes } from "../controllers/votes.controller.js";

const router = express.Router();

// POST /api/votes - cast a vote
router.post("/", submitVote);

// GET /api/votes/:postId - get current user's votes for a post (via ipHash query param)
router.get("/:postId", getUserVotes);

export default router;