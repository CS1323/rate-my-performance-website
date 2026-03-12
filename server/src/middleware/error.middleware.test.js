import { Prisma } from "@prisma/client";
import { errorHandler, notFound } from "./error.middleware.js";

const createRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("notFound middleware", () => {
  test("forwards 404 error with route in message", () => {
    const req = { originalUrl: "/missing/route" };
    const res = {};
    const next = vi.fn();

    notFound(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.statusCode).toBe(404);
    expect(err.message).toContain("/missing/route");
  });
});

describe("errorHandler middleware", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  test("returns generic error payload without stack in production", () => {
    process.env.NODE_ENV = "production";
    const err = new Error("boom");
    const req = {};
    const res = createRes();

    errorHandler(err, req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "boom",
    });
  });

  test("includes stack in development mode", () => {
    process.env.NODE_ENV = "development";
    const err = new Error("dev boom");
    const req = {};
    const res = createRes();

    errorHandler(err, req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    const payload = res.json.mock.calls[0][0];
    expect(payload.message).toBe("dev boom");
    expect(payload.stack).toBeTypeOf("string");
  });

  test("maps Prisma P2002 to duplicate field response", () => {
    const err = new Prisma.PrismaClientKnownRequestError("Unique failed", {
      code: "P2002",
      clientVersion: "6.19.2",
      meta: { target: ["email"] },
    });
    const req = {};
    const res = createRes();

    errorHandler(err, req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "email already exists" })
    );
  });

  test("maps Prisma P2025 to not found", () => {
    const err = new Prisma.PrismaClientKnownRequestError("Missing", {
      code: "P2025",
      clientVersion: "6.19.2",
    });
    const req = {};
    const res = createRes();

    errorHandler(err, req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Record not found" })
    );
  });

  test("maps Prisma P2003 to invalid reference", () => {
    const err = new Prisma.PrismaClientKnownRequestError("FK failed", {
      code: "P2003",
      clientVersion: "6.19.2",
    });
    const req = {};
    const res = createRes();

    errorHandler(err, req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Invalid reference: related record does not exist",
      })
    );
  });

  test("maps Prisma validation errors to invalid data", () => {
    const err = new Prisma.PrismaClientValidationError("Validation failed", {
      clientVersion: "6.19.2",
    });
    const req = {};
    const res = createRes();

    errorHandler(err, req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Invalid data provided" })
    );
  });
});
