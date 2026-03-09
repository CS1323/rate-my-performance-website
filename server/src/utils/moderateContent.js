import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Moderate comment content using Google Gemini AI
 * Scores toxicity/inappropriate content on a scale of 0-10
 * 
 * @param {string} content - Comment text to moderate
 * @returns {Promise<{score: number, status: string}>} - Score (0-10) and status (VISIBLE or HIDDEN)
 */
export const moderateContent = async (content) => {
  let score = 0;
  let status = "VISIBLE";

  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY not set. Defaulting to score=0, status=VISIBLE");
      return { score: 0, status: "VISIBLE" };
    }

    // Initialize Gemini API client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Create moderation prompt with detailed criteria
    const prompt = `You are a content moderator. Rate the following comment for toxicity, threats, or inappropriate content using these criteria:
- 0-2: Safe, no concerns
- 3-4: Mildly inappropriate but acceptable
- 5-6: Concerning language (insults, mild threats)
- 7-8: Dangerous content (threats of violence, self-harm mentions)
- 9-10: Severe threats or graphic content

Comment to rate:
"${content}"

Respond with ONLY a single digit (0-10):`;

    // Call Gemini API
    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 5,
        temperature: 0.0,
      },
    });

    // Extract and parse the score
    const rawText = response.response.text().trim();
    console.log("[MODERATION DEBUG] Raw response:", rawText); // Debug log
    console.log("[MODERATION DEBUG] Response text length:", rawText.length); // Debug log
    
    // Try to extract first number from response (handles multi-character responses)
    const numberMatch = rawText.match(/\d+/);
    
    if (numberMatch) {
      const extracted = parseInt(numberMatch[0], 10);
      score = Math.max(0, Math.min(10, extracted)); // Clamp to 0-10 range
      console.log("[MODERATION DEBUG] Extracted number:", numberMatch[0], "→ Final score:", score); // Debug log
    } else {
      console.warn("[MODERATION DEBUG] No number found in response:", rawText);
      score = 0; // Default to safe if no number found
    }

    // Hide if score >= 6 (threshold)
    if (score >= 6) {
      status = "HIDDEN";
    }

  } catch (err) {
    console.error("[MODERATION ERROR] LLM moderation failed:", err.message);
    if (err.message.includes("429") || err.message.includes("quota")) {
      console.warn("[MODERATION ALERT] API quota exceeded - using fallback (score=0)");
    }
    // Graceful fallback: default to safe
    score = 0;
    status = "VISIBLE";
  }

  return { score, status };
};
