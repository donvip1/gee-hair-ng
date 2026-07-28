"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { ImagePlus, Pencil, Plus, Trash2, X } from "lucide-react";
import { AdminNav } from "@/components/AdminNav";
import type { Product, ProductCategory, ProductInput } from "@/lib/types";

const blank: ProductInput = { slug: "", name: "", category: "Curls", texture: "", description: "", details: ["100% virgin hair", "100g per bundle", "All colours available", "Free wigging for first-time customers"], image: "", images: [], minLength: 10, maxLength: 30, lengthStep: 2, colours: "All colours available", bundleWeightGrams: 100, featured: true, active: true };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [writable, setWritable] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    const response = await fetch("/api/admin/products", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) setError(data.error ?? "Unable to load products.");
    else { setProducts(data.products); setWritable(Boolean(data.writable)); if (!data.writable) setMessage("Preview mode: connect Google Apps Script and Drive to enable product changes."); }
    setLoading(false);
  }, []);
  useEffect(() => { void load(); }, [load]);

  const save = async (event: FormEvent) => {
    event.preventDefault(); if (!form) return;
    setSaving(true); setError(""); setMessage("");
    const response = await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, images: form.images?.length ? form.images : [form.image] }) });
    const data = await response.json(); setSaving(false);
    if (!response.ok) { setError(data.error ?? "Unable to save product."); return; }
    setForm(null); setMessage("Product saved successfully."); await load();
  };

  const remove = async (product: Product) => {
    if (!window.confirm(`Delete ${product.name}? This removes it from the live catalog.`)) return;
    const response = await fetch("/api/admin/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: product.id }) });
    const data = await response.json();
    if (!response.ok) setError(data.error ?? "Unable to delete product."); else { setMessage(`${product.name} was deleted.`); await load(); }
  };

  const upload = async (file?: File) => {
    if (!file || !form) return;
    setUploading(true); setError("");
    const body = new FormData(); body.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const data = await response.json(); setUploading(false);
    if (!response.ok) setError(data.error ?? "Unable to upload image."); else setForm({ ...form, image: data.imageUrl, images: [data.imageUrl], imagePending: false });
  };

  return <div className="admin-shell"><AdminNav /><section className="admin-content"><div className="app-page-header"><div><p className="eyebrow">Live catalog management</p><h1>Products.</h1></div><button className="button button-dark" disabled={!writable} onClick={() => setForm({ ...blank })}><Plus size={17} /> Add product</button></div>{message && <div className="success-panel">{message}</div>}{error && <div className="admin-error">{error}</div>}{loading ? <p>Loading products…</p> : <div className="admin-product-grid">{products.map((product) => <article className="admin-product-card" key={product.id}><div className="admin-product-image"><Image src={product.image} alt={product.name} fill sizes="180px" /></div><div><span className={`status-chip ${product.active ? "" : "inactive"}`}>{product.active ? "Live" : "Hidden"}</span><h2>{product.name}</h2><p>{product.minLength}–{product.maxLength} inches · {product.bundleWeightGrams}g bundles</p><div className="admin-card-actions"><button className="pill" disabled={!writable} onClick={() => setForm({ ...product })}><Pencil size={14} /> Edit</button><button className="pill danger-pill" disabled={!writable} onClick={() => void remove(product)}><Trash2 size={14} /> Delete</button></div></div></article>)}</div>}

      {form && <div className="admin-modal" role="dialog" aria-modal="true" aria-label="Product editor"><button className="admin-modal-backdrop" aria-label="Close editor" onClick={() => setForm(null)} /><form className="admin-editor" onSubmit={save}><div className="admin-editor-head"><div><p className="eyebrow">Catalog item</p><h2>{form.id ? "Edit product" : "Add product"}</h2></div><button type="button" className="icon-button" onClick={() => setForm(null)}><X /></button></div><div className="form-card"><Field label="Product name"><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value, slug: form.id ? form.slug : slugify(event.target.value) })} /></Field><Field label="URL slug"><input value={form.slug} onChange={(event) => setForm({ ...form, slug: slugify(event.target.value) })} /></Field><Field label="Category"><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as ProductCategory })}><option>Straight</option><option>Curls</option><option>Waves</option></select></Field><Field label="Texture"><input value={form.texture} onChange={(event) => setForm({ ...form, texture: event.target.value })} /></Field><Field label="Minimum inches"><input type="number" min="1" value={form.minLength} onChange={(event) => setForm({ ...form, minLength: Number(event.target.value) })} /></Field><Field label="Maximum inches"><input type="number" min="1" value={form.maxLength} onChange={(event) => setForm({ ...form, maxLength: Number(event.target.value) })} /></Field><Field label="Bundle weight (grams)"><input type="number" min="1" value={form.bundleWeightGrams} onChange={(event) => setForm({ ...form, bundleWeightGrams: Number(event.target.value) })} /></Field><Field label="Colours"><input value={form.colours} onChange={(event) => setForm({ ...form, colours: event.target.value })} /></Field><div className="field full"><label>Description</label><textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></div><div className="field full"><label>Product image</label><div className="upload-row"><input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value, images: [event.target.value] })} placeholder="Image URL" /><label className="button image-upload"><ImagePlus size={16} /> {uploading ? "Uploading…" : "Upload image"}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={(event) => void upload(event.target.files?.[0])} /></label></div></div><label className="check-option"><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} /><span><strong>Featured on home page</strong></span></label><label className="check-option"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} /><span><strong>Visible in public catalog</strong></span></label></div><button className="button button-dark full-button" disabled={saving || uploading}>{saving ? "Saving…" : "Save product"}</button></form></div>}
    </section></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="field"><label>{label}</label>{children}</div>; }
function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
