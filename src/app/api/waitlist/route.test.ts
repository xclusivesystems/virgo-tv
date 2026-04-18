import { describe, it, expect, beforeEach, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

let tmpDir: string;

beforeEach(async () => {
  vi.resetModules();
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "virgo-api-"));
  process.env.WAITLIST_DB_PATH = path.join(tmpDir, "test.db");
});

async function loadRoute() {
  return await import("./route");
}

function makeRequest(body: unknown, ip = "203.0.113.7"): Request {
  return new Request("http://localhost/api/waitlist", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
      "user-agent": "vitest-ua",
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/waitlist", () => {
  it("accepts a valid email", async () => {
    const { POST } = await loadRoute();
    const res = await POST(makeRequest({ email: "ok@example.com" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.alreadyJoined).toBe(false);
  });

  it("returns alreadyJoined=true for duplicates (still 200)", async () => {
    const { POST } = await loadRoute();
    await POST(makeRequest({ email: "dup@example.com" }));
    const res = await POST(makeRequest({ email: "dup@example.com" }, "1.2.3.4"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.alreadyJoined).toBe(true);
  });

  it("rejects invalid email with 400", async () => {
    const { POST } = await loadRoute();
    const res = await POST(makeRequest({ email: "not-an-email" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("rejects missing email with 400", async () => {
    const { POST } = await loadRoute();
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it("rate-limits after 5 hits per IP per hour", async () => {
    const { POST } = await loadRoute();
    const ip = "198.51.100.42";
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeRequest({ email: `a${i}@example.com` }, ip));
      expect(res.status).toBe(200);
    }
    const sixth = await POST(makeRequest({ email: "a6@example.com" }, ip));
    expect(sixth.status).toBe(429);
  });
});
