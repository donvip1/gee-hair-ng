import Link from "next/link";
import { ImageOff, PackageCheck, Plus } from "lucide-react";
import { AdminNav } from "@/components/AdminNav";
import { getPublicCatalog } from "@/lib/catalog-backend";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { products, source } = await getPublicCatalog();
  const active = products.filter((product) => product.active);
  const pendingImages = active.filter((product) => product.imagePending);
  const catalogLabel = source === "live" ? "live catalog" : "verified fallback catalog";

  return <div className="admin-shell"><AdminNav /><section className="admin-content"><p className="eyebrow">Catalog overview</p><h1>Good to see you, <em>Gee.</em></h1><p className="admin-intro">This dashboard manages only real products in the public catalog. Customer enquiries and transactions continue directly on WhatsApp.</p><div className="stat-grid admin-stat-grid"><div className="stat-card"><PackageCheck /><span>Visible products</span><strong>{active.length}</strong><p>Products currently available in the {catalogLabel}.</p></div><div className="stat-card"><ImageOff /><span>Photos needed</span><strong>{pendingImages.length}</strong><p>{pendingImages.length ? pendingImages.map((product) => product.name).join(", ") : "Every product has an image."}</p></div></div><div className="admin-action-panel"><div><p className="eyebrow">Product management</p><h2>Add, edit or remove catalog items.</h2><p>{source === "live" ? "Changes made in product management update the public storefront." : "Connect Google Apps Script and Drive to make changes live from this dashboard. Until then, the verified five-product catalog remains available for preview."}</p></div><Link className="button button-dark" href="/admin/products"><Plus size={17} /> Manage products</Link></div></section></div>;
}
