"use client";

import { useRef, useState } from "react";

import { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { ProductQuickView } from "@/components/product-quick-view";

type FeaturedCarouselProps = {
  products: Product[];
};

export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [quickView, setQuickView] = useState<Product | null>(null);

  const scroll = (direction: "left" | "right") => {
    railRef.current?.scrollBy({
      left: direction === "right" ? 380 : -380,
      behavior: "smooth"
    });
  };

  return (
    <>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#2874F0]">
            Featured products
          </p>
          <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-semibold text-[#1f2937] sm:text-5xl">
            Trending catalog pieces that feel marketplace-ready.
          </h2>
        </div>

        <div className="hidden gap-3 sm:flex">
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1f2937]"
            onClick={() => scroll("left")}
            type="button"
          >
            ←
          </button>
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1f2937]"
            onClick={() => scroll("right")}
            type="button"
          >
            →
          </button>
        </div>
      </div>

      <div
        className="thin-scrollbar flex gap-6 overflow-x-auto pb-4"
        ref={railRef}
      >
        {products.map((product) => (
          <div className="min-w-[310px] max-w-[310px] flex-none" key={product.id}>
            <ProductCard onQuickView={setQuickView} product={product} />
          </div>
        ))}
      </div>

      <ProductQuickView onClose={() => setQuickView(null)} product={quickView} />
    </>
  );
}
