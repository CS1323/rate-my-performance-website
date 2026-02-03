import express from "express";
import { submitVote, getUserVotes } from "../controllers/votes.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { getUserVotesSchema, submitVoteSchema } from "../validators/votes.validators.js";

const router = express.Router();

// POST /api/votes - cast a vote
router.post("/", validateRequest(submitVoteSchema), submitVote);

// GET /api/votes/:postId - get current user's votes for a post (via ipHash query param)
router.get("/:postId", validateRequest(getUserVotesSchema), getUserVotes);

export default router;