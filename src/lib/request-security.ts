import type { NextRequest } from "next/server";

export function validateMutationRequest(request: NextRequest, expectedType: "json" | "form" = "json") {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return "Cross-origin requests are not allowed.";
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (expectedType === "json" && !contentType.startsWith("application/json")) return "Content-Type must be application/json.";
  if (expectedType === "form" && !contentType.startsWith("multipart/form-data")) return "Content-Type must be multipart/form-data.";
  return null;
}

export const privateResponseHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive"
};
