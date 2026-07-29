"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  ImagePlus,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X
} from "lucide-react";
import { AdminNav } from "@/components/AdminNav";
import type {
  CatalogHealth,
  Product,
  ProductCategory,
  ProductInput
} from "@/lib/types";

type BackendStatus = "loading" | "unconfigured" | "unhealthy" | "ready";

type AdminCatalogResponse = {
  products?: Product[];
  writable?: boolean;
  backendStatus?: Exclude<BackendStatus, "loading">;
  health?: CatalogHealth;
  error?: string;
};

const blank: ProductInput = {
  slug: "",
  name: "",
  category: "Curls",
  texture: "",
  description: "",
  details: [
    "100% virgin hair",
    "100g per bundle",
    "All colours available",
    "Free wigging for first-time customers"
  ],
  image: "",
  images: [],
  minLength: 10,
  maxLength: 30,
  lengthStep: 2,
  colours: "All colours available",
  bundleWeightGrams: 100,
  featured: true,
  active: true
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [writable, setWritable] = useState(false);
  const [backendStatus, setBackendStatus] = useState<BackendStatus>("loading");
  const [health, setHealth] = useState<CatalogHealth | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/products", { cache: "no-store" });
      const data = (await response.json()) as AdminCatalogResponse;
      const status = data.backendStatus ?? (response.ok ? "ready" : "unhealthy");

      setBackendStatus(status);
      setWritable(Boolean(data.writable));
      setHealth(data.health ?? null);
      setProducts(data.products ?? []);

      if (status === "unconfigured") {
        setMessage(
          "Preview mode: add the Apps Script URL and shared secret to Vercel, then redeploy."
        );
      } else if (!response.ok) {
        setError(
          data.error ??
            "The catalog backend is configured but did not pass its health check."
        );
      } else if ((data.products ?? []).length === 0) {
        setMessage(
          "Your live catalog is connected and empty. Use Add product to publish the first item."
        );
      }
    } catch {
      setBackendStatus("unhealthy");
      setWritable(false);
      setProducts([]);
      setError("Unable to reach the catalog API. Refresh the page and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!form) return;

    setSaving(true);
    setError("");
    setMessage("");

    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        images: form.images?.length ? form.images : [form.image]
      })
    });
    const data = await response.json();
    setSaving(false);

    if (!response.ok) {
      setError(data.error ?? "Unable to save product.");
      return;
    }

    setForm(null);
    await load();
    setMessage("Product saved successfully and is available to the storefront.");
  };

  const remove = async (product: Product) => {
    if (!window.confirm(`Delete ${product.name}? This removes it from the live catalog.`)) {
      return;
    }

    setError("");
    setMessage("");
    const response = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: product.id })
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Unable to delete product.");
      return;
    }

    await load();
    setMessage(`${product.name} was deleted.`);
  };

  const upload = async (file?: File) => {
    if (!file || !form) return;

    setUploading(true);
    setError("");
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const data = await response.json();
    setUploading(false);

    if (!response.ok) {
      setError(data.error ?? "Unable to upload image.");
      return;
    }

    setForm({
      ...form,
      image: data.imageUrl,
      images: [data.imageUrl],
      imagePending: false
    });
    setMessage("Image uploaded. Save the product to publish this change.");
  };

  return (
    <div className="admin-shell">
      <AdminNav />
      <section className="admin-content">
        <div className="app-page-header">
          <div>
            <p className="eyebrow">Live catalog management</p>
            <h1>Products.</h1>
          </div>
          <div className="admin-header-actions">
            <button className="pill" onClick={() => void load()} disabled={loading}>
              <RefreshCw size={15} /> Refresh
            </button>
            <button
              className="button button-dark"
              disabled={!writable}
              onClick={() => setForm({ ...blank })}
            >
              <Plus size={17} /> Add product
            </button>
          </div>
        </div>

        <CatalogStatus
          status={backendStatus}
          health={health}
          productCount={products.length}
        />
        {message && <div className="success-panel">{message}</div>}
        {error && <div className="admin-error">{error}</div>}

        {loading ? (
          <p>Checking the live catalog…</p>
        ) : products.length ? (
          <div className="admin-product-grid">
            {products.map((product) => (
              <article className="admin-product-card" key={product.id}>
                <div className="admin-product-image">
                  <Image src={product.image} alt={product.name} fill sizes="180px" />
                </div>
                <div>
                  <span className={`status-chip ${product.active ? "" : "inactive"}`}>
                    {product.active ? "Live" : "Hidden"}
                  </span>
                  <h2>{product.name}</h2>
                  <p>
                    {product.minLength}–{product.maxLength} inches ·{" "}
                    {product.bundleWeightGrams}g bundles
                  </p>
                  <div className="admin-card-actions">
                    <button
                      className="pill"
                      disabled={!writable}
                      onClick={() => setForm({ ...product })}
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      className="pill danger-pill"
                      disabled={!writable}
                      onClick={() => void remove(product)}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-empty-state">
            <ImagePlus size={30} />
            <h2>{writable ? "Your live catalog is empty." : "No writable live catalog yet."}</h2>
            <p>
              {writable
                ? "Add the first product to begin publishing items to the storefront."
                : "Complete the Apps Script, Google Sheet, Drive and Vercel environment setup below the dashboard instructions."}
            </p>
            {writable && (
              <button className="button button-dark" onClick={() => setForm({ ...blank })}>
                <Plus size={17} /> Add first product
              </button>
            )}
          </div>
        )}

        {form && (
          <div className="admin-modal" role="dialog" aria-modal="true" aria-label="Product editor">
            <button
              className="admin-modal-backdrop"
              aria-label="Close editor"
              onClick={() => setForm(null)}
            />
            <form className="admin-editor" onSubmit={save}>
              <div className="admin-editor-head">
                <div>
                  <p className="eyebrow">Catalog item</p>
                  <h2>{form.id ? "Edit product" : "Add product"}</h2>
                </div>
                <button type="button" className="icon-button" onClick={() => setForm(null)}>
                  <X />
                </button>
              </div>

              <div className="form-card">
                <Field label="Product name">
                  <input
                    required
                    value={form.name}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        name: event.target.value,
                        slug: form.id ? form.slug : slugify(event.target.value)
                      })
                    }
                  />
                </Field>
                <Field label="URL slug">
                  <input
                    required
                    value={form.slug}
                    onChange={(event) =>
                      setForm({ ...form, slug: slugify(event.target.value) })
                    }
                  />
                </Field>
                <Field label="Category">
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value as ProductCategory })
                    }
                  >
                    <option>Straight</option>
                    <option>Curls</option>
                    <option>Waves</option>
                  </select>
                </Field>
                <Field label="Texture">
                  <input
                    required
                    value={form.texture}
                    onChange={(event) => setForm({ ...form, texture: event.target.value })}
                  />
                </Field>
                <Field label="Minimum inches">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={form.minLength}
                    onChange={(event) =>
                      setForm({ ...form, minLength: Number(event.target.value) })
                    }
                  />
                </Field>
                <Field label="Maximum inches">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={form.maxLength}
                    onChange={(event) =>
                      setForm({ ...form, maxLength: Number(event.target.value) })
                    }
                  />
                </Field>
                <Field label="Length step">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={form.lengthStep}
                    onChange={(event) =>
                      setForm({ ...form, lengthStep: Number(event.target.value) })
                    }
                  />
                </Field>
                <Field label="Bundle weight (grams)">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={form.bundleWeightGrams}
                    onChange={(event) =>
                      setForm({ ...form, bundleWeightGrams: Number(event.target.value) })
                    }
                  />
                </Field>
                <Field label="Colours">
                  <input
                    required
                    value={form.colours}
                    onChange={(event) => setForm({ ...form, colours: event.target.value })}
                  />
                </Field>
                <div className="field full">
                  <label>Description</label>
                  <textarea
                    required
                    value={form.description}
                    onChange={(event) =>
                      setForm({ ...form, description: event.target.value })
                    }
                  />
                </div>
                <div className="field full">
                  <label>Product image</label>
                  <div className="upload-row">
                    <input
                      required
                      value={form.image}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          image: event.target.value,
                          images: [event.target.value]
                        })
                      }
                      placeholder="Upload an image or enter a public URL"
                    />
                    <label className="button image-upload">
                      <ImagePlus size={16} /> {uploading ? "Uploading…" : "Upload image"}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={uploading}
                        onChange={(event) => void upload(event.target.files?.[0])}
                      />
                    </label>
                  </div>
                </div>
                <label className="check-option">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) =>
                      setForm({ ...form, featured: event.target.checked })
                    }
                  />
                  <span>
                    <strong>Feature this product</strong>
                    <small>Show it in the homepage collection.</small>
                  </span>
                </label>
                <label className="check-option">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(event) =>
                      setForm({ ...form, active: event.target.checked })
                    }
                  />
                  <span>
                    <strong>Product is live</strong>
                    <small>Hidden products stay in admin but disappear from the store.</small>
                  </span>
                </label>
              </div>

              <button
                className="button button-dark full-button admin-save-button"
                disabled={saving || uploading}
              >
                {saving ? "Saving…" : "Save product"}
              </button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}

function CatalogStatus({
  status,
  health,
  productCount
}: {
  status: BackendStatus;
  health: CatalogHealth | null;
  productCount: number;
}) {
  const label = {
    loading: "Checking connection",
    unconfigured: "Setup required",
    unhealthy: "Connection needs attention",
    ready: "Catalog connected"
  }[status];

  return (
    <div className={`catalog-status catalog-status-${status}`}>
      <span>{label}</span>
      <p>
        {status === "ready" && health
          ? `${health.sheetName} · ${health.driveFolderName} · ${productCount} product${productCount === 1 ? "" : "s"}`
          : status === "unconfigured"
            ? "The app is showing its bundled preview catalog. Product changes are disabled."
            : status === "unhealthy"
              ? "Review the Apps Script deployment, Script Properties and matching Vercel variables."
              : "Contacting Google Apps Script…"}
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
