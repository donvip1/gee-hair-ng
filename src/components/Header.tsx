"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/#story", label: "Our story" },
  { href: "/track", label: "Track order" }
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const cart = useStore((state) => state.cart);
  const wishlist = useStore((state) => state.wishlist);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <div className="announcement">Abuja delivery available <i /> Nationwide shipping <i /> Open until 11 PM</div>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Gee Hair NG home">
          <span className="brand-mark">G</span>
          <span>Gee Hair <em>NG</em></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map((item) => <Link className={pathname === item.href ? "active" : ""} key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <div className="header-actions">
          <Link href="/shop" aria-label="Search products"><Search size={20} /></Link>
          <Link href="/wishlist" aria-label={`Wishlist with ${wishlist.length} items`}><Heart size={20} /><span className="count-badge">{wishlist.length}</span></Link>
          <Link href="/account" aria-label="Account"><UserRound size={20} /></Link>
          <Link href="/cart" aria-label={`Shopping bag with ${itemCount} items`}><ShoppingBag size={20} /><span className="count-badge">{itemCount}</span></Link>
          <button className="menu-trigger" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
        </div>
      </header>
      <div className={`mobile-menu ${open ? "open" : ""}`} aria-hidden={!open}>
        <nav>{nav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}<Link href="/account">My account</Link><Link href="/wishlist">Wishlist</Link></nav>
        <p>Premium hair, personally sourced from Abuja to you.</p>
      </div>
    </>
  );
}
