import express from "express";
import { reportComment } from "../controllers/reports.controller";

const router = express.Router();

// POST /api/reports
router.post("/", reportComment);