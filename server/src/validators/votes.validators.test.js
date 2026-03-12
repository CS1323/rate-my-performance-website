import {
  getUserVotesSchema,
  submitVoteSchema,
} from "./votes.validators.js";

describe("votes validators", () => {
  test("submitVoteSchema accepts valid LIKE vote", () => {
    const result = submitVoteSchema.safeParse({
      commentId: "123e4567-e89b-12d3-a456-426614174000",
      type: "LIKE",
      ipHash: "hashed-ip-value",
    });

    expect(result.success).toBe(true);
  });

  test("submitVoteSchema rejects invalid vote type", () => {
    const result = submitVoteSchema.safeParse({
      commentId: "123e4567-e89b-12d3-a456-426614174000",
      type: "UP",
      ipHash: "hashed-ip-value",
    });

    expect(result.success).toBe(false);
  });

  test("getUserVotesSchema requires valid postId and ipHash", () => {
    const result = getUserVotesSchema.safeParse({
      postId: "not-a-uuid",
      ipHash: "",
    });

    expect(result.success).toBe(false);
  });
});
