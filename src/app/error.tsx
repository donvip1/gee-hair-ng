"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(JSON.stringify({ level: "error", service: "storefront", event: "route_error", digest: error.digest, message: error.message })); }, [error]);
  return <div className="app-page page-shell"><div className="empty-state"><p className="eyebrow">Something went wrong</p><h1 className="state-title">Let&apos;s try <em>again.</em></h1><p>The page could not be prepared. Your payment details and transactions are never handled here.</p><button type="button" className="button button-dark" onClick={reset}>Reload this page</button></div></div>;
}
