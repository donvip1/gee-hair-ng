"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { trackCommerceEvent } from "@/lib/analytics";
import type { Product } from "@/lib/types";

const categories = ["All", "Straight", "Curls", "Waves"] as const;

export function ShopCatalog({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () => products.filter((product) => product.active && (category === "All" || product.category === category) && `${product.name} ${product.texture} ${product.category}`.toLowerCase().includes(search.toLowerCase())),
    [category, products, search]
  );

  return (
    <>
      <div className="shop-toolbar" role="search" aria-label="Filter the hair collection">
        <div className="filter-pills" aria-label="Product categories">
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => { setCategory(item); trackCommerceEvent("filter_catalog", { category: item }); }}
              className={`pill ${category === item ? "active" : ""}`}
              aria-pressed={category === item}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="search-field"><span className="sr-only">Search hair textures</span><input className="search-box" type="search" placeholder="Search textures" value={search} onChange={(event) => setSearch(event.target.value)} onBlur={() => { if (search.trim()) trackCommerceEvent("search_catalog", { query_length: search.trim().length, results: filtered.length }); }} /></label>
      </div>
      <p className="sr-only" aria-live="polite">{filtered.length} product{filtered.length === 1 ? "" : "s"} shown.</p>
      {filtered.length ? (
        <div className="product-grid shop-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      ) : (
        <div className="empty-state"><h2>No texture found.</h2><p>Try another category or search phrase.</p><button type="button" className="button button-dark" onClick={() => { setCategory("All"); setSearch(""); }}>Reset filters</button></div>
      )}
    </>
  );
}
