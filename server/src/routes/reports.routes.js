import express from "express";
import { reportComment } from "../controllers/reports.controller.js";

const router = express.Router();

// POST /api/reports
router.post("/", reportComment);

export default router;