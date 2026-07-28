"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import type { Product } from "@/lib/types";
import { whatsappLink } from "@/lib/business";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <div className="product-media">
        <Link href={`/shop/${product.slug}`}><Image src={product.image} alt={product.name} fill sizes="(max-width: 700px) 50vw, 25vw" /></Link>
        {product.imagePending && <span className="product-badge">Photo coming soon</span>}
        <Link className="quick-add" href={`/shop/${product.slug}`}><ArrowRight size={16} /> Choose &amp; order</Link>
      </div>
      <div className="product-card-info">
        <div><Link href={`/shop/${product.slug}`}><h3>{product.name}</h3></Link><p>{product.minLength}–{product.maxLength} inches · 100g bundles</p></div>
        <a className="product-enquire" aria-label={`Ask about ${product.name} on WhatsApp`} href={whatsappLink(`Hello Gee Hair NG, I would like to enquire about ${product.name}.`)} target="_blank" rel="noreferrer"><MessageCircle size={17} /><strong>Price on request</strong></a>
      </div>
    </article>
  );
}
