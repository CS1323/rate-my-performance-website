import { reportCommentSchema } from "./reports.validators.js";

describe("reports validator", () => {
  test("accepts valid report payload with reason", () => {
    const result = reportCommentSchema.safeParse({
      commentId: "123e4567-e89b-12d3-a456-426614174000",
      reason: "Harassment",
    });

    expect(result.success).toBe(true);
  });

  test("accepts null reason", () => {
    const result = reportCommentSchema.safeParse({
      commentId: "123e4567-e89b-12d3-a456-426614174000",
      reason: null,
    });

    expect(result.success).toBe(true);
  });

  test("rejects invalid UUID and too-long reason", () => {
    const result = reportCommentSchema.safeParse({
      commentId: "bad-id",
      reason: "a".repeat(501),
    });

    expect(result.success).toBe(false);
  });
});
