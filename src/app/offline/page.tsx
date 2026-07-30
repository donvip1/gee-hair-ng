import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "You are offline",
  robots: { index: false, follow: false }
};

export default function OfflinePage() {
  return <div className="app-page page-shell"><div className="empty-state"><p className="eyebrow">You are offline</p><h1 className="state-title">Still <em>beautiful.</em></h1><p>Reconnect to view the latest products and service information or to continue an enquiry on WhatsApp.</p><Link className="button button-dark" href="/">Try again</Link></div></div>;
}
