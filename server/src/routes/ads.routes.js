import express from "express";
import { getAds } from "../controllers/ads.controller.js";

const router = express.Router();

/**
 * GET /api/ads
 * Get all ads
 */
router.get("/", getAds);

export default router;
