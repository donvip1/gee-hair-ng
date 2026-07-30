import type { Metadata } from "next";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { ServicesShowcase } from "@/components/ServicesShowcase";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { business, whatsappLink } from "@/lib/business";

export const metadata: Metadata = {
  title: "Importation, sourcing and contribution services",
  description: "Enquire about Gee Hair NG China and Bangladesh importation, gadget and iPhone importation, SHEIN importation, procurement, sourcing and contribution services.",
  alternates: { canonical: "/services" }
};

export default function ServicesPage() {
  return (
    <div className="page-shell services-page">
      <header className="page-hero services-page-hero">
        <p className="eyebrow">Gee Prime services</p>
        <h1>Source, import and <em>plan.</em></h1>
        <p>Alongside premium hair, Gee provides importation, procurement, sourcing guidance and contribution-related services. Every enquiry begins on the official WhatsApp account so the exact scope and terms can be confirmed.</p>
      </header>
      <ServicesShowcase />
      <section className="qr-contact" aria-labelledby="qr-heading">
        <div className="qr-contact-copy">
          <p className="eyebrow">Official WhatsApp contact</p>
          <h2 id="qr-heading">Scan to message <em>Gee Hair NG.</em></h2>
          <p>Open your phone camera and point it at the code. It directs you to the verified Gee Hair NG WhatsApp chat, where you can enquire about hair, importation, sourcing or contribution services.</p>
          <dl className="qr-destination-details">
            <div><dt>Destination</dt><dd>WhatsApp chat with Gee Hair NG</dd></div>
            <div><dt>Official number</dt><dd>{business.phoneDisplay}</dd></div>
            <div><dt>Business location</dt><dd>{business.shortLocation}</dd></div>
          </dl>
          <p className="qr-safety-note">Always confirm that WhatsApp displays <strong>{business.phoneDisplay}</strong> before sending a message or discussing a transaction.</p>
          <WhatsAppLink className="button button-dark" href={whatsappLink(`Hello ${business.name}, I would like to enquire about your other services.`)} eventName="general_whatsapp_enquiry" eventData={{ placement: "services_qr" }}><MessageCircle size={18} /> Open official WhatsApp</WhatsAppLink>
        </div>
        <figure className="qr-card">
          <div className="qr-frame"><Image src="/brand/gee-hair-ng-whatsapp-qr.png" alt={`QR code opening the official ${business.name} WhatsApp chat at ${business.phoneDisplay}`} fill sizes="(max-width: 700px) 78vw, 340px" /></div>
          <figcaption><strong>Gee Hair NG on WhatsApp</strong><span>{business.phoneDisplay}</span><small>Scan with your phone camera</small></figcaption>
        </figure>
      </section>
    </div>
  );
}
