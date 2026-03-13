import express from "express";
import request from "supertest";
import { errorHandler } from "../src/middleware/error.middleware.js";

const mockPrisma = {
  report: {
    create: vi.fn(),
    count: vi.fn(),
  },
  comment: {
    update: vi.fn(),
  },
};

const mockHashIp = vi.fn();

vi.mock("../config/db.js", () => ({
  prisma: mockPrisma,
}));

vi.mock("../src/utils/hashIp.js", () => ({
  hashIp: mockHashIp,
}));

const { default: reportsRoutes } = await import("../src/routes/reports.routes.js");

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/reports", reportsRoutes);
  app.use(errorHandler);
  return app;
};

describe("reports controller integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHashIp.mockResolvedValue("hashed-ip");
  });

  test("creates a report and auto-hides the comment", async () => {
    mockPrisma.report.create.mockResolvedValue({});
    mockPrisma.report.count.mockResolvedValue(1);
    mockPrisma.comment.update.mockResolvedValue({});

    const res = await request(createApp())
      .post("/api/reports")
      .send({
        commentId: "123e4567-e89b-12d3-a456-426614174000",
        reason: "Spam content",
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ success: true });
    expect(mockPrisma.report.create).toHaveBeenCalledWith({
      data: {
        commentId: "123e4567-e89b-12d3-a456-426614174000",
        reason: "Spam content",
        ipHash: "hashed-ip",
      },
    });
    expect(mockPrisma.comment.update).toHaveBeenCalledWith({
      where: { id: "123e4567-e89b-12d3-a456-426614174000" },
      data: { status: "HIDDEN" },
    });
  });

  test("returns 400 when commentId is not a valid UUID", async () => {
    const res = await request(createApp())
      .post("/api/reports")
      .send({ commentId: "not-a-uuid" });

    expect(res.status).toBe(400);
    expect(mockPrisma.report.create).not.toHaveBeenCalled();
  });

  test("accepts a null reason", async () => {
    mockPrisma.report.create.mockResolvedValue({});
    mockPrisma.report.count.mockResolvedValue(1);
    mockPrisma.comment.update.mockResolvedValue({});

    const res = await request(createApp())
      .post("/api/reports")
      .send({
        commentId: "123e4567-e89b-12d3-a456-426614174000",
        reason: null,
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ success: true });
  });

  test("returns 500 when the database throws", async () => {
    mockPrisma.report.create.mockRejectedValue(new Error("DB error"));

    const res = await request(createApp())
      .post("/api/reports")
      .send({
        commentId: "123e4567-e89b-12d3-a456-426614174000",
        reason: "Bad content",
      });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Failed to report comment" });
  });
});
