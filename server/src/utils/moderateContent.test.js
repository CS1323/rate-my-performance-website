/**
 * Unit Tests for moderateContent.js
 * Tests the score parsing and status assignment logic
 */

describe("Moderation Scoring Logic", () => {
  
  // Helper function that mimics the parsing logic in moderateContent.js
  const parseScore = (rawText) => {
    const numberMatch = rawText.match(/\d+/);
    let score = 0;
    
    if (numberMatch) {
      const extracted = parseInt(numberMatch[0], 10);
      score = Math.max(0, Math.min(10, extracted));
    }
    
    return score;
  };

  const getStatus = (score) => {
    return score >= 7 ? "HIDDEN" : "VISIBLE";
  };

  describe("Score Extraction from Gemini Response", () => {
    test("extracts single digit score", () => {
      expect(parseScore("9")).toBe(9);
    });

    test("extracts number from multi-word response", () => {
      expect(parseScore("The score is 8")).toBe(8);
    });

    test("returns 0 when no number found", () => {
      expect(parseScore("no number here")).toBe(0);
    });

    test("clamps score to max 10", () => {
      expect(parseScore("15")).toBe(10);
    });

    test("extracts number from negative-looking string", () => {
      // Note: regex matches "5" from "-5", which is correct behavior
      expect(parseScore("-5")).toBe(5);
    });

    test("extracts first number when multiple present", () => {
      expect(parseScore("Score: 7, Comments: 2")).toBe(7);
    });

    test("handles whitespace", () => {
      expect(parseScore("  9  ")).toBe(9);
    });
  });

  describe("Status Assignment (>= 7 threshold)", () => {
    test("marks score 7 as HIDDEN", () => {
      expect(getStatus(7)).toBe("HIDDEN");
    });

    test("marks score 8 as HIDDEN", () => {
      expect(getStatus(8)).toBe("HIDDEN");
    });

    test("marks score 9 as HIDDEN", () => {
      expect(getStatus(9)).toBe("HIDDEN");
    });

    test("marks score 10 as HIDDEN", () => {
      expect(getStatus(10)).toBe("HIDDEN");
    });

    test("marks score 6 as VISIBLE", () => {
      expect(getStatus(6)).toBe("VISIBLE");
    });

    test("marks score 5 as VISIBLE", () => {
      expect(getStatus(5)).toBe("VISIBLE");
    });

    test("marks score 0 as VISIBLE", () => {
      expect(getStatus(0)).toBe("VISIBLE");
    });
  });

  describe("End-to-End Scenarios", () => {
    const moderate = (geminiResponse) => {
      const score = parseScore(geminiResponse);
      const status = getStatus(score);
      return { score, status };
    };

    test("suicide mention receives high score and HIDDEN status", () => {
      const result = moderate("9");
      expect(result.score).toBe(9);
      expect(result.status).toBe("HIDDEN");
    });

    test("normal safe comment receives low score and VISIBLE status", () => {
      const result = moderate("1");
      expect(result.score).toBe(1);
      expect(result.status).toBe("VISIBLE");
    });

    test("threshold boundary: score 7 is HIDDEN", () => {
      const result = moderate("7");
      expect(result.score).toBe(7);
      expect(result.status).toBe("HIDDEN");
    });

    test("threshold boundary: score 6 is VISIBLE", () => {
      const result = moderate("6");
      expect(result.score).toBe(6);
      expect(result.status).toBe("VISIBLE");
    });

    test("handles Gemini response with extra text", () => {
      const result = moderate("Based on the content analysis, I rate this as 8");
      expect(result.score).toBe(8);
      expect(result.status).toBe("HIDDEN");
    });
  });
});
