"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/lib/products";

export default function ShopPage() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => products.filter((product) =>
    (category === "All" || product.category === category) &&
    `${product.name} ${product.texture} ${product.category}`.toLowerCase().includes(search.toLowerCase())
  ), [category, search]);

  return (
    <div className="page-shell">
      <header className="page-hero"><p className="eyebrow">The full collection</p><h1>Find your <em>look.</em></h1><p>Explore premium textures, ready-to-wear wigs and full bundles selected for movement, longevity and a confident finish.</p></header>
      <div className="shop-toolbar"><div className="filter-pills">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`pill ${category === item ? "active" : ""}`}>{item}</button>)}</div><input className="search-box" type="search" placeholder="Search the collection" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
      {filtered.length ? <div className="product-grid shop-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><h2>No pieces found.</h2><p>Try another category or search phrase.</p><button className="button button-dark" onClick={() => { setCategory("All"); setSearch(""); }}>Reset filters</button></div>}
    </div>
  );
}
