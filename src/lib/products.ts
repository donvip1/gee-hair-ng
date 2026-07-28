import type { Product } from "@/lib/types";

export const products: Product[] = [
  {
    id: "GH-001",
    slug: "bone-straight",
    name: "Bone Straight",
    category: "Straight",
    texture: "Sleek, smooth and polished",
    description: "Premium 100% virgin Bone Straight hair with a refined finish, available in your preferred length and colour.",
    details: ["100% virgin hair", "100g per bundle", "All colours available", "Free wigging for first-time customers"],
    image: "/products/bone-straight.jpeg",
    images: ["/products/bone-straight.jpeg"],
    minLength: 8,
    maxLength: 32,
    lengthStep: 2,
    colours: "All colours available",
    bundleWeightGrams: 100,
    featured: true,
    active: true
  },
  {
    id: "GH-002",
    slug: "pixie-curls",
    name: "Pixie Curls",
    category: "Curls",
    texture: "Defined, full-bodied curls",
    description: "Statement Pixie Curls made from premium 100% virgin hair for rich definition, softness and confident volume.",
    details: ["100% virgin hair", "100g per bundle", "All colours available", "Free wigging for first-time customers"],
    image: "/products/pixie-curls.jpeg",
    images: ["/products/pixie-curls.jpeg"],
    minLength: 8,
    maxLength: 30,
    lengthStep: 2,
    colours: "All colours available",
    bundleWeightGrams: 100,
    featured: true,
    active: true
  },
  {
    id: "GH-003",
    slug: "bouncy-curls",
    name: "Bouncy Curls",
    category: "Curls",
    texture: "Soft bounce and glamorous volume",
    description: "Premium 100% virgin Bouncy Curls created for movement, fullness and a beautifully styled finish.",
    details: ["100% virgin hair", "100g per bundle", "All colours available", "Free wigging for first-time customers"],
    image: "/products/bouncy-curls.jpeg",
    images: ["/products/bouncy-curls.jpeg"],
    minLength: 12,
    maxLength: 34,
    lengthStep: 2,
    colours: "All colours available",
    bundleWeightGrams: 100,
    featured: true,
    active: true
  },
  {
    id: "GH-004",
    slug: "deep-waves",
    name: "Deep Waves",
    category: "Waves",
    texture: "Deep, flowing wave pattern",
    description: "Lush 100% virgin Deep Waves with soft definition and generous length for a full, luxurious look.",
    details: ["100% virgin hair", "100g per bundle", "All colours available", "Free wigging for first-time customers"],
    image: "/products/deep-waves.jpeg",
    images: ["/products/deep-waves.jpeg"],
    minLength: 10,
    maxLength: 32,
    lengthStep: 2,
    colours: "All colours available",
    bundleWeightGrams: 100,
    featured: true,
    active: true
  },
  {
    id: "GH-005",
    slug: "jerry-curls",
    name: "Jerry Curls",
    category: "Curls",
    texture: "Classic, springy curl definition",
    description: "Premium 100% virgin Jerry Curls available across a wide length range and in every colour. Authentic product photography is coming soon.",
    details: ["100% virgin hair", "100g per bundle", "All colours available", "Free wigging for first-time customers"],
    image: "/products/jerry-curls-placeholder.svg",
    images: ["/products/jerry-curls-placeholder.svg"],
    minLength: 10,
    maxLength: 34,
    lengthStep: 2,
    colours: "All colours available",
    bundleWeightGrams: 100,
    featured: true,
    active: true,
    imagePending: true
  }
];

export const categories = ["All", "Straight", "Curls", "Waves"] as const;

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug && product.active);
}

export function getLengthOptions(product: Product) {
  return Array.from(
    { length: Math.floor((product.maxLength - product.minLength) / product.lengthStep) + 1 },
    (_, index) => product.minLength + index * product.lengthStep
  );
}
