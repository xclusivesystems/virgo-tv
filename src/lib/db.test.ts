import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { createWaitlistDb, type WaitlistDb } from "./db";

let tmpDir: string;
let db: WaitlistDb;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "virgo-db-"));
  db = createWaitlistDb(path.join(tmpDir, "test.db"));
});

afterEach(() => {
  db.close();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("waitlist db", () => {
  it("inserts a new email and returns created=true", () => {
    const result = db.addEmail({
      email: "test@example.com",
      ip: "1.2.3.4",
      userAgent: "ua",
    });
    expect(result.created).toBe(true);
    expect(result.alreadyJoined).toBe(false);
  });

  it("treats duplicate email as alreadyJoined, not error", () => {
    db.addEmail({ email: "dup@example.com", ip: "1.1.1.1", userAgent: "a" });
    const second = db.addEmail({
      email: "dup@example.com",
      ip: "2.2.2.2",
      userAgent: "b",
    });
    expect(second.created).toBe(false);
    expect(second.alreadyJoined).toBe(true);
  });

  it("is case-insensitive for dedupe", () => {
    db.addEmail({ email: "Case@Example.com", ip: "1", userAgent: "a" });
    const second = db.addEmail({
      email: "case@example.com",
      ip: "1",
      userAgent: "a",
    });
    expect(second.alreadyJoined).toBe(true);
  });

  it("counts total signups", () => {
    db.addEmail({ email: "a@x.com", ip: "1", userAgent: "a" });
    db.addEmail({ email: "b@x.com", ip: "1", userAgent: "a" });
    expect(db.count()).toBe(2);
  });
});
