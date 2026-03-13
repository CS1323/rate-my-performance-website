import express from "express";
import request from "supertest";
import { errorHandler } from "../src/middleware/error.middleware.js";

const mockPrisma = {
  comment: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
  },
  report: {
    create: vi.fn(),
  },
};

const mockModerateContent = vi.fn();

vi.mock("../config/db.js", () => ({
  prisma: mockPrisma,
}));

vi.mock("../src/utils/moderateContent.js", () => ({
  moderateContent: mockModerateContent,
}));

const { buildReplyTree } = await import("../src/controllers/comments.controller.js");
const { default: commentsRoutes } = await import("../src/routes/comments.routes.js");

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/comments", commentsRoutes);
  app.use(errorHandler);
  return app;
};

describe("comments controller integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("buildReplyTree nests replies recursively in chronological order", () => {
    const comments = [
      {
        id: "parent-1",
        parentCommentId: null,
        createdAt: "2026-03-12T10:00:00.000Z",
      },
      {
        id: "reply-2",
        parentCommentId: "parent-1",
        createdAt: "2026-03-12T10:02:00.000Z",
      },
      {
        id: "reply-1",
        parentCommentId: "parent-1",
        createdAt: "2026-03-12T10:01:00.000Z",
      },
      {
        id: "child-1",
        parentCommentId: "reply-1",
        createdAt: "2026-03-12T10:03:00.000Z",
      },
    ];

    const tree = buildReplyTree(comments);

    expect(tree).toHaveLength(1);
    expect(tree[0].replies.map((reply) => reply.id)).toEqual(["reply-1", "reply-2"]);
    expect(tree[0].replies[0].replies[0].id).toBe("child-1");
  });

  test("returns paginated nested comments for a post", async () => {
    const postId = "123e4567-e89b-12d3-a456-426614174000";
    mockPrisma.comment.findMany
      .mockResolvedValueOnce([
        {
          id: "parent-1",
          postId,
          parentCommentId: null,
          content: "Top comment",
          likeCount: 4,
          dislikeCount: 1,
          createdAt: "2026-03-12T10:00:00.000Z",
        },
      ])
      .mockResolvedValueOnce([
        {
          id: "parent-1",
          postId,
          parentCommentId: null,
          content: "Top comment",
          likeCount: 4,
          dislikeCount: 1,
          createdAt: "2026-03-12T10:00:00.000Z",
        },
        {
          id: "reply-1",
          postId,
          parentCommentId: "parent-1",
          content: "Reply",
          likeCount: 0,
          dislikeCount: 0,
          createdAt: "2026-03-12T10:01:00.000Z",
        },
      ]);
    mockPrisma.comment.count.mockResolvedValue(1);

    const res = await request(createApp()).get(`/api/comments/post/${postId}`);

    expect(res.status).toBe(200);
    expect(res.body.pagination.totalCount).toBe(1);
    expect(res.body.comments).toHaveLength(1);
    expect(res.body.comments[0].replies[0].id).toBe("reply-1");
  });

  test("creates a top-level comment after moderation", async () => {
    const postId = "123e4567-e89b-12d3-a456-426614174000";
    const createdComment = {
      id: "comment-1",
      postId,
      content: "Nice post",
      authorName: "Casey",
      avatarId: 2,
      status: "VISIBLE",
      llmScore: 1,
    };
    mockModerateContent.mockResolvedValue({ score: 1, status: "VISIBLE", reason: "ok" });
    mockPrisma.comment.create.mockResolvedValue(createdComment);

    const res = await request(createApp())
      .post(`/api/comments/post/${postId}`)
      .send({ content: "Nice post", authorName: "Casey", avatarId: 2 });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(createdComment);
    expect(mockModerateContent).toHaveBeenCalledWith("Nice post");
    expect(mockPrisma.comment.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        postId,
        parentCommentId: null,
        content: "Nice post",
        authorName: "Casey",
        avatarId: 2,
        status: "VISIBLE",
        llmScore: 1,
      }),
    });
  });

  test("creates an auto-moderation report when a comment is hidden", async () => {
    const postId = "123e4567-e89b-12d3-a456-426614174000";
    mockModerateContent.mockResolvedValue({
      score: 10,
      status: "HIDDEN",
      reason: "Auto-moderated: keyword",
    });
    mockPrisma.comment.create.mockResolvedValue({ id: "comment-2" });

    const res = await request(createApp())
      .post(`/api/comments/post/${postId}`)
      .send({ content: "hidden content", authorName: "Casey", avatarId: 2 });

    expect(res.status).toBe(201);
    expect(mockPrisma.report.create).toHaveBeenCalledWith({
      data: {
        commentId: "comment-2",
        reason: "Auto-moderated: keyword",
        ipHash: "system-llm",
      },
    });
  });

  test("returns 404 when replying to a missing parent comment", async () => {
    const commentId = "123e4567-e89b-12d3-a456-426614174000";
    mockPrisma.comment.findUnique.mockResolvedValue(null);

    const res = await request(createApp())
      .post(`/api/comments/${commentId}/reply`)
      .send({ content: "Reply", authorName: "Casey", avatarId: 1 });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Parent comment not found" });
  });
});
