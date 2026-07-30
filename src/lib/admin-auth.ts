import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "gee_admin";

export function createAdminToken(secret: string) {
  const payload = `admin:${Date.now() + 8 * 60 * 60_000}`;
  return `${payload}.${createHmac("sha256", secret).update(payload).digest("hex")}`;
}

export function hasValidAdminSession(request: NextRequest) {
  const secret = process.env.SESSION_SECRET ?? process.env.ADMIN_PASSWORD;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!secret || !token) return false;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra || !/^admin:\d{13}$/.test(payload)) return false;
  const expires = Number(payload.slice("admin:".length));
  if (!expires || expires < Date.now() || expires > Date.now() + 8 * 60 * 60_000 + 60_000) return false;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

export const adminCookie = COOKIE_NAME;
