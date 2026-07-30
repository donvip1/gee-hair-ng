import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { customerGuidance } from "@/lib/customer-guidance";

export function CustomerGuidance({ compact = false }: { compact?: boolean }) {
  const items = compact ? customerGuidance.slice(0, 4) : customerGuidance;

  return (
    <section className={`guidance ${compact ? "guidance-compact" : ""}`} id="customer-care" aria-labelledby="guidance-heading">
      <div className="guidance-heading">
        <div>
          <p className="eyebrow">Clear before you order</p>
          <h2 id="guidance-heading">Customer <em>care.</em></h2>
        </div>
        <p>
          We do not publish unconfirmed prices, delivery promises or payment details. Gee confirms the facts for your exact request on the official WhatsApp account.
        </p>
      </div>
      <div className="guidance-list">
        {items.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
      {compact && (
        <Link className="text-link guidance-link" href="/customer-care">
          Read all customer guidance <ArrowRight size={15} />
        </Link>
      )}
    </section>
  );
}
