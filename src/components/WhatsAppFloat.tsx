import { MessageCircle } from "lucide-react";
import { business, whatsappLink } from "@/lib/business";

export function WhatsAppFloat() {
  return <a className="whatsapp-float" href={whatsappLink(`Hello ${business.name}, I would like to make an enquiry.`)} target="_blank" rel="noreferrer" aria-label="Chat with Gee Hair NG on WhatsApp"><MessageCircle size={23} /><span>Chat with Gee</span></a>;
}
