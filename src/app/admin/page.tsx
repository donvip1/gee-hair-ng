import { AdminNav } from "@/components/AdminNav";
import { products } from "@/lib/products";

const recentOrders = [
  { reference: "GH-48219364", customer: "Amara O.", total: "₦205,000", status: "Preparing" },
  { reference: "GH-10472856", customer: "Nneka C.", total: "₦145,000", status: "Confirmed" },
  { reference: "GH-91836271", customer: "Kemi A.", total: "₦285,000", status: "Received" }
];

export default function AdminPage() {
  return <div className="admin-shell"><AdminNav /><section className="admin-content"><p className="eyebrow">Store overview</p><h1>Good afternoon, <em>Gee.</em></h1><div className="stat-grid"><div className="stat-card"><span>Active products</span><strong>{products.length}</strong></div><div className="stat-card"><span>New orders</span><strong>3</strong></div><div className="stat-card"><span>Low stock</span><strong>2</strong></div><div className="stat-card"><span>Wishlisted</span><strong>18</strong></div></div><h2 style={{ fontSize: 38, marginBottom: 20 }}>Recent orders</h2><table className="data-table"><thead><tr><th>Reference</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead><tbody>{recentOrders.map((order) => <tr key={order.reference}><td>{order.reference}</td><td>{order.customer}</td><td>{order.total}</td><td><span className="status-chip">{order.status}</span></td></tr>)}</tbody></table><p style={{ color: "#716a62", marginTop: 20, fontSize: 12 }}>Demo data is shown until the Google Apps Script backend is connected.</p></section></div>;
}
