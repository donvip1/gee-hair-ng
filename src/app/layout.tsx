import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Gee Hair NG — Beauty delivered, Confidence unleashed", template: "%s | Gee Hair NG" },
  description: "Shop 100% virgin hair in 100g bundles from Gee Hair NG. Choose your inches, colour and free first-time wigging, then order directly on WhatsApp.",
  applicationName: "Gee Hair NG",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Gee Hair NG" },
  icons: { icon: "/icon.svg", apple: "/icon.svg" }
};

export const viewport: Viewport = { themeColor: "#f4eee5", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
