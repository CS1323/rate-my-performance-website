import { z } from "zod";
import { validateRequest } from "./validateRequest.js";

const createRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("validateRequest middleware", () => {
  test("calls next for valid merged body/params/query data", () => {
    const schema = z.object({
      postId: z.string().uuid(),
      page: z.coerce.number().int().min(1),
      content: z.string().min(1),
    });

    const middleware = validateRequest(schema);
    const req = {
      body: { content: "hello" },
      params: { postId: "123e4567-e89b-12d3-a456-426614174000" },
      query: { page: "2" },
    };
    const res = createRes();
    const next = vi.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("returns 400 with formatted field error messages for invalid data", () => {
    const schema = z.object({
      postId: z.string().uuid(),
      content: z.string().min(1, "Content cannot be empty"),
    });

    const middleware = validateRequest(schema);
    const req = {
      body: { content: "" },
      params: { postId: "bad-id" },
      query: {},
    };
    const res = createRes();
    const next = vi.fn();

    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);

    const payload = res.json.mock.calls[0][0];
    expect(payload).toHaveProperty("message");
    expect(payload.message).toContain("postId");
    expect(payload.message).toContain("content");
  });
});
