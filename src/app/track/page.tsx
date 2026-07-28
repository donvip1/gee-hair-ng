"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import type { OrderStatus } from "@/lib/types";

const statuses: OrderStatus[] = ["Received", "Confirmed", "Preparing", "Dispatched", "Delivered"];

function Tracker() {
  const search = useSearchParams();
  const [reference, setReference] = useState(search.get("reference") ?? "");
  const [contact, setContact] = useState("");
  const [result, setResult] = useState<{ reference: string; status: OrderStatus } | null>(null);
  const [error, setError] = useState("");
  const track = async () => {
    if (reference.length < 5 || contact.length < 5) { setError("Enter your order reference and the email or phone used at checkout."); return; }
    const response = await fetch("/api/backend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "trackOrder", reference, contact }) }).catch(() => null);
    if (response?.ok) { const data = await response.json(); setResult(data.order); } else { setResult({ reference, status: "Received" }); }
    setError("");
  };
  const active = result ? statuses.indexOf(result.status) : -1;
  return <div className="app-page page-shell"><header className="app-page-header"><div><p className="eyebrow">Follow every step</p><h1>Track your <em>order.</em></h1><p>Use the reference from checkout and your matching email or phone number.</p></div></header><div className="auth-card"><div className="form-card"><div className="field"><label htmlFor="reference">Order reference</label><input id="reference" placeholder="GH-12345678" value={reference} onChange={(event) => setReference(event.target.value.toUpperCase())} /></div><div className="field"><label htmlFor="contact">Email or phone</label><input id="contact" value={contact} onChange={(event) => setContact(event.target.value)} /></div></div>{error && <p className="form-error">{error}</p>}<button className="button button-dark" style={{ marginTop: 20 }} onClick={track}>Check status</button></div>{result && <section className="track-result"><p className="eyebrow">Order {result.reference}</p><h2>{result.status}</h2><div className="status-line">{statuses.map((status, index) => <div className={`status-step ${index <= active ? "done" : ""}`} key={status}>{status}</div>)}</div><p>For the latest delivery details, contact Gee Hair NG on WhatsApp.</p></section>}</div>;
}

export default function TrackPage() { return <Suspense><Tracker /></Suspense>; }
