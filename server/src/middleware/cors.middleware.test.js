import express from "express";
import request from "supertest";

const buildAppWithCors = async (corsOrigin) => {
  if (corsOrigin === undefined) {
    delete process.env.CORS_ORIGIN;
  } else {
    process.env.CORS_ORIGIN = corsOrigin;
  }

  vi.resetModules();
  const { corsMiddleware } = await import("./cors.middleware.js");

  const app = express();
  app.use(corsMiddleware);
  app.get("/health", (req, res) => {
    res.status(200).json({ ok: true });
  });

  return app;
};

describe("corsMiddleware", () => {
  test("allows configured origin when CORS_ORIGIN has a comma-separated list", async () => {
    const app = await buildAppWithCors("http://localhost:5173, https://example.com");

    const res = await request(app)
      .get("/health")
      .set("Origin", "https://example.com");

    expect(res.status).toBe(200);
    expect(res.headers["access-control-allow-origin"]).toBe("https://example.com");
  });

  test("falls back when CORS_ORIGIN is not set", async () => {
    const app = await buildAppWithCors(undefined);

    const res = await request(app)
      .get("/health")
      .set("Origin", "http://localhost:5173");

    expect(res.status).toBe(200);
    expect(res.headers["access-control-allow-origin"]).toBeDefined();
  });
});
