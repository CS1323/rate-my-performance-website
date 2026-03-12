import {
  createCommentSchema,
  getCommentsByPostSchema,
  replyToCommentSchema,
} from "./comments.validators.js";

describe("comments validators", () => {
  test("createCommentSchema accepts valid payload", () => {
    const result = createCommentSchema.safeParse({
      content: "Great post",
      authorName: "Chris",
      avatarId: 2,
    });

    expect(result.success).toBe(true);
  });

  test("createCommentSchema rejects invalid avatar and empty content", () => {
    const result = createCommentSchema.safeParse({
      content: "",
      authorName: "Chris",
      avatarId: 5,
    });

    expect(result.success).toBe(false);
  });

  test("replyToCommentSchema rejects overly long authorName", () => {
    const result = replyToCommentSchema.safeParse({
      content: "reply",
      authorName: "a".repeat(51),
      avatarId: 1,
    });

    expect(result.success).toBe(false);
  });

  test("getCommentsByPostSchema coerces query values and applies defaults", () => {
    const result = getCommentsByPostSchema.safeParse({
      postId: "123e4567-e89b-12d3-a456-426614174000",
      page: "3",
      limit: "20",
    });

    expect(result.success).toBe(true);
    expect(result.data.page).toBe(3);
    expect(result.data.limit).toBe(20);
    expect(result.data.sort).toBe("top");
  });

  test("getCommentsByPostSchema catches invalid values safely", () => {
    const result = getCommentsByPostSchema.safeParse({
      postId: "123e4567-e89b-12d3-a456-426614174000",
      sort: "bad-sort",
      page: "bad-page",
      limit: "999",
    });

    expect(result.success).toBe(true);
    expect(result.data.sort).toBe("top");
    expect(result.data.page).toBe(1);
    expect(result.data.limit).toBe(10);
  });
});
