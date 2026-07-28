import Link from "next/link";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { business } from "@/lib/business";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div><Link className="brand brand-inverse" href="/"><span className="brand-mark">G</span><span>Gee Hair <em>NG</em></span></Link><p>Premium luxury hair and personal sourcing, from Abuja to you.</p></div>
        <div><h3>Explore</h3><Link href="/shop">Shop collection</Link><Link href="/wishlist">Wishlist</Link><Link href="/track">Track your order</Link></div>
        <div><h3>Visit & contact</h3><a href={`tel:${business.phoneInternational}`}><Phone size={15} /> {business.phoneDisplay}</a><a href={`mailto:${business.email}`}><Mail size={15} /> {business.email}</a><p><MapPin size={15} /> {business.shortLocation}</p></div>
        <div><h3>Opening hours</h3><p>{business.hours}</p><a className="social-link" href="https://facebook.com" target="_blank" rel="noreferrer"><Instagram size={16} /> Hair Addict</a></div>
      </div>
      <div className="footer-bottom"><p>© {new Date().getFullYear()} Gee Hair NG</p><p>Made for confident entrances.</p></div>
    </footer>
  );
}
