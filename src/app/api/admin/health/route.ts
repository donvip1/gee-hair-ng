import { NextRequest, NextResponse } from "next/server";
import { getCatalogEndpointInfo, getCatalogHealth, getCatalogProbe, isCatalogBackendConfigured } from "@/lib/catalog-backend";
import { hasValidAdminSession } from "@/lib/admin-auth";
import { privateResponseHeaders } from "@/lib/request-security";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!hasValidAdminSession(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: privateResponseHeaders });
  const base = {
    checkedAt: new Date().toISOString(),
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
    deployment: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ?? "local",
    configured: isCatalogBackendConfigured,
    endpoint: getCatalogEndpointInfo()
  };
  if (!isCatalogBackendConfigured) return NextResponse.json({ ...base, ready: false, status: "unconfigured" }, { headers: privateResponseHeaders });
  try {
    const [probe, health] = await Promise.all([getCatalogProbe(), getCatalogHealth()]);
    return NextResponse.json({ ...base, ready: health.ready, status: health.ready ? "ready" : "unhealthy", probe, health }, { headers: privateResponseHeaders });
  } catch (error) {
    return NextResponse.json({ ...base, ready: false, status: "unhealthy", error: error instanceof Error ? error.message : "Catalog health check failed" }, { status: 502, headers: privateResponseHeaders });
  }
}
