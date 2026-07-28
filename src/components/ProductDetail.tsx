"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Heart, MessageCircle, ShoppingBag } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatNaira, whatsappLink } from "@/lib/business";
import { useStore } from "@/lib/store";

export function ProductDetail({ product }: { product: Product }) {
  const [variant, setVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addToCart = useStore((state) => state.addToCart);
  const wishlist = useStore((state) => state.wishlist);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const liked = wishlist.includes(product.id);

  const add = () => { addToCart(product, variant.label, quantity); setAdded(true); window.setTimeout(() => setAdded(false), 2200); };

  return (
    <div className="product-detail">
      <div className="product-gallery">{product.images.map((image, index) => <div className="detail-image" key={image}><Image src={image} alt={`${product.name} view ${index + 1}`} fill priority={index === 0} sizes="(max-width: 1000px) 100vw, 35vw" /></div>)}</div>
      <section className="product-panel"><p className="eyebrow">{product.category} · {product.texture}</p><h1>{product.name}</h1><p className="product-price">{formatNaira(variant.price)}</p><p className="product-description">{product.description}</p><div className="option-label"><span>Choose option</span><span>{variant.stock} available</span></div><div className="variant-grid">{product.variants.map((item) => <button className={`variant-button ${item.label === variant.label ? "active" : ""}`} key={item.label} onClick={() => setVariant(item)}>{item.label}</button>)}</div><div className="add-row"><div className="quantity-box"><button aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button><span>{quantity}</span><button aria-label="Increase quantity" onClick={() => setQuantity(Math.min(variant.stock, quantity + 1))}>+</button></div><button className="button button-dark" onClick={add}><ShoppingBag size={17} /> {added ? "Added to bag" : "Add to bag"}</button></div><button className="button full-button" onClick={() => toggleWishlist(product.id)}><Heart size={17} fill={liked ? "currentColor" : "none"} /> {liked ? "Saved to wishlist" : "Save to wishlist"}</button><a className="button full-button" href={whatsappLink(`Hello Gee Hair NG, I am interested in ${product.name}, ${variant.label}.`)} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Ask about this piece</a><ul className="detail-list">{product.details.map((detail) => <li key={detail}><Check size={16} /> {detail}</li>)}</ul><Link className="text-link" href="/shop">← Back to collection</Link></section>
    </div>
  );
}
