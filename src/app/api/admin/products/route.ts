import { NextRequest, NextResponse } from "next/server";
import { callCatalogBackend, isCatalogBackendConfigured, normalizeProduct } from "@/lib/catalog-backend";
import { products as fallbackProducts } from "@/lib/products";
import { hasValidAdminSession } from "@/lib/admin-auth";
import type { Product, ProductInput } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!hasValidAdminSession(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isCatalogBackendConfigured) return NextResponse.json({ products: fallbackProducts, source: "fallback", writable: false });
  try {
    const data = await callCatalogBackend<{ products: Product[] }>("listProducts", { includeInactive: true });
    return NextResponse.json({ products: data.products.map(normalizeProduct), source: "live", writable: true });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load products" }, { status: 502 }); }
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
  if (!product.slug?.trim() || !/^[a-z0-9-]+$/.test(product.slug)) return "Use a lowercase URL slug with letters, numbers and hyphens.";
  if (!product.image?.trim()) return "A product image is required.";
  if (!Number.isFinite(product.minLength) || !Number.isFinite(product.maxLength) || product.minLength < 1 || product.maxLength < product.minLength) return "Enter a valid length range.";
  if (!Number.isFinite(product.bundleWeightGrams) || product.bundleWeightGrams < 1) return "Bundle weight must be valid.";
  return null;
}
