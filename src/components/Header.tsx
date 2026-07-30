"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { business, whatsappLink } from "@/lib/business";

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/#story", label: "Our story" },
  { href: "/#how-to-order", label: "How to order" },
  { href: "/services", label: "Other services" },
  { href: "/customer-care", label: "Customer care" }
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        window.requestAnimationFrame(() => triggerRef.current?.focus());
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <div className="announcement" aria-label="Service highlights">100% virgin hair <i /> 100g per bundle <i /> Free wigging for first timers</div>
      <header className="site-header">
        <Link className="brand brand-logo-link" href="/" aria-label="Gee Hair NG home"><Image src="/brand/gee-hair-ng-logo.png" alt="" width={78} height={60} priority /><span className="brand-text">Gee Hair <em>NG</em></span></Link>
        <nav className="desktop-nav" aria-label="Main navigation">{nav.map((item) => <Link className={pathname === item.href ? "active" : ""} key={item.href} href={item.href}>{item.label}</Link>)}</nav>
        <div className="header-actions">
          <Link href="/shop" aria-label="Search products"><Search size={20} /></Link>
          <WhatsAppLink className="header-whatsapp" href={whatsappLink(`Hello ${business.name}, I would like to make an enquiry.`)} eventName="general_whatsapp_enquiry" eventData={{ placement: "header" }}><MessageCircle size={19} /><span>Order on WhatsApp</span></WhatsAppLink>
          <button ref={triggerRef} className="menu-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"}>{open ? <X /> : <Menu />}</button>
        </div>
      </header>
      <div id="mobile-navigation" className={`mobile-menu ${open ? "open" : ""}`} aria-hidden={!open} inert={!open ? true : undefined}>
        <nav aria-label="Mobile navigation">
          {nav.map((item, index) => <Link ref={index === 0 ? firstLinkRef : undefined} onClick={closeMenu} key={item.href} href={item.href}>{item.label}</Link>)}
          <WhatsAppLink href={whatsappLink(`Hello ${business.name}, I would like to order hair.`)} eventName="general_whatsapp_enquiry" eventData={{ placement: "mobile_menu" }} onClick={closeMenu}>Order on WhatsApp</WhatsAppLink>
        </nav>
        <p>{business.tagline}.</p>
      </div>
    </>
  );
}
