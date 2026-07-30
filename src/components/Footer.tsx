import Image from "next/image";
import Link from "next/link";
import { Facebook, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { business, whatsappLink } from "@/lib/business";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div><Link className="brand brand-inverse footer-logo" href="/" aria-label="Gee Hair NG home"><Image src="/brand/gee-hair-ng-logo.png" alt="Gee Hair NG" width={170} height={132} /></Link><p>{business.tagline}. Premium 100% virgin hair, personally served from Abuja to you.</p></div>
        <div><h3>Explore</h3><Link href="/shop">Shop collection</Link><Link href="/#story">Our story</Link><Link href="/#how-to-order">How to order</Link><Link href="/services">Other services</Link><Link href="/customer-care">Customer care</Link></div>
        <div><h3>Contact</h3><WhatsAppLink href={whatsappLink(`Hello ${business.name}, I would like to make an enquiry.`)} eventName="general_whatsapp_enquiry" eventData={{ placement: "footer" }}><MessageCircle size={15} /> WhatsApp</WhatsAppLink><a href={`tel:${business.phoneInternational}`}><Phone size={15} /> {business.phoneDisplay}</a><a href={`mailto:${business.email}`}><Mail size={15} /> {business.email}</a><p><MapPin size={15} /> {business.shortLocation}</p></div>
        <div><h3>Find us</h3><p>{business.hours}</p><a className="social-link" href={business.facebookUrl} target="_blank" rel="noreferrer"><Facebook size={16} /> {business.facebook}</a><small className="social-note">Official page link awaiting client confirmation.</small></div>
      </div>
      <div className="footer-bottom"><p>© {new Date().getFullYear()} {business.name}</p><p>{business.tagline}.</p></div>
    </footer>
  );
}
