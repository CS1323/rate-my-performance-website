import express from "express";
import { submitVote } from "../controllers/votes.controller.js";

const router = express.Router();

// POST /api/votes
router.post("/", submitVote)

export default router;