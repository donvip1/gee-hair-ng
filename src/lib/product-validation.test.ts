import assert from "node:assert/strict";
import test from "node:test";
import { isAllowedImageUrl, validateProductInput } from "./product-validation";

const validProduct = {
  name: "Bone Straight",
  slug: "bone-straight",
  category: "Straight",
  texture: "Silky straight",
  description: "Premium virgin hair with a natural finish.",
  image: "/products/bone-straight.jpg",
  minLength: 8,
  maxLength: 32,
  lengthStep: 2,
  colours: "All colours available",
  bundleWeightGrams: 100,
  active: true
} as const;

test("accepts a valid catalog product and supplies an image gallery", () => {
  const result = validateProductInput(validProduct);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.product.images, [validProduct.image]);
    assert.equal(result.product.bundleWeightGrams, 100);
  }
});

test("rejects unsafe slugs", () => {
  const result = validateProductInput({ ...validProduct, slug: "Bone Straight!" });
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.error, /lowercase URL slug/i);
});

test("rejects unsupported image hosts", () => {
  const result = validateProductInput({ ...validProduct, image: "https://example.com/hair.jpg" });
  assert.equal(result.ok, false);
});

test("allows local product images and approved Google image hosts", () => {
  assert.equal(isAllowedImageUrl("/products/deep-waves.webp"), true);
  assert.equal(isAllowedImageUrl("https://drive.google.com/uc?id=photo"), true);
  assert.equal(isAllowedImageUrl("https://lh3.googleusercontent.com/photo"), true);
  assert.equal(isAllowedImageUrl("javascript:alert(1)"), false);
});

test("rejects invalid length ranges and excessive bundle weight", () => {
  assert.equal(validateProductInput({ ...validProduct, maxLength: 7 }).ok, false);
  assert.equal(validateProductInput({ ...validProduct, bundleWeightGrams: 1100 }).ok, false);
});
