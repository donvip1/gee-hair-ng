import type { MetadataRoute } from "next";
import { getPublicCatalog } from "@/lib/catalog-backend";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products } = await getPublicCatalog();
  const now = new Date();
  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/shop"), lastModified: now, changeFrequency: "daily", priority: .9 },
    { url: absoluteUrl("/services"), lastModified: now, changeFrequency: "monthly", priority: .8 },
    { url: absoluteUrl("/customer-care"), lastModified: now, changeFrequency: "monthly", priority: .6 },
    ...products.filter((product) => product.active).map((product) => ({ url: absoluteUrl(`/shop/${product.slug}`), lastModified: product.updatedAt ? new Date(product.updatedAt) : now, changeFrequency: "weekly" as const, priority: .8 }))
  ];
}
