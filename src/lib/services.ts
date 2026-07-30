import { whatsappLink } from "@/lib/business";

export type BusinessService = {
  title: string;
  description: string;
  group: "Importation and sourcing" | "Contribution services";
  whatsappMessage: string;
};

export const businessServices: BusinessService[] = [
  {
    title: "China Importation",
    description: "Enquire about sourcing and importing suitable goods from China.",
    group: "Importation and sourcing",
    whatsappMessage: "Hello Gee Hair NG, I would like to enquire about your China Importation service."
  },
  {
    title: "Bangladesh Importation",
    description: "Discuss product sourcing and importation enquiries connected to Bangladesh.",
    group: "Importation and sourcing",
    whatsappMessage: "Hello Gee Hair NG, I would like to enquire about your Bangladesh Importation service."
  },
  {
    title: "Gadget & iPhone Importation",
    description: "Make an enquiry about gadget and iPhone importation options.",
    group: "Importation and sourcing",
    whatsappMessage: "Hello Gee Hair NG, I would like to enquire about Gadget and iPhone Importation."
  },
  {
    title: "SHEIN Importation",
    description: "Ask about assistance with SHEIN importation and order coordination.",
    group: "Importation and sourcing",
    whatsappMessage: "Hello Gee Hair NG, I would like to enquire about your SHEIN Importation service."
  },
  {
    title: "China Procurement & Sourcing Administrator",
    description: "Discuss China procurement, sourcing and administrative support for an intended purchase.",
    group: "Importation and sourcing",
    whatsappMessage: "Hello Gee Hair NG, I would like to enquire about your China Procurement and Sourcing Administrator service."
  },
  {
    title: "Importation Coaching",
    description: "Enquire about practical guidance for understanding and managing an importation process.",
    group: "Importation and sourcing",
    whatsappMessage: "Hello Gee Hair NG, I would like to enquire about Importation Coaching."
  },
  {
    title: "Luxury Hair Savings Plans",
    description: "Ask about contribution options intended for a future luxury hair purchase.",
    group: "Contribution services",
    whatsappMessage: "Hello Gee Hair NG, I would like to enquire about the Luxury Hair Savings Plan."
  },
  {
    title: "iPhone Savings Plans",
    description: "Ask about contribution options intended for a future iPhone purchase.",
    group: "Contribution services",
    whatsappMessage: "Hello Gee Hair NG, I would like to enquire about the iPhone Savings Plan."
  },
  {
    title: "Daily, Weekly & Monthly Contribution Plans",
    description: "Discuss the available contribution schedule and the terms that apply before joining.",
    group: "Contribution services",
    whatsappMessage: "Hello Gee Hair NG, I would like to enquire about your daily, weekly and monthly contribution plans."
  },
  {
    title: "Goal-Oriented Contribution Options",
    description: "Enquire about a contribution arrangement for a specific purchase goal.",
    group: "Contribution services",
    whatsappMessage: "Hello Gee Hair NG, I would like to enquire about a goal-oriented contribution plan."
  }
];

export function serviceWhatsAppLink(service: BusinessService) {
  return whatsappLink(service.whatsappMessage);
}
