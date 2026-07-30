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
        <div><p className="eyebrow">Scan or tap</p><h2 id="qr-heading">Contact Gee on <em>WhatsApp.</em></h2><p>Scan the official QR code using your phone camera, or use the button to open a direct message. Confirm fees, timelines and all service terms before proceeding.</p><WhatsAppLink className="button button-dark" href={whatsappLink(`Hello ${business.name}, I would like to enquire about your other services.`)} eventName="general_whatsapp_enquiry" eventData={{ placement: "services_qr" }}><MessageCircle size={18} /> Message Gee Hair NG</WhatsAppLink></div>
        <div className="qr-frame"><Image src="/brand/gee-hair-ng-whatsapp-qr.jpeg" alt="Official Gee Hair NG WhatsApp QR code" fill sizes="(max-width: 700px) 80vw, 360px" /></div>
      </section>
    </div>
  );
}
