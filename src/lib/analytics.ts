import { track } from "@vercel/analytics";

export type CommerceEvent =
  | "view_product"
  | "search_catalog"
  | "filter_catalog"
  | "product_whatsapp_enquiry"
  | "configured_whatsapp_order"
  | "general_whatsapp_enquiry"
  | "request_first_time_wigging";

type EventData = Record<string, string | number | boolean>;

export function trackCommerceEvent(name: CommerceEvent, data: EventData = {}) {
  if (typeof window === "undefined") return;
  track(name, data);
}
