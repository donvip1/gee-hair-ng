import { AdminNav } from "@/components/AdminNav";

const orders = [
  ["GH-48219364", "Amara O.", "Karsana, Abuja", "₦205,000", "Preparing"],
  ["GH-10472856", "Nneka C.", "Wuse 2, Abuja", "₦145,000", "Confirmed"],
  ["GH-91836271", "Kemi A.", "Gwarinpa, Abuja", "₦285,000", "Received"]
];
export default function AdminOrdersPage() { return <div className="admin-shell"><AdminNav /><section className="admin-content"><div className="app-page-header"><div><p className="eyebrow">Order management</p><h1>Orders.</h1></div><input className="search-box" placeholder="Search orders" /></div><table className="data-table"><thead><tr><th>Reference</th><th>Customer</th><th>Delivery</th><th>Total</th><th>Status</th><th>Action</th></tr></thead><tbody>{orders.map((order) => <tr key={order[0]}>{order.map((value, index) => <td key={value}>{index === 4 ? <span className="status-chip">{value}</span> : value}</td>)}<td><button className="pill">Manage</button></td></tr>)}</tbody></table></section></div>; }
