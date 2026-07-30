import { MessageCircle } from "lucide-react";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { business, whatsappLink } from "@/lib/business";

export function WhatsAppFloat() {
  return <WhatsAppLink className="whatsapp-float" href={whatsappLink(`Hello ${business.name}, I would like to make an enquiry.`)} eventName="general_whatsapp_enquiry" eventData={{ placement: "floating_button" }} aria-label="Chat with Gee Hair NG on WhatsApp"><MessageCircle size={23} /><span>Chat with Gee</span></WhatsAppLink>;
}
