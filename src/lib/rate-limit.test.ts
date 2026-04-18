import { describe, it, expect, beforeEach, vi } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("rate limiter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-17T12:00:00Z"));
  });

  it("allows up to max hits per window", () => {
    const limiter = createRateLimiter({ max: 3, windowMs: 60_000 });
    expect(limiter.check("ip1").allowed).toBe(true);
    expect(limiter.check("ip1").allowed).toBe(true);
    expect(limiter.check("ip1").allowed).toBe(true);
    expect(limiter.check("ip1").allowed).toBe(false);
  });

  it("tracks IPs independently", () => {
    const limiter = createRateLimiter({ max: 1, windowMs: 60_000 });
    expect(limiter.check("ip1").allowed).toBe(true);
    expect(limiter.check("ip2").allowed).toBe(true);
    expect(limiter.check("ip1").allowed).toBe(false);
  });

  it("resets after window expires", () => {
    const limiter = createRateLimiter({ max: 1, windowMs: 1_000 });
    expect(limiter.check("ip1").allowed).toBe(true);
    expect(limiter.check("ip1").allowed).toBe(false);
    vi.advanceTimersByTime(1_500);
    expect(limiter.check("ip1").allowed).toBe(true);
  });
});
