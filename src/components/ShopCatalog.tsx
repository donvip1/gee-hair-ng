"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/types";

const categories = ["All", "Straight", "Curls", "Waves"] as const;

export function ShopCatalog({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () =>
      products.filter(
        (product) =>
          product.active &&
          (category === "All" || product.category === category) &&
          `${product.name} ${product.texture} ${product.category}`
            .toLowerCase()
            .includes(search.toLowerCase())
      ),
    [category, products, search]
  );

  return (
    <>
      <div className="shop-toolbar">
        <div className="filter-pills">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`pill ${category === item ? "active" : ""}`}
            >
              {item}
            </button>
          ))}
        </div>
        <input
          className="search-box"
          type="search"
          placeholder="Search textures"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      {filtered.length ? (
        <div className="product-grid shop-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No texture found.</h2>
          <p>Try another category or search phrase.</p>
          <button
            className="button button-dark"
            onClick={() => {
              setCategory("All");
              setSearch("");
            }}
          >
            Reset filters
          </button>
        </div>
      )}
    </>
  );
}
