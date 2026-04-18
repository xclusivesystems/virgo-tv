export interface RateLimiterOptions {
  max: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export interface RateLimiter {
  check(key: string): RateLimitResult;
}

export function createRateLimiter(opts: RateLimiterOptions): RateLimiter {
  const buckets = new Map<string, { count: number; resetAt: number }>();

  return {
    check(key) {
      const now = Date.now();
      const existing = buckets.get(key);
      if (!existing || existing.resetAt <= now) {
        const fresh = { count: 1, resetAt: now + opts.windowMs };
        buckets.set(key, fresh);
        return { allowed: true, remaining: opts.max - 1, resetAt: fresh.resetAt };
      }
      if (existing.count >= opts.max) {
        return { allowed: false, remaining: 0, resetAt: existing.resetAt };
      }
      existing.count += 1;
      return {
        allowed: true,
        remaining: opts.max - existing.count,
        resetAt: existing.resetAt,
      };
    },
  };
}

export const waitlistRateLimiter = createRateLimiter({
  max: 5,
  windowMs: 60 * 60 * 1000,
});
