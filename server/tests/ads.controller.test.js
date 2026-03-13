import express from "express";
import request from "supertest";

const { default: adsRoutes } = await import("../src/routes/ads.routes.js");

const app = express();
app.use("/api/ads", adsRoutes);

describe("ads controller integration", () => {
  test("returns 200 with all three hardcoded ads", async () => {
    const res = await request(app).get("/api/ads");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  });

  test("each ad has the required fields", async () => {
    const res = await request(app).get("/api/ads");

    for (const ad of res.body) {
      expect(ad).toHaveProperty("id");
      expect(ad).toHaveProperty("imageUrl");
      expect(ad).toHaveProperty("link");
      expect(ad).toHaveProperty("alt");
      expect(ad.imageUrl).toMatch(/^\/images\//);
      expect(ad.link).toMatch(/^https:\/\//);
    }
  });
});
