import express from "express";
import request from "supertest";
import { errorHandler } from "../src/middleware/error.middleware.js";

const mockPrisma = {
  vote: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findMany: vi.fn(),
  },
  comment: {
    update: vi.fn(),
  },
  $transaction: vi.fn(),
};

vi.mock("../config/db.js", () => ({
  prisma: mockPrisma,
}));

const { default: votesRoutes } = await import("../src/routes/votes.routes.js");

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/votes", votesRoutes);
  app.use(errorHandler);
  return app;
};

describe("votes controller integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma.$transaction.mockImplementation(async (operations) => Promise.all(operations));
  });

  test("creates a new vote when none exists", async () => {
    mockPrisma.vote.findUnique.mockResolvedValue(null);
    mockPrisma.vote.create.mockResolvedValue({ id: "vote-1" });
    mockPrisma.comment.update.mockResolvedValue({ id: "comment-1" });

    const res = await request(createApp())
      .post("/api/votes")
      .send({
        commentId: "123e4567-e89b-12d3-a456-426614174000",
        type: "LIKE",
        ipHash: "hashed-ip",
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ success: true });
    expect(mockPrisma.vote.create).toHaveBeenCalled();
    expect(mockPrisma.comment.update).toHaveBeenCalledWith({
      where: { id: "123e4567-e89b-12d3-a456-426614174000" },
      data: {
        likeCount: { increment: 1 },
        dislikeCount: undefined,
      },
    });
  });

  test("switches an existing vote", async () => {
    mockPrisma.vote.findUnique.mockResolvedValue({ id: "vote-1", type: "LIKE" });
    mockPrisma.vote.update.mockResolvedValue({ id: "vote-1", type: "DISLIKE" });
    mockPrisma.comment.update.mockResolvedValue({ id: "comment-1" });

    const res = await request(createApp())
      .post("/api/votes")
      .send({
        commentId: "123e4567-e89b-12d3-a456-426614174000",
        type: "DISLIKE",
        ipHash: "hashed-ip",
      });

    expect(res.status).toBe(201);
    expect(mockPrisma.vote.update).toHaveBeenCalledWith({
      where: { id: "vote-1" },
      data: { type: "DISLIKE" },
    });
    expect(mockPrisma.comment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          likeCount: { decrement: 1 },
          dislikeCount: { increment: 1, decrement: 1 },
        },
      })
    );
  });

  test("removes a vote when the same vote is submitted again", async () => {
    mockPrisma.vote.findUnique.mockResolvedValue({ id: "vote-1", type: "LIKE" });
    mockPrisma.vote.delete.mockResolvedValue({ id: "vote-1" });
    mockPrisma.comment.update.mockResolvedValue({ id: "comment-1" });

    const res = await request(createApp())
      .post("/api/votes")
      .send({
        commentId: "123e4567-e89b-12d3-a456-426614174000",
        type: "LIKE",
        ipHash: "hashed-ip",
      });

    expect(res.status).toBe(201);
    expect(mockPrisma.vote.delete).toHaveBeenCalledWith({ where: { id: "vote-1" } });
    expect(mockPrisma.comment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          likeCount: { decrement: 1 },
          dislikeCount: undefined,
        },
      })
    );
  });

  test("returns user vote map for a post", async () => {
    mockPrisma.vote.findMany.mockResolvedValue([
      { commentId: "comment-1", type: "LIKE" },
      { commentId: "comment-2", type: "DISLIKE" },
    ]);

    const res = await request(createApp()).get(
      "/api/votes/123e4567-e89b-12d3-a456-426614174000?ipHash=hashed-ip"
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      "comment-1": "LIKE",
      "comment-2": "DISLIKE",
    });
  });
});
