import express from "express";
import { reportComment } from "../controllers/reports.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { reportCommentSchema } from "../validators/reports.validators.js";
import { strictLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

// POST /api/reports
router.post("/", strictLimiter, validateRequest(reportCommentSchema), reportComment);

export default router;