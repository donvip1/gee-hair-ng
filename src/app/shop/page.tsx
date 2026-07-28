import { ShopCatalog } from "@/components/ShopCatalog";
import { getPublicCatalog } from "@/lib/catalog-backend";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const { products } = await getPublicCatalog();

  return (
    <div className="page-shell">
      <header className="page-hero">
        <p className="eyebrow">The current collection</p>
        <h1>
          Choose your <em>texture.</em>
        </h1>
        <p>
          Explore Gee Hair NG’s available 100% virgin hair. Every bundle weighs
          100g, all colours are available, and final pricing is confirmed
          directly on WhatsApp.
        </p>
      </header>
      <ShopCatalog products={products} />
    </div>
  );
}
