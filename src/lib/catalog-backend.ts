import { products as fallbackProducts } from "@/lib/products";
import type { CatalogEndpointInfo, CatalogHealth, CatalogProbe, CatalogResponse, Product } from "@/lib/types";

const backendUrl = process.env.GOOGLE_APPS_SCRIPT_URL?.trim();
const sharedSecret = process.env.APPS_SCRIPT_SHARED_SECRET?.trim();

export const isCatalogBackendConfigured = Boolean(backendUrl && sharedSecret);

export async function callCatalogBackend<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  if (!backendUrl || !sharedSecret) throw new Error("Catalog backend is not configured.");
  const response = await fetch(backendUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, ...payload, sharedSecret }),
    cache: "no-store"
  });
  const text = await response.text();
  let data: unknown;
  try { data = JSON.parse(text); } catch { throw new Error("The catalog backend returned an invalid response."); }
  if (!response.ok || !isBackendSuccess(data)) throw new Error(isBackendError(data) ? data.error : "Catalog request failed.");
  return data as T;
}

export async function getCatalogHealth() {
  return callCatalogBackend<CatalogHealth>("healthCheck");
}

export async function getCatalogProbe(): Promise<CatalogProbe> {
  if (!backendUrl) throw new Error("Catalog backend URL is not configured.");
  const response = await fetch(backendUrl, { method: "GET", cache: "no-store" });
  const text = await response.text();
  let data: unknown;
  try { data = JSON.parse(text); } catch { throw new Error("The configured Apps Script URL does not expose the current deployment probe."); }
  if (!response.ok || !isCatalogProbe(data)) throw new Error("The configured Apps Script URL is not running the current catalog deployment.");
  return data;
}

export function getCatalogEndpointInfo(): CatalogEndpointInfo | null {
  if (!backendUrl) return null;
  try {
    const url = new URL(backendUrl);
    const deploymentId = url.pathname.match(/\/s\/([^/]+)\/exec\/?$/)?.[1] ?? "unknown";
    return {
      host: url.host,
      deploymentRef: deploymentId === "unknown" ? "unknown" : deploymentId.slice(-10),
      usesExecUrl: /\/exec\/?$/.test(url.pathname)
    };
  } catch {
    return { host: "invalid", deploymentRef: "invalid", usesExecUrl: false };
  }
}

export async function getPublicCatalog(): Promise<CatalogResponse> {
  if (!isCatalogBackendConfigured) {
    return { products: fallbackProducts, source: "fallback" };
  }

  try {
    const data = await callCatalogBackend<{ products: Product[] }>("listProducts");
    return {
      products: data.products
        .map(normalizeProduct)
        .filter((product) => product.active),
      source: "live"
    };
  } catch {
    return { products: fallbackProducts, source: "fallback" };
  }
}

export async function getPublicProduct(slug: string) {
  const { products } = await getPublicCatalog();
  return products.find((product) => product.slug === slug && product.active);
}

export function normalizeProduct(input: Product): Product {
  return {
    ...input,
    minLength: Number(input.minLength),
    maxLength: Number(input.maxLength),
    lengthStep: Number(input.lengthStep || 2),
    bundleWeightGrams: Number(input.bundleWeightGrams || 100),
    featured: Boolean(input.featured),
    active: Boolean(input.active),
    imagePending: Boolean(input.imagePending),
    images: Array.isArray(input.images) && input.images.length ? input.images : [input.image]
  };
}

function isBackendSuccess(value: unknown): value is { ok: true } { return typeof value === "object" && value !== null && "ok" in value && value.ok === true; }
function isBackendError(value: unknown): value is { error: string } { return typeof value === "object" && value !== null && "error" in value && typeof value.error === "string"; }
function isCatalogProbe(value: unknown): value is CatalogProbe {
  return typeof value === "object" && value !== null && "ok" in value && value.ok === true && "release" in value && typeof value.release === "string" && "service" in value && typeof value.service === "string";
}
