import express from "express";
import request from "supertest";
import { errorHandler } from "../src/middleware/error.middleware.js";

const mockPrisma = {
  post: {
    findUnique: vi.fn(),
  },
};

vi.mock("../config/db.js", () => ({
  prisma: mockPrisma,
}));

const { default: postsRoutes } = await import("../src/routes/posts.routes.js");

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/posts", postsRoutes);
  app.use(errorHandler);
  return app;
};

describe("posts controller integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("returns a post when the slug exists", async () => {
    const post = { id: "post-1", slug: "welcome-post", title: "Welcome" };
    mockPrisma.post.findUnique.mockResolvedValue(post);

    const res = await request(createApp()).get("/api/posts/welcome-post");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(post);
    expect(mockPrisma.post.findUnique).toHaveBeenCalledWith({
      where: { slug: "welcome-post" },
    });
  });

  test("returns 404 when the slug does not exist", async () => {
    mockPrisma.post.findUnique.mockResolvedValue(null);

    const res = await request(createApp()).get("/api/posts/missing-post");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Post not found" });
  });

  test("returns 400 when the slug exceeds the validator limit", async () => {
    const longSlug = "a".repeat(256);

    const res = await request(createApp()).get(`/api/posts/${longSlug}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("slug");
    expect(mockPrisma.post.findUnique).not.toHaveBeenCalled();
  });

  test("returns 500 when prisma throws", async () => {
    mockPrisma.post.findUnique.mockRejectedValue(new Error("db offline"));

    const res = await request(createApp()).get("/api/posts/welcome-post");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Failed to fetch post" });
  });
});
