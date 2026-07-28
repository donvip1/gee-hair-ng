import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname === "/admin/login") return NextResponse.next();
  const token = request.cookies.get("gee_admin")?.value;
  const [payload, signature, extra] = token?.split(".") ?? [];
  const expires = payload ? Number(payload.split(":")[1]) : 0;
  if (!payload || !signature || extra || !expires || expires < Date.now()) return NextResponse.redirect(new URL("/admin/login", request.url));
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*"] };
