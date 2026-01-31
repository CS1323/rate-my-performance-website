import express from "express";

const router = express.Router();

// GET /api/quiz/cfu-boyfriend
router.get("/cfu-boyfriend", getQuiz);

// POST /api/quiz/cfu-boyfriend/submit
router.post("/cfu-boyfriend/submit", submitQuiz);