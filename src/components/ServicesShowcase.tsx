import { ArrowUpRight, Landmark, PackageSearch } from "lucide-react";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { businessServices, serviceWhatsAppLink } from "@/lib/services";

export function ServicesShowcase({ compact = false }: { compact?: boolean }) {
  const services = compact ? businessServices.filter((service) => service.group === "Importation and sourcing").slice(0, 5) : businessServices;
  const groups = ["Importation and sourcing", "Contribution services"] as const;

  return (
    <section className={`services-showcase ${compact ? "services-compact" : ""}`} id="other-services" aria-labelledby="services-title">
      <div className="services-heading">
        <div><p className="eyebrow">Beyond premium hair</p><h2 id="services-title">Other professional <em>services.</em></h2></div>
        <p>Choose a service to begin a direct WhatsApp enquiry. Scope, availability, fees and applicable terms are confirmed by Gee before you proceed.</p>
      </div>
      {groups.map((group) => {
        const items = services.filter((service) => service.group === group);
        if (!items.length) return null;
        return (
          <div className="service-group" key={group}>
            <div className="service-group-title">{group === "Importation and sourcing" ? <PackageSearch size={21} /> : <Landmark size={21} />}<h3>{group}</h3></div>
            <div className="service-card-grid">
              {items.map((service) => (
                <WhatsAppLink className="service-card" key={service.title} href={serviceWhatsAppLink(service)} eventName="general_whatsapp_enquiry" eventData={{ placement: "other_services", service: service.title }}>
                  <span>{service.title}</span><p>{service.description}</p><strong>Enquire on WhatsApp <ArrowUpRight size={15} /></strong>
                </WhatsAppLink>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
