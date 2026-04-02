"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import { Product } from "@/lib/types";
import { buildWhatsAppLink, formatCurrency } from "@/lib/utils";
import { CloseIcon, PhoneIcon, WhatsappIcon } from "@/components/icons";
import { siteConfig } from "@/data/catalog";

type ProductQuickViewProps = {
  product?: Product | null;
  onClose: () => void;
};

export function ProductQuickView({ product, onClose }: ProductQuickViewProps) {
  return (
    <AnimatePresence>
      {product ? (
        <>
          <motion.button
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[70] bg-slate-950/60 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
            type="button"
          />
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="fixed left-1/2 top-1/2 z-[80] w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[36px] bg-white shadow-soft"
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
          >
            <div className="grid gap-0 lg:grid-cols-[0.95fr,1.05fr]">
              <div className="relative min-h-[360px] bg-[#f8fbff] p-6">
                <Image
                  alt={product.name}
                  className="object-contain p-6"
                  fill
                  src={product.primaryImage}
                  unoptimized
                />
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#2874F0]">
                      {product.categoryName}
                    </p>
                    <h3 className="mt-2 font-[var(--font-heading)] text-4xl font-semibold text-[#1f2937]">
                      {product.name}
                    </h3>
                  </div>
                  <button
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200"
                    onClick={onClose}
                    type="button"
                  >
                    <CloseIcon className="h-5 w-5" />
                  </button>
                </div>

                <p className="mt-4 text-sm leading-7 text-[#6b7280]">{product.description}</p>

                <div className="mt-6 flex items-end gap-3">
                  <p className="text-3xl font-extrabold text-[#1f2937]">
                    {formatCurrency(product.price)}
                  </p>
                  <p className="text-base text-[#6b7280] line-through">
                    {formatCurrency(product.originalPrice)}
                  </p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {product.specifications.slice(0, 4).map((specification) => (
                    <div className="rounded-3xl border border-slate-200 p-4" key={specification.label}>
                      <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#6b7280]">
                        {specification.label}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[#1f2937]">
                        {specification.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white"
                    href={buildWhatsAppLink(siteConfig.whatsappNumber, product.name)}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <WhatsappIcon className="h-4 w-4" />
                    WhatsApp
                  </Link>
                  <Link
                    className="inline-flex items-center gap-2 rounded-full bg-[#2874F0] px-5 py-3 text-sm font-semibold text-white"
                    href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
                  >
                    <PhoneIcon className="h-4 w-4" />
                    Call Now
                  </Link>
                  <Link
                    className="inline-flex items-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-[#1f2937]"
                    href={`/${product.categorySlug}/${product.slug}`}
                  >
                    View full details
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
