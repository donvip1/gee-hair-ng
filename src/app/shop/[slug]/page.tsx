import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";
import { getPublicProduct } from "@/lib/catalog-backend";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

type ProductPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProduct(slug);
  if (!product) return { title: "Product not found", robots: { index: false, follow: false } };
  const description = `${product.name} by Gee Hair NG: 100% virgin hair, ${product.minLength}–${product.maxLength} inches and ${product.bundleWeightGrams}g per bundle. Price and availability confirmed on WhatsApp.`;
  return {
    title: `${product.name} virgin hair in Abuja`,
    description,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: { title: product.name, description, url: `/shop/${product.slug}`, images: [{ url: product.image, alt: product.name }] },
    twitter: { card: "summary_large_image", title: product.name, description, images: [product.image] }
  };
}

export default async function ProductPage({
  params
}: ProductPageProps) {
  const { slug } = await params;
  const product = await getPublicProduct(slug);

  if (!product) notFound();

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((image) => absoluteUrl(image)),
    brand: { "@type": "Brand", name: "Gee Hair NG" },
    category: `${product.category} hair extensions`,
    material: "100% virgin hair",
    size: `${product.minLength}–${product.maxLength} inches`,
    additionalProperty: [
      { "@type": "PropertyValue", name: "Bundle weight", value: `${product.bundleWeightGrams}g` },
      { "@type": "PropertyValue", name: "Colours", value: product.colours },
      { "@type": "PropertyValue", name: "Price", value: "Price on request via WhatsApp" }
    ]
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl("/shop") },
      { "@type": "ListItem", position: 3, name: product.name, item: absoluteUrl(`/shop/${product.slug}`) }
    ]
  };

  return (
    <>
      <ProductDetail product={product} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
    </>
  );
}
