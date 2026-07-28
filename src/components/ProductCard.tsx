"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatNaira } from "@/lib/business";
import { useStore } from "@/lib/store";

export function ProductCard({ product }: { product: Product }) {
  const wishlist = useStore((state) => state.wishlist);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const addToCart = useStore((state) => state.addToCart);
  const liked = wishlist.includes(product.id);

  return (
    <article className="product-card">
      <div className="product-media">
        <Link href={`/shop/${product.slug}`}><Image src={product.image} alt={product.name} fill sizes="(max-width: 700px) 50vw, 25vw" /></Link>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button className={`heart-button ${liked ? "liked" : ""}`} onClick={() => toggleWishlist(product.id)} aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}><Heart size={18} fill={liked ? "currentColor" : "none"} /></button>
        <button className="quick-add" onClick={() => addToCart(product, product.variants[0].label)}><ShoppingBag size={16} /> Quick add</button>
      </div>
      <div className="product-card-info">
        <div><Link href={`/shop/${product.slug}`}><h3>{product.name}</h3></Link><p>{product.texture}</p></div>
        <strong>From {formatNaira(product.basePrice)}</strong>
      </div>
    </article>
  );
}
