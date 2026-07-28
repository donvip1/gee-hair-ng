import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";
import { getPublicProduct } from "@/lib/catalog-backend";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getPublicProduct(slug);

  if (!product) notFound();

  return <ProductDetail product={product} />;
}
