"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { Product } from "@/lib/types";
import { buildWhatsAppLink, formatCurrency } from "@/lib/utils";
import { HeartIcon, StarIcon, WhatsappIcon } from "@/components/icons";
import { siteConfig } from "@/data/catalog";

type ProductCardProps = {
  product: Product;
  onQuickView?: (product: Product) => void;
  compact?: boolean;
};

export function ProductCard({ product, onQuickView, compact = false }: ProductCardProps) {
  return (
    <motion.article
      className="group surface-card relative overflow-hidden p-4"
      layout
      whileHover={{ y: -6 }}
    >
      <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
        <span className="rounded-full bg-[#ef4444] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-white">
          {product.discountPercentage}% off
        </span>
        {product.onlyFewLeft ? (
          <span className="rounded-full bg-[#10B981] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-white">
            Only few left
          </span>
        ) : null}
      </div>

      <button
        className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1f2937] shadow-sm"
        type="button"
      >
        <HeartIcon className="h-4 w-4" />
      </button>

      <Link href={`/${product.categorySlug}/${product.slug}`}>
        <div className={`relative overflow-hidden rounded-[28px] bg-[#f8fbff] ${compact ? "h-60" : "h-72"}`}>
          <Image
            alt={product.name}
            className="object-contain p-5 transition duration-500 group-hover:scale-105"
            fill
            src={product.primaryImage}
            unoptimized
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#dce8ff] to-transparent opacity-70" />
        </div>
      </Link>

      <div className="mt-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex items-center gap-1 text-[#f59e0b]">
            {Array.from({ length: 5 }).map((_, index) => (
              <StarIcon className="h-3.5 w-3.5" key={index} />
            ))}
          </div>
          <span className="text-xs font-semibold text-[#6b7280]">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        <Link href={`/${product.categorySlug}/${product.slug}`}>
          <h3 className="line-clamp-2 font-semibold text-[#1f2937] transition group-hover:text-[#2874F0]">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-[#6b7280]">{product.tagline}</p>

        <div className="mt-4 flex items-end gap-3">
          <p className="text-xl font-extrabold text-[#1f2937]">{formatCurrency(product.price)}</p>
          <p className="text-sm text-[#6b7280] line-through">{formatCurrency(product.originalPrice)}</p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button
            className="inline-flex items-center justify-center rounded-full border border-[#2874F0]/15 bg-[#f8fbff] px-4 py-3 text-sm font-semibold text-[#2874F0] transition hover:border-[#2874F0]/40"
            onClick={() => onQuickView?.(product)}
            type="button"
          >
            Quick View
          </button>
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF6A00] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#e85d00]"
            href={buildWhatsAppLink(siteConfig.whatsappNumber, product.name)}
            rel="noreferrer"
            target="_blank"
          >
            <WhatsappIcon className="h-4 w-4" />
            Enquire Now
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
