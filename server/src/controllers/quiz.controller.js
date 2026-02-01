// Example quiz questions
const quizDefinition = [
  { id: 1, question: "Pick a color", options: ["Red", "Blue", "Green"] },
  { id: 2, question: "Pick a hobby", options: ["Hockey", "Chess", "Reading"] },
];

/**
 * Get quiz questions
 */
const getQuiz = (req, res) => {
  res.status(200).json(quizDefinition);
}

/**
 * Submit quiz answers
 */
const submitQuiz = (req, res) => {
  const { answers } = req.body;
  // Placeholder scoring logic
  const result = "Your CFU boyfriend is the Star Goalie!";
  res.status(200).json({ result });
}

export { getQuiz, submitQuiz };