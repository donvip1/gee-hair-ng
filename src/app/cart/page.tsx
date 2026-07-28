"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { formatNaira } from "@/lib/business";
import { useStore } from "@/lib/store";

export default function CartPage() {
  const cart = useStore((state) => state.cart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const remove = useStore((state) => state.removeFromCart);
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return <div className="app-page page-shell"><header className="app-page-header"><div><p className="eyebrow">Your selection</p><h1>Shopping <em>bag.</em></h1></div><Link className="text-link" href="/shop">Continue shopping →</Link></header>{!cart.length ? <div className="empty-state"><ShoppingBag size={34} /><h2>Your bag is waiting.</h2><p>Add a piece you love to begin your order.</p><Link className="button button-dark" href="/shop">Explore the collection</Link></div> : <div className="cart-layout"><div className="cart-list">{cart.map((item) => <article className="cart-item" key={item.key}><div className="cart-thumb"><Image src={item.image} alt={item.name} fill sizes="120px" /></div><div><Link href={`/shop/${item.slug}`}><h3>{item.name}</h3></Link><p>{item.variant}</p><div className="quantity-box" style={{ width: 100, height: 38 }}><button onClick={() => updateQuantity(item.key, item.quantity - 1)}>−</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.key, item.quantity + 1)}>+</button></div><button className="remove-button" onClick={() => remove(item.key)}>Remove</button></div><strong className="cart-price">{formatNaira(item.unitPrice * item.quantity)}</strong></article>)}</div><aside className="summary-card"><p className="eyebrow">Order summary</p><h2>Almost yours.</h2><div className="summary-row"><span>Subtotal</span><strong>{formatNaira(subtotal)}</strong></div><Link className="button button-dark full-button" href="/checkout">Continue to checkout</Link><small>Delivery cost and product availability are confirmed before payment.</small></aside></div>}</div>;
}
