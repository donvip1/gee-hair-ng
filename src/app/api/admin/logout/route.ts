import { NextRequest, NextResponse } from "next/server";
import { adminCookie } from "@/lib/admin-auth";
import { privateResponseHeaders, validateMutationRequest } from "@/lib/request-security";

export async function POST(request: NextRequest) {
  const error = validateMutationRequest(request);
  if (error) return NextResponse.json({ error }, { status: 415, headers: privateResponseHeaders });
  const response = NextResponse.json({ ok: true }, { headers: privateResponseHeaders });
  response.cookies.set(adminCookie, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0, expires: new Date(0) });
  return response;
}
