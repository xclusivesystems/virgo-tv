import { NextResponse } from "next/server";
import { getWaitlistDb } from "@/lib/db";
import { isValidEmail } from "@/lib/email";
import { waitlistRateLimiter } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const ua = req.headers.get("user-agent") ?? "unknown";

  const rl = waitlistRateLimiter.check(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      },
    );
  }

  let body: { email?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON." },
      { status: 400 },
    );
  }

  const rawEmail = typeof body.email === "string" ? body.email : "";
  if (!isValidEmail(rawEmail)) {
    return NextResponse.json(
      { success: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const db = getWaitlistDb();
  const result = db.addEmail({ email: rawEmail, ip, userAgent: ua });

  console.log(
    JSON.stringify({
      event: "waitlist_signup",
      created: result.created,
      alreadyJoined: result.alreadyJoined,
      ip,
    }),
  );

  // TODO: send welcome email via Resend
  // TODO: sync contact to Resend Audiences

  return NextResponse.json({
    success: true,
    alreadyJoined: result.alreadyJoined,
  });
}
