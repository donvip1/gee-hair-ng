import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname === "/admin/login") return NextResponse.next();
  const token = request.cookies.get("gee_admin")?.value;
  if (!token) return NextResponse.redirect(new URL("/admin/login", request.url));
  const parts = token.split(".");
  const expires = parts.length === 2 ? Number(parts[0].split(":")[1]) : 0;
  if (!expires || expires < Date.now()) return NextResponse.redirect(new URL("/admin/login", request.url));
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*"] };
