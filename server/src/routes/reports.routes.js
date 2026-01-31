import express from "express";

const router = express.Router();

// POST /api/reports
router.post("/", reportComment);