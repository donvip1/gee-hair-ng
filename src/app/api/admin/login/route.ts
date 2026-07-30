import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { adminCookie, createAdminToken } from "@/lib/admin-auth";
import { privateResponseHeaders, validateMutationRequest } from "@/lib/request-security";

const attempts = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 15 * 60_000;
const MAX_ATTEMPTS = 5;

export async function POST(request: NextRequest) {
  const requestError = validateMutationRequest(request);
  if (requestError) return json({ error: requestError }, 415);
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
  const now = Date.now();
  const current = attempts.get(ip);
  if (current && current.reset > now && current.count >= MAX_ATTEMPTS) return json({ error: "Too many attempts" }, 429, { "Retry-After": String(Math.ceil((current.reset - now) / 1000)) });
  let body: { password?: string };
  try { body = await request.json() as { password?: string }; } catch { return json({ error: "Request body must be valid JSON." }, 400); }
  const expected = process.env.ADMIN_PASSWORD;
  const password = typeof body.password === "string" ? body.password : "";
  if (!expected || !password || password.length > 256 || !safeEqual(password, expected)) {
    attempts.set(ip, { count: current && current.reset > now ? current.count + 1 : 1, reset: now + WINDOW_MS });
    return json({ error: "Unauthorized" }, 401);
  }
  attempts.delete(ip);
  const secret = process.env.SESSION_SECRET ?? expected;
  const response = NextResponse.json({ ok: true }, { headers: privateResponseHeaders });
  response.cookies.set(adminCookie, createAdminToken(secret), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 8 * 60 * 60, expires: new Date(Date.now() + 8 * 60 * 60_000) });
  return response;
}

function safeEqual(value: string, expected: string) {
  const a = Buffer.from(value); const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function json(body: unknown, status: number, extraHeaders: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: { ...privateResponseHeaders, ...extraHeaders } });
}
