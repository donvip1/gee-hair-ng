"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatNaira, whatsappLink } from "@/lib/business";
import { useStore } from "@/lib/store";

const checkoutSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  phone: z.string().min(10, "Enter a valid phone number"),
  email: z.email("Enter a valid email"),
  address: z.string().min(8, "Enter a delivery address or landmark"),
  notes: z.string().max(500).optional()
});
type CheckoutData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const cart = useStore((state) => state.cart);
  const clearCart = useStore((state) => state.clearCart);
  const [reference, setReference] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CheckoutData>({ resolver: zodResolver(checkoutSchema) });
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const submit = async (data: CheckoutData) => {
    const ref = `GH-${Date.now().toString().slice(-8)}`;
    await fetch("/api/backend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "createOrder", reference: ref, ...data, items: cart, total: subtotal }) }).catch(() => null);
    const lines = cart.map((item) => `• ${item.name} — ${item.variant} × ${item.quantity} (${formatNaira(item.unitPrice * item.quantity)})`).join("\n");
    const message = `Hello Gee Hair NG, I would like to confirm order ${ref}.\n\n${lines}\n\nSubtotal: ${formatNaira(subtotal)}\nName: ${data.name}\nPhone: ${data.phone}\nDelivery: ${data.address}${data.notes ? `\nNotes: ${data.notes}` : ""}`;
    setReference(ref);
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
    clearCart();
  };

  if (reference) return <div className="app-page page-shell"><div className="empty-state"><p className="eyebrow">Order created</p><h2>Thank you.</h2><p>Your reference is <strong>{reference}</strong>. Complete the conversation on WhatsApp, then use this reference to track your order.</p><Link className="button button-dark" href={`/track?reference=${reference}`}>Track this order</Link></div></div>;
  if (!cart.length) return <div className="app-page page-shell"><div className="empty-state"><h2>Your bag is empty.</h2><p>Choose your pieces before starting checkout.</p><Link className="button button-dark" href="/shop">Go to shop</Link></div></div>;

  return <div className="app-page page-shell"><header className="app-page-header"><div><p className="eyebrow">Secure order request</p><h1>Complete your <em>details.</em></h1></div></header><div className="checkout-layout"><form className="form-card" onSubmit={handleSubmit(submit)}><div className="field"><label htmlFor="name">Full name</label><input id="name" {...register("name")} />{errors.name && <span className="form-error">{errors.name.message}</span>}</div><div className="field"><label htmlFor="phone">Phone number</label><input id="phone" inputMode="tel" {...register("phone")} />{errors.phone && <span className="form-error">{errors.phone.message}</span>}</div><div className="field full"><label htmlFor="email">Email address</label><input id="email" type="email" {...register("email")} />{errors.email && <span className="form-error">{errors.email.message}</span>}</div><div className="field full"><label htmlFor="address">Delivery address / landmark</label><textarea id="address" {...register("address")} />{errors.address && <span className="form-error">{errors.address.message}</span>}</div><div className="field full"><label htmlFor="notes">Order notes (optional)</label><textarea id="notes" placeholder="Colour, timing or other details" {...register("notes")} /></div><button className="button button-dark" disabled={isSubmitting}>{isSubmitting ? "Creating order…" : "Create order & open WhatsApp"}</button></form><aside className="summary-card"><p className="eyebrow">Your order</p><h2>{cart.length} {cart.length === 1 ? "piece" : "pieces"}</h2>{cart.map((item) => <div className="summary-row" key={item.key}><span>{item.name}<br /><small>{item.variant} × {item.quantity}</small></span><strong>{formatNaira(item.unitPrice * item.quantity)}</strong></div>)}<div className="summary-row"><span>Subtotal</span><strong>{formatNaira(subtotal)}</strong></div><small>No online payment is taken here. Gee Hair NG confirms stock, delivery and payment directly with you.</small></aside></div></div>;
}
