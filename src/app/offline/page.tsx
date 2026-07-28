import Link from "next/link";

export default function OfflinePage() {
  return <div className="app-page page-shell"><div className="empty-state"><p className="eyebrow">You are offline</p><h1 style={{ fontSize: 70 }}>Still <em>beautiful.</em></h1><p>Reconnect to view the latest products, account information and order status.</p><Link className="button button-dark" href="/">Try again</Link></div></div>;
}
