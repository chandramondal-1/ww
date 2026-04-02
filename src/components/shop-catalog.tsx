"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Category, Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { ProductQuickView } from "@/components/product-quick-view";
import { FilterIcon, GridIcon, ListIcon } from "@/components/icons";

type ShopCatalogProps = {
  products: Product[];
  categories: Category[];
  initialCategorySlug?: string;
};

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "popular", label: "Popular" },
  { value: "new", label: "New arrivals" },
  { value: "price-asc", label: "Price low → high" },
  { value: "price-desc", label: "Price high → low" }
];

export function ShopCatalog({
  products,
  categories,
  initialCategorySlug
}: ShopCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategorySlug || "all");
  const [material, setMaterial] = useState<string>("all");
  const [seatingCapacity, setSeatingCapacity] = useState<string>("all");
  const [availability, setAvailability] = useState<string>("all");
  const [sortBy, setSortBy] = useState("featured");
  const [priceLimit, setPriceLimit] = useState(
    Math.max(...products.map((product) => product.price), 100000)
  );
  const [visibleCount, setVisibleCount] = useState(12);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [gridMode, setGridMode] = useState<"grid" | "list">("grid");
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = sentinelRef.current;

    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((current) => current + 8);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const filteredProducts = useMemo(() => {
    const next = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.categorySlug === selectedCategory;
      const matchesMaterial =
        material === "all" || product.material.toLowerCase().includes(material.toLowerCase());
      const matchesSeating =
        seatingCapacity === "all" || product.seatingCapacity === seatingCapacity;
      const matchesAvailability =
        availability === "all" || product.availability === availability;
      const matchesPrice = product.price <= priceLimit;

      return (
        matchesCategory &&
        matchesMaterial &&
        matchesSeating &&
        matchesAvailability &&
        matchesPrice
      );
    });

    return next.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "new":
          return Number(b.isNew) - Number(a.isNew);
        case "popular":
          return b.reviewCount - a.reviewCount;
        case "featured":
        default:
          return Number(b.featured) - Number(a.featured);
      }
    });
  }, [availability, material, priceLimit, products, seatingCapacity, selectedCategory, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
        <aside className="surface-card h-fit p-5 lg:sticky lg:top-24">
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2874F0] text-white">
              <FilterIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-[#1f2937]">Filter products</p>
              <p className="text-sm text-[#6b7280]">Flipkart-style browsing controls</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#6b7280]">
                Category
              </p>
              <div className="space-y-2">
                <button
                  className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold ${
                    selectedCategory === "all"
                      ? "bg-[#2874F0] text-white"
                      : "bg-[#f8fbff] text-[#1f2937]"
                  }`}
                  onClick={() => setSelectedCategory("all")}
                  type="button"
                >
                  All Products
                </button>
                {categories.map((category) => (
                  <button
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold ${
                      selectedCategory === category.slug
                        ? "bg-[#2874F0] text-white"
                        : "bg-[#f8fbff] text-[#1f2937]"
                    }`}
                    key={category.slug}
                    onClick={() => setSelectedCategory(category.slug)}
                    type="button"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-xs font-bold uppercase tracking-[0.28em] text-[#6b7280]">
                Price range
              </label>
              <input
                className="w-full accent-[#2874F0]"
                max={Math.max(...products.map((product) => product.price))}
                min={5000}
                onChange={(event) => setPriceLimit(Number(event.target.value))}
                type="range"
                value={priceLimit}
              />
              <p className="mt-2 text-sm font-semibold text-[#1f2937]">
                Up to ₹{priceLimit.toLocaleString("en-IN")}
              </p>
            </div>

            {[
              {
                label: "Material",
                value: material,
                onChange: setMaterial,
                options: ["all", "rattan", "wood", "metal", "wicker"]
              },
              {
                label: "Seating capacity",
                value: seatingCapacity,
                onChange: setSeatingCapacity,
                options: ["all", "1 seater", "2 seater", "4 seater", "5 seater", "6 seater"]
              },
              {
                label: "Availability",
                value: availability,
                onChange: setAvailability,
                options: ["all", "In Stock", "Preorder", "Limited Stock"]
              }
            ].map((group) => (
              <div key={group.label}>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#6b7280]">
                  {group.label}
                </p>
                <div className="space-y-2">
                  {group.options.map((option) => (
                    <button
                      className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold ${
                        group.value === option
                          ? "bg-[#2874F0] text-white"
                          : "bg-[#f8fbff] text-[#1f2937]"
                      }`}
                      key={option}
                      onClick={() => group.onChange(option)}
                      type="button"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <section>
          <div className="surface-card mb-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-[#6b7280]">
                Showing <span className="font-semibold text-[#1f2937]">{visibleProducts.length}</span>{" "}
                of {filteredProducts.length} products
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
                <button
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${
                    gridMode === "grid" ? "bg-[#2874F0] text-white" : "text-[#1f2937]"
                  }`}
                  onClick={() => setGridMode("grid")}
                  type="button"
                >
                  <GridIcon className="h-4 w-4" />
                </button>
                <button
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${
                    gridMode === "list" ? "bg-[#2874F0] text-white" : "text-[#1f2937]"
                  }`}
                  onClick={() => setGridMode("list")}
                  type="button"
                >
                  <ListIcon className="h-4 w-4" />
                </button>
              </div>

              <select
                className="h-11 rounded-full border border-slate-200 px-4 text-sm font-semibold outline-none"
                onChange={(event) => setSortBy(event.target.value)}
                value={sortBy}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            className={
              gridMode === "grid"
                ? "grid gap-6 md:grid-cols-2 xl:grid-cols-3"
                : "grid gap-6 md:grid-cols-1"
            }
          >
            {visibleProducts.map((product) => (
              <ProductCard
                compact={gridMode === "list"}
                key={product.id}
                onQuickView={setQuickView}
                product={product}
              />
            ))}
          </div>

          <div ref={sentinelRef} />

          {visibleProducts.length < filteredProducts.length ? (
            <div className="mt-8 text-center text-sm font-semibold text-[#6b7280]">
              Loading more products as you scroll...
            </div>
          ) : null}
        </section>
      </div>

      <ProductQuickView onClose={() => setQuickView(null)} product={quickView} />
    </>
  );
}
