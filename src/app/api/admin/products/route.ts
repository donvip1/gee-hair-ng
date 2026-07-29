import { NextRequest, NextResponse } from "next/server";
import { callCatalogBackend, getCatalogHealth, isCatalogBackendConfigured, normalizeProduct } from "@/lib/catalog-backend";
import { products as fallbackProducts } from "@/lib/products";
import { hasValidAdminSession } from "@/lib/admin-auth";
import type { Product, ProductInput } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!hasValidAdminSession(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isCatalogBackendConfigured) return NextResponse.json({ products: fallbackProducts, source: "fallback", writable: false, backendStatus: "unconfigured" });
  try {
    const [health, data] = await Promise.all([
      getCatalogHealth(),
      callCatalogBackend<{ products: Product[] }>("listProducts", { includeInactive: true })
    ]);
    return NextResponse.json({ products: data.products.map(normalizeProduct), source: "live", writable: health.ready, backendStatus: "ready", health });
  } catch (error) {
    return NextResponse.json({ products: [], source: "live", writable: false, backendStatus: "unhealthy", error: error instanceof Error ? error.message : "Unable to connect to the catalog backend" }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  if (!hasValidAdminSession(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isCatalogBackendConfigured) return NextResponse.json({ error: "Connect Google Apps Script before changing products." }, { status: 503 });
  const product = await request.json() as ProductInput;
  const error = validateProduct(product);
  if (error) return NextResponse.json({ error }, { status: 400 });
  try {
    const data = await callCatalogBackend<{ product: Product }>("saveProduct", { product });
    return NextResponse.json({ product: normalizeProduct(data.product) });
  } catch (cause) { return NextResponse.json({ error: cause instanceof Error ? cause.message : "Unable to save product" }, { status: 502 }); }
}

export async function DELETE(request: NextRequest) {
  if (!hasValidAdminSession(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isCatalogBackendConfigured) return NextResponse.json({ error: "Connect Google Apps Script before deleting products." }, { status: 503 });
  const { id } = await request.json() as { id?: string };
  if (!id) return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
  try { await callCatalogBackend("deleteProduct", { id }); return NextResponse.json({ ok: true }); }
  catch (cause) { return NextResponse.json({ error: cause instanceof Error ? cause.message : "Unable to delete product" }, { status: 502 }); }
}

function validateProduct(product: ProductInput) {
  if (!product.name?.trim()) return "Product name is required.";
  if (!product.slug?.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.slug)) return "Use a lowercase URL slug with letters, numbers and single hyphens.";
  if (!product.texture?.trim()) return "Texture is required.";
  if (!product.description?.trim()) return "Description is required.";
  if (!product.image?.trim()) return "A product image is required.";
  if (!Number.isInteger(product.minLength) || !Number.isInteger(product.maxLength) || product.minLength < 1 || product.maxLength < product.minLength) return "Enter a valid whole-number length range.";
  if (!Number.isInteger(product.lengthStep) || product.lengthStep < 1 || (product.maxLength - product.minLength) % product.lengthStep !== 0) return "Length step must be a positive whole number that fits the length range.";
  if (!Number.isInteger(product.bundleWeightGrams) || product.bundleWeightGrams < 1) return "Bundle weight must be a positive whole number.";
  return null;
}
