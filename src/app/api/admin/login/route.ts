import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

const attempts = new Map<string, { count: number; reset: number }>();

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const now = Date.now();
  const current = attempts.get(ip);
  if (current && current.reset > now && current.count >= 5) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  const body = await request.json() as { password?: string };
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !body.password || !safeEqual(body.password, expected)) {
    attempts.set(ip, { count: current && current.reset > now ? current.count + 1 : 1, reset: now + 15 * 60_000 });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  attempts.delete(ip);
  const secret = process.env.SESSION_SECRET ?? expected;
  const expires = Date.now() + 8 * 60 * 60_000;
  const payload = `admin:${expires}`;
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  const response = NextResponse.json({ ok: true });
  response.cookies.set("gee_admin", `${payload}.${signature}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 8 * 60 * 60 });
  return response;
}

function safeEqual(value: string, expected: string) {
  const a = Buffer.from(value); const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
