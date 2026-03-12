import bcrypt from "bcryptjs";
import { hashIp } from "./hashIp.js";

describe("hashIp", () => {
  test("returns a hash string that is not the raw IP", async () => {
    const ip = "192.168.0.1";

    const result = await hashIp(ip);

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(20);
    expect(result).not.toBe(ip);
  });

  test("generates different hashes for the same IP because bcrypt salts", async () => {
    const ip = "203.0.113.5";

    const first = await hashIp(ip);
    const second = await hashIp(ip);

    expect(first).not.toBe(second);
    expect(await bcrypt.compare(ip, first)).toBe(true);
    expect(await bcrypt.compare(ip, second)).toBe(true);
  });
});
