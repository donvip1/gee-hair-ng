"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { business, whatsappLink } from "@/lib/business";

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/#story", label: "Our story" },
  { href: "/#how-to-order", label: "How to order" }
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <div className="announcement">100% virgin hair <i /> 100g per bundle <i /> Free wigging for first timers</div>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Gee Hair NG home"><span className="brand-mark">G</span><span>Gee Hair <em>NG</em></span></Link>
        <nav className="desktop-nav" aria-label="Main navigation">{nav.map((item) => <Link className={pathname === item.href ? "active" : ""} key={item.href} href={item.href}>{item.label}</Link>)}</nav>
        <div className="header-actions">
          <Link href="/shop" aria-label="Search products"><Search size={20} /></Link>
          <a className="header-whatsapp" href={whatsappLink(`Hello ${business.name}, I would like to make an enquiry.`)} target="_blank" rel="noreferrer"><MessageCircle size={19} /><span>Order on WhatsApp</span></a>
          <button className="menu-trigger" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
        </div>
      </header>
      <div className={`mobile-menu ${open ? "open" : ""}`} aria-hidden={!open}>
        <nav>{nav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}<a href={whatsappLink(`Hello ${business.name}, I would like to order hair.`)} target="_blank" rel="noreferrer">Order on WhatsApp</a></nav>
        <p>{business.tagline}.</p>
      </div>
    </>
  );
}
