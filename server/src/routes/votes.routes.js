import express from "express";

const router = express.Router();

// POST /api/votes
router.post("/", submitVote)