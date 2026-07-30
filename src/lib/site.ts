import { business } from "@/lib/business";

const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const fallbackUrl = vercelHost ? `https://${vercelHost}` : "http://localhost:3000";

export const siteUrl = normalizeSiteUrl(configuredUrl || fallbackUrl);

export const site = {
  name: business.name,
  title: `${business.name} — ${business.tagline}`,
  description:
    "Shop 100% virgin hair in 100g bundles from Gee Hair NG in Abuja. Choose your inches, colour and complimentary first-time wigging, then continue directly on WhatsApp.",
  url: siteUrl,
  locale: "en_NG",
  socialImage: "/opengraph-image",
  keywords: [
    "Gee Hair NG",
    "virgin hair Abuja",
    "hair bundles Abuja",
    "100g hair bundles",
    "Bone Straight hair Abuja",
    "hair extensions Karsana",
    "wigging service Abuja"
  ]
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteUrl}/`).toString();
}

export function normalizeSiteUrl(value: string) {
  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    return url.toString().replace(/\/+$/, "");
  } catch {
    return "http://localhost:3000";
  }
}
