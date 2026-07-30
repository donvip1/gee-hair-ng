"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

export function AdminNav() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const logout = async () => {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <aside className="admin-nav">
      <h2>Gee Admin</h2>
      <Link href="/admin">Overview</Link>
      <Link href="/admin/products">Products</Link>
      <Link href="/">View store ↗</Link>
      <button type="button" className="admin-logout" onClick={logout} disabled={loggingOut}><LogOut size={15} /> {loggingOut ? "Signing out…" : "Sign out"}</button>
    </aside>
  );
}
