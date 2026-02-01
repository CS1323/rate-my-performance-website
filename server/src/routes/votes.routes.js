import express from "express";
import { submitVote } from "../controllers/votes.controller";

const router = express.Router();

// POST /api/votes
router.post("/", submitVote)