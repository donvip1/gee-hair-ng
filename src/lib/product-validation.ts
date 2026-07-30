import type { ProductInput, ProductCategory } from "@/lib/types";

const categories = new Set<ProductCategory>(["Straight", "Curls", "Waves"]);
const remoteImageHosts = new Set(["drive.google.com", "lh3.googleusercontent.com"]);

export type ProductValidationResult =
  | { ok: true; product: ProductInput }
  | { ok: false; error: string };

export function validateProductInput(input: unknown): ProductValidationResult {
  if (!input || typeof input !== "object") return fail("A product object is required.");
  const raw = input as Partial<ProductInput>;
  const name = clean(raw.name, 160);
  const slug = clean(raw.slug, 120).toLowerCase();
  const texture = clean(raw.texture, 220);
  const description = clean(raw.description, 2000);
  const colours = clean(raw.colours || "All colours available", 500);
  const category = raw.category;
  const image = clean(raw.image, 2000);
  const details = Array.isArray(raw.details) ? raw.details.map((item) => clean(item, 300)).filter(Boolean).slice(0, 12) : [];
  const images = Array.isArray(raw.images) ? raw.images.map((item) => clean(item, 2000)).filter(Boolean).slice(0, 8) : [];
  const minLength = Number(raw.minLength);
  const maxLength = Number(raw.maxLength);
  const lengthStep = Number(raw.lengthStep || 2);
  const bundleWeightGrams = Number(raw.bundleWeightGrams || 100);

  if (!name) return fail("Product name is required.");
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return fail("Use a lowercase URL slug with letters, numbers and single hyphens.");
  if (!category || !categories.has(category)) return fail("Category must be Straight, Curls or Waves.");
  if (!texture) return fail("Texture is required.");
  if (!description) return fail("Description is required.");
  if (!isAllowedImageUrl(image)) return fail("Use a local product image or a public Google Drive image URL.");
  if (![minLength, maxLength, lengthStep, bundleWeightGrams].every((value) => Number.isInteger(value) && value > 0)) return fail("Lengths, length step and bundle weight must be positive whole numbers.");
  if (maxLength < minLength || maxLength > 60) return fail("Enter a valid length range no greater than 60 inches.");
  if ((maxLength - minLength) % lengthStep !== 0) return fail("Length step must fit the selected length range.");
  if (bundleWeightGrams > 1000) return fail("Bundle weight must not exceed 1000 grams.");
  const normalizedImages = images.length ? images : [image];
  if (normalizedImages.some((value) => !isAllowedImageUrl(value))) return fail("Every product image must use an approved public image URL.");

  return {
    ok: true,
    product: {
      id: clean(raw.id, 100) || undefined,
      name,
      slug,
      category,
      texture,
      description,
      details,
      image,
      images: normalizedImages,
      minLength,
      maxLength,
      lengthStep,
      colours,
      bundleWeightGrams,
      featured: Boolean(raw.featured),
      active: Boolean(raw.active),
      imagePending: Boolean(raw.imagePending)
    }
  };
}

export function isAllowedImageUrl(value: string) {
  if (/^\/products\/[a-zA-Z0-9._/-]+$/.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && remoteImageHosts.has(url.hostname);
  } catch {
    return false;
  }
}

function clean(value: unknown, maxLength: number) {
  return String(value ?? "").replace(/[<>]/g, "").trim().slice(0, maxLength);
}

function fail(error: string): ProductValidationResult {
  return { ok: false, error };
}
