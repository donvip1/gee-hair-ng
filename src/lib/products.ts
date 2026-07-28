import type { Product } from "@/lib/types";

export const products: Product[] = [
  {
    id: "GH-001",
    slug: "karsana-bone-straight",
    name: "Karsana Bone Straight",
    category: "Bone Straight",
    texture: "Silky double drawn",
    description: "A polished, high-density straight texture with soft movement and a clean, luxurious finish.",
    details: ["Premium double-drawn fullness", "Minimal shedding", "Heat styling friendly", "Quality checked before dispatch"],
    image: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=1100&q=88",
    images: [
      "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=1100&q=88",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1100&q=88"
    ],
    basePrice: 185000,
    variants: [
      { label: "12 inches", price: 185000, stock: 8 },
      { label: "16 inches", price: 205000, stock: 6 },
      { label: "20 inches", price: 230000, stock: 4 },
      { label: "24 inches", price: 260000, stock: 3 }
    ],
    featured: true,
    badge: "Bestseller"
  },
  {
    id: "GH-002",
    slug: "bouncy-curl-muse",
    name: "Bouncy Curl Muse",
    category: "Curls",
    texture: "Full, defined and soft",
    description: "Cloud-soft curls with lasting definition, beautiful bounce and camera-ready volume.",
    details: ["Defined curl pattern", "Soft, full ends", "Easy refresh routine", "Natural-looking density"],
    image: "https://images.unsplash.com/photo-1542131596-dea5384842c7?auto=format&fit=crop&w=1100&q=88",
    images: [
      "https://images.unsplash.com/photo-1542131596-dea5384842c7?auto=format&fit=crop&w=1100&q=88",
      "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=1100&q=88"
    ],
    basePrice: 145000,
    variants: [
      { label: "12 inches", price: 145000, stock: 10 },
      { label: "16 inches", price: 165000, stock: 7 },
      { label: "20 inches", price: 190000, stock: 5 }
    ],
    featured: true,
    badge: "Client favourite"
  },
  {
    id: "GH-003",
    slug: "pixie-curl-edit",
    name: "The Pixie Curl Edit",
    category: "Wigs",
    texture: "Lightweight and ready to wear",
    description: "A short, confident curl unit designed for easy wear, soft definition and maximum personality.",
    details: ["Ready-to-wear shape", "Breathable construction", "Soft curl definition", "Easy everyday styling"],
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1100&q=88",
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1100&q=88",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1100&q=88"
    ],
    basePrice: 95000,
    variants: [
      { label: "Standard cap", price: 95000, stock: 9 },
      { label: "Custom fitted", price: 115000, stock: 5 }
    ],
    featured: true,
    badge: "New"
  },
  {
    id: "GH-004",
    slug: "lagos-layered-unit",
    name: "Lagos Layered Unit",
    category: "Wigs",
    texture: "Pre-styled with HD lace",
    description: "Face-framing layers, natural density and an effortless salon finish straight out of the box.",
    details: ["HD lace finish", "Pre-plucked hairline", "Face-framing layers", "Custom colour available"],
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1100&q=88",
    images: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1100&q=88",
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=1100&q=88"
    ],
    basePrice: 210000,
    variants: [
      { label: "18 inches", price: 210000, stock: 5 },
      { label: "22 inches", price: 245000, stock: 4 },
      { label: "26 inches", price: 285000, stock: 2 }
    ],
    featured: true
  },
  {
    id: "GH-005",
    slug: "midnight-body-wave",
    name: "Midnight Body Wave",
    category: "Bundles",
    texture: "Soft body wave",
    description: "Rich, glossy waves that hold their shape while staying soft enough for versatile styling.",
    details: ["Full from root to tip", "Can be straightened", "Reusable with proper care", "Three-bundle set"],
    image: "https://images.unsplash.com/photo-1604514628550-37477afdf4e3?auto=format&fit=crop&w=1100&q=88",
    images: ["https://images.unsplash.com/photo-1604514628550-37477afdf4e3?auto=format&fit=crop&w=1100&q=88"],
    basePrice: 165000,
    variants: [
      { label: "16/18/20 inches", price: 165000, stock: 6 },
      { label: "20/22/24 inches", price: 205000, stock: 4 }
    ],
    featured: false
  },
  {
    id: "GH-006",
    slug: "cloud-deep-wave",
    name: "Cloud Deep Wave",
    category: "Curls",
    texture: "Deep wave definition",
    description: "High-impact texture for a full, glamorous look with soft touch and easy definition.",
    details: ["Deep uniform waves", "High density", "Wet or fluffy styling", "Low-tangle finish"],
    image: "https://images.unsplash.com/photo-1616847220575-31b062a4cd05?auto=format&fit=crop&w=1100&q=88",
    images: ["https://images.unsplash.com/photo-1616847220575-31b062a4cd05?auto=format&fit=crop&w=1100&q=88"],
    basePrice: 175000,
    variants: [
      { label: "16 inches", price: 175000, stock: 7 },
      { label: "20 inches", price: 205000, stock: 5 },
      { label: "24 inches", price: 240000, stock: 3 }
    ],
    featured: false
  }
];

export const categories = ["All", "Bone Straight", "Curls", "Wigs", "Bundles"] as const;

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
