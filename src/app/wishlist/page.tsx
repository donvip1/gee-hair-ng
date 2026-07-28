"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";
import { useStore } from "@/lib/store";

export default function WishlistPage() {
  const wishlist = useStore((state) => state.wishlist);
  const saved = products.filter((product) => wishlist.includes(product.id));
  return <div className="app-page page-shell"><header className="app-page-header"><div><p className="eyebrow">Saved for later</p><h1>Your <em>wishlist.</em></h1></div></header>{saved.length ? <div className="product-grid shop-grid">{saved.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><Heart size={34} /><h2>Nothing saved yet.</h2><p>Tap the heart on any piece you want to remember.</p><Link className="button button-dark" href="/shop">Find a favourite</Link></div>}</div>;
}
