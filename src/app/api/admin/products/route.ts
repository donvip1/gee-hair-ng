import { NextRequest, NextResponse } from "next/server";
import { callCatalogBackend, getCatalogEndpointInfo, getCatalogHealth, getCatalogProbe, isCatalogBackendConfigured, normalizeProduct } from "@/lib/catalog-backend";
import { products as fallbackProducts } from "@/lib/products";
import { hasValidAdminSession } from "@/lib/admin-auth";
import { validateProductInput } from "@/lib/product-validation";
import { privateResponseHeaders, validateMutationRequest } from "@/lib/request-security";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!hasValidAdminSession(request)) return json({ error: "Unauthorized" }, 401);
  const endpoint = getCatalogEndpointInfo();
  if (!isCatalogBackendConfigured) return json({ products: fallbackProducts, source: "fallback", writable: false, backendStatus: "unconfigured", endpoint });

  let probe;
  try { probe = await getCatalogProbe(); }
  catch (error) { return json({ products: [], source: "live", writable: false, backendStatus: "unhealthy", endpoint, error: message(error, "Unable to verify the Apps Script deployment") }, 502); }

  try {
    const [health, data] = await Promise.all([getCatalogHealth(), callCatalogBackend<{ products: Product[] }>("listProducts", { includeInactive: true })]);
    return json({ products: data.products.map(normalizeProduct), source: "live", writable: health.ready, backendStatus: "ready", health, probe, endpoint });
  } catch (error) {
    return json({ products: [], source: "live", writable: false, backendStatus: "unhealthy", probe, endpoint, error: message(error, "Unable to connect to the catalog backend") }, 502);
  }
}

export async function POST(request: NextRequest) {
  if (!hasValidAdminSession(request)) return json({ error: "Unauthorized" }, 401);
  const requestError = validateMutationRequest(request);
  if (requestError) return json({ error: requestError }, 415);
  if (!isCatalogBackendConfigured) return json({ error: "Connect Google Apps Script before changing products." }, 503);
  let body: unknown;
  try { body = await request.json(); } catch { return json({ error: "Request body must be valid JSON." }, 400); }
  const validation = validateProductInput(body);
  if (!validation.ok) return json({ error: validation.error }, 400);
  try {
    const data = await callCatalogBackend<{ product: Product }>("saveProduct", { product: validation.product });
    return json({ product: normalizeProduct(data.product) });
  } catch (error) { return json({ error: message(error, "Unable to save product") }, 502); }
}

export async function DELETE(request: NextRequest) {
  if (!hasValidAdminSession(request)) return json({ error: "Unauthorized" }, 401);
  const requestError = validateMutationRequest(request);
  if (requestError) return json({ error: requestError }, 415);
  if (!isCatalogBackendConfigured) return json({ error: "Connect Google Apps Script before deleting products." }, 503);
  let body: { id?: string };
  try { body = await request.json() as { id?: string }; } catch { return json({ error: "Request body must be valid JSON." }, 400); }
  const id = body.id?.trim();
  if (!id || id.length > 100) return json({ error: "A valid product ID is required." }, 400);
  try { await callCatalogBackend("deleteProduct", { id }); return json({ ok: true }); }
  catch (error) { return json({ error: message(error, "Unable to delete product") }, 502); }
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: privateResponseHeaders });
}

function message(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
