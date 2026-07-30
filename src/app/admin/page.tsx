import Link from "next/link";
import { ImageOff, PackageCheck, Plus } from "lucide-react";
import { AdminHealth } from "@/components/AdminHealth";
import { AdminNav } from "@/components/AdminNav";
import { getPublicCatalog } from "@/lib/catalog-backend";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { products, source, status, checkedAt } = await getPublicCatalog();
  const active = products.filter((product) => product.active);
  const pendingImages = active.filter((product) => product.imagePending);
  const catalogLabel = source === "live" ? "live catalog" : "verified fallback catalog";

  return (
    <div className="admin-shell"><AdminNav /><section className="admin-content">
      <p className="eyebrow">Catalog overview</p><h1>Good to see you, <em>Gee.</em></h1>
      <p className="admin-intro">This dashboard manages only real products in the public catalog. Customer enquiries and transactions continue directly on WhatsApp.</p>
      {source === "fallback" && <div className="admin-error"><strong>{status === "degraded" ? "The live catalog could not be reached." : "The live catalog is not configured."}</strong><br />Visitors are currently protected by the verified fallback catalog. Last checked {new Date(checkedAt).toLocaleString()}.</div>}
      <div className="stat-grid admin-stat-grid"><div className="stat-card"><PackageCheck /><span>Visible products</span><strong>{active.length}</strong><p>Products currently available in the {catalogLabel}.</p></div><div className="stat-card"><ImageOff /><span>Photos needed</span><strong>{pendingImages.length}</strong><p>{pendingImages.length ? pendingImages.map((product) => product.name).join(", ") : "Every product has an authentic image."}</p></div></div>
      <AdminHealth />
      <div className="admin-action-panel"><div><p className="eyebrow">Product management</p><h2>Add, edit or remove catalog items.</h2><p>{source === "live" ? "Changes made in product management update the public storefront." : "Connect Google Apps Script and Drive to make changes live from this dashboard. Until then, the verified five-product catalog remains available for visitors."}</p></div><Link className="button button-dark" href="/admin/products"><Plus size={17} /> Manage products</Link></div>
    </section></div>
  );
}
