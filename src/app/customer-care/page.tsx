import type { Metadata } from "next";
import { MessageCircle, ShieldCheck } from "lucide-react";
import { CustomerGuidance } from "@/components/CustomerGuidance";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { business, whatsappLink } from "@/lib/business";

export const metadata: Metadata = {
  title: "Customer care and ordering guidance",
  description:
    "Understand how Gee Hair NG confirms prices, availability, delivery, payment, complimentary first-time wigging and after-sales questions on WhatsApp.",
  alternates: { canonical: "/customer-care" }
};

export default function CustomerCarePage() {
  return (
    <div className="page-shell customer-care-page">
      <header className="page-hero customer-care-hero">
        <p className="eyebrow">Know the process before you order</p>
        <h1>Clear, personal <em>service.</em></h1>
        <p>
          This app prepares your product request. {business.name} then confirms the current price, availability, delivery and payment directly through the official WhatsApp number.
        </p>
        <div className="care-assurance">
          <ShieldCheck size={21} strokeWidth={1.6} />
          <p><strong>No hidden website checkout.</strong> Do not send payment using details from an unverified contact.</p>
        </div>
      </header>

      <CustomerGuidance />

      <section className="contact-cta customer-care-cta">
        <div>
          <p className="eyebrow">Need a personal answer?</p>
          <h2>Talk directly to <em>Gee.</em></h2>
          <p>Send your question to the official WhatsApp account and confirm every important detail before payment.</p>
        </div>
        <WhatsAppLink
          className="button button-dark"
          href={whatsappLink("Hello Gee Hair NG, I have a question about ordering and customer care.")}
          eventName="general_whatsapp_enquiry"
          eventData={{ placement: "customer_care" }}
        >
          <MessageCircle size={18} /> Ask on WhatsApp
        </WhatsAppLink>
      </section>
    </div>
  );
}
