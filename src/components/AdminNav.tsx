import Link from "next/link";

export function AdminNav() {
  return (
    <aside className="admin-nav">
      <h2>Gee Admin</h2>
      <Link href="/admin">Overview</Link>
      <Link href="/admin/products">Products</Link>
      <Link href="/">View store ↗</Link>
    </aside>
  );
}
