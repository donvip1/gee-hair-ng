"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, MessageCircle, Minus, Plus, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { business, whatsappLink } from "@/lib/business";
import { getLengthOptions } from "@/lib/products";

export function ProductDetail({ product }: { product: Product }) {
  const lengthOptions = useMemo(() => getLengthOptions(product), [product]);
  const [inches, setInches] = useState(product.minLength);
  const [colour, setColour] = useState("Natural black");
  const [bundles, setBundles] = useState(1);
  const [firstTimer, setFirstTimer] = useState(false);
  const [wigging, setWigging] = useState(false);
  const [notes, setNotes] = useState("");
  const totalGrams = bundles * product.bundleWeightGrams;

  const orderMessage = [
    `Hello ${business.name}, I would like to order:`,
    "",
    `Product: ${product.name}`,
    `Length: ${inches} inches`,
    `Colour: ${colour.trim() || "Please help me choose"}`,
    `Bundles: ${bundles} × ${product.bundleWeightGrams}g (${totalGrams}g total)`,
    `First-time customer: ${firstTimer ? "Yes" : "No"}`,
    `Free wigging service: ${firstTimer && wigging ? "Yes, please" : "Not requested"}`,
    notes.trim() ? `Notes: ${notes.trim()}` : "",
    "",
    "Please confirm the price, availability and next steps. Thank you."
  ].filter(Boolean).join("\n");

  return (
    <div className="product-detail">
      <div className="product-gallery">
        {product.images.map((image, index) => <div className="detail-image" key={image}><Image src={image} alt={`${product.name} view ${index + 1}`} fill priority={index === 0} sizes="(max-width: 1000px) 100vw, 55vw" /></div>)}
      </div>
      <section className="product-panel">
        <p className="eyebrow">100% virgin hair · {product.category}</p>
        <h1>{product.name}</h1>
        <p className="product-price">Price on request</p>
        <p className="product-description">{product.description}</p>

        <div className="config-summary"><span><strong>{product.minLength}–{product.maxLength}&quot;</strong> available</span><span><strong>{product.bundleWeightGrams}g</strong> per bundle</span><span><strong>All</strong> colours</span></div>

        <div className="option-label"><label htmlFor="length">Choose length</label><span>{inches} inches</span></div>
        <select id="length" className="config-select" value={inches} onChange={(event) => setInches(Number(event.target.value))}>{lengthOptions.map((length) => <option value={length} key={length}>{length} inches</option>)}</select>

        <div className="option-label"><label htmlFor="colour">Preferred colour</label><span>All colours available</span></div>
        <input id="colour" className="config-input" value={colour} onChange={(event) => setColour(event.target.value)} placeholder="E.g. natural black, burgundy, blonde" />

        <div className="option-label"><span>Number of bundles</span><span>{totalGrams}g total</span></div>
        <div className="bundle-stepper"><button type="button" aria-label="Remove one bundle" onClick={() => setBundles(Math.max(1, bundles - 1))}><Minus size={17} /></button><strong>{bundles}</strong><span>{bundles === 1 ? "bundle" : "bundles"}</span><button type="button" aria-label="Add one bundle" onClick={() => setBundles(Math.min(12, bundles + 1))}><Plus size={17} /></button></div>

        <label className="check-option"><input type="checkbox" checked={firstTimer} onChange={(event) => { setFirstTimer(event.target.checked); if (!event.target.checked) setWigging(false); }} /><span><strong>I am a first-time customer</strong><small>You qualify for complimentary wigging.</small></span></label>
        {firstTimer && <label className="check-option accent-option"><input type="checkbox" checked={wigging} onChange={(event) => setWigging(event.target.checked)} /><Sparkles size={19} /><span><strong>Yes, wig my hair for free</strong><small>Complimentary service for your first order.</small></span></label>}

        <div className="option-label"><label htmlFor="notes">Anything else?</label><span>Optional</span></div>
        <textarea id="notes" className="config-input config-notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Tell Gee about your preferred style, closure, frontal or deadline." />

        <a className="button button-dark full-button whatsapp-order" href={whatsappLink(orderMessage)} target="_blank" rel="noreferrer"><MessageCircle size={19} /> Continue on WhatsApp</a>
        <p className="whatsapp-note">Your selections will be placed into a WhatsApp message. Gee will confirm the price, availability, delivery and payment directly with you.</p>
        <ul className="detail-list">{product.details.map((detail) => <li key={detail}><Check size={16} /> {detail}</li>)}</ul>
        <Link className="text-link" href="/shop">← Back to collection</Link>
      </section>
    </div>
  );
}
