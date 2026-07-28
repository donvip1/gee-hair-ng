import Link from "next/link";
import { Facebook, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { business, whatsappLink } from "@/lib/business";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div><Link className="brand brand-inverse" href="/"><span className="brand-mark">G</span><span>Gee Hair <em>NG</em></span></Link><p>{business.tagline}. Premium 100% virgin hair, personally served from Abuja to you.</p></div>
        <div><h3>Explore</h3><Link href="/shop">Shop collection</Link><Link href="/#story">Our story</Link><Link href="/#how-to-order">How to order</Link></div>
        <div><h3>Contact</h3><a href={whatsappLink(`Hello ${business.name}, I would like to make an enquiry.`)} target="_blank" rel="noreferrer"><MessageCircle size={15} /> WhatsApp</a><a href={`tel:${business.phoneInternational}`}><Phone size={15} /> {business.phoneDisplay}</a><a href={`mailto:${business.email}`}><Mail size={15} /> {business.email}</a><p><MapPin size={15} /> {business.shortLocation}</p></div>
        <div><h3>Find us</h3><p>{business.hours}</p><a className="social-link" href={business.facebookUrl} target="_blank" rel="noreferrer"><Facebook size={16} /> {business.facebook}</a></div>
      </div>
      <div className="footer-bottom"><p>© {new Date().getFullYear()} {business.name}</p><p>{business.tagline}.</p></div>
    </footer>
  );
}
