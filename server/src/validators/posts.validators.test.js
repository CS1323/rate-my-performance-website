import { getPostSchema } from "./posts.validators.js";

describe("posts validator", () => {
  test("accepts a valid slug", () => {
    const result = getPostSchema.safeParse({
      slug: "my-first-post",
    });

    expect(result.success).toBe(true);
  });

  test("rejects an empty slug", () => {
    const result = getPostSchema.safeParse({
      slug: "",
    });

    expect(result.success).toBe(false);
  });

  test("rejects a slug longer than 255 characters", () => {
    const result = getPostSchema.safeParse({
      slug: "a".repeat(256),
    });

    expect(result.success).toBe(false);
  });
});
