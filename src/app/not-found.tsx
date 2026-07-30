import Link from "next/link";

export default function NotFound() {
  return <div className="app-page page-shell"><div className="empty-state"><p className="eyebrow">Page not found</p><h1 className="state-title">This look has <em>moved.</em></h1><p>The product or page you requested is not currently available.</p><div className="state-actions"><Link className="button button-dark" href="/shop">Browse the collection</Link><Link className="text-link" href="/services">View other services</Link></div></div></div>;
}
