"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { EnquiryForm } from "@/components/enquiry-form";
import { buildPhoneLink, buildWhatsAppLink, formatCurrency } from "@/lib/utils";
import {
  CloseIcon,
  DownloadIcon,
  PhoneIcon,
  ShieldIcon,
  SparklesIcon,
  TruckIcon,
  WhatsappIcon
} from "@/components/icons";
import { siteConfig } from "@/data/catalog";

type ProductDetailClientProps = {
  product: Product;
  relatedProducts: Product[];
};

const tabs = ["Description", "Specifications", "Shipping info", "FAQ"] as const;

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Description");
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  return (
    <>
      <section className="section-space pt-8">
        <div className="container-shell">
          <div className="mb-6 text-sm text-[#6b7280]">
            Home / {product.categoryName} /{" "}
            <span className="font-semibold text-[#1f2937]">{product.name}</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.02fr,0.98fr]">
            <div className="surface-card p-5 sm:p-6">
              <div className="relative overflow-hidden rounded-[30px] bg-[#f8fbff]">
                <div className="absolute right-5 top-5 z-10 rounded-full bg-[#ef4444] px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-white">
                  {product.discountPercentage}% OFF
                </div>
                <div className="group relative h-[460px] overflow-hidden">
                  <Image
                    alt={product.name}
                    className="object-contain p-6 transition duration-500 group-hover:scale-110"
                    fill
                    src={activeImage}
                    unoptimized
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {product.images.map((image, index) => (
                  <button
                    className={`relative overflow-hidden rounded-[22px] border p-2 ${
                      activeImage === image
                        ? "border-[#2874F0] bg-[#eef4ff]"
                        : "border-slate-200 bg-white"
                    }`}
                    key={`${image}-${index}`}
                    onClick={() => setActiveImage(image)}
                    type="button"
                  >
                    <div className="relative h-24">
                      <Image
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="object-contain"
                        fill
                        src={image}
                        unoptimized
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="surface-card p-6 sm:p-8">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-[#2874F0]">
                  {product.categoryName}
                </span>
                <span className="rounded-full bg-[#ecfdf5] px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-[#10B981]">
                  {product.availability}
                </span>
              </div>

              <h1 className="mt-4 font-[var(--font-heading)] text-5xl font-semibold leading-none text-[#1f2937]">
                {product.name}
              </h1>
              <p className="mt-4 text-base leading-7 text-[#6b7280]">{product.marketingCopy}</p>

              <div className="mt-6 flex flex-wrap items-end gap-4">
                <div>
                  <p className="text-4xl font-extrabold text-[#1f2937]">
                    {formatCurrency(product.price)}
                  </p>
                  <p className="mt-1 text-sm text-[#6b7280]">
                    <span className="line-through">{formatCurrency(product.originalPrice)}</span>{" "}
                    <span className="ml-2 font-semibold text-[#10B981]">
                      You save {formatCurrency(product.originalPrice - product.price)}
                    </span>
                  </p>
                </div>
                <div className="rounded-2xl bg-[#f8fbff] px-4 py-3 text-sm font-semibold text-[#1f2937]">
                  Delivery estimate: {product.deliveryEstimate}
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Material", value: product.material, icon: SparklesIcon },
                  { label: "Warranty", value: product.warranty, icon: ShieldIcon },
                  { label: "Delivery", value: "Pan India support", icon: TruckIcon }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div className="rounded-[24px] border border-slate-200 p-4" key={item.label}>
                      <Icon className="h-5 w-5 text-[#2874F0]" />
                      <p className="mt-3 text-xs font-bold uppercase tracking-[0.28em] text-[#6b7280]">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[#1f2937]">{item.value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white"
                  href={buildWhatsAppLink(siteConfig.whatsappNumber, product.name)}
                  rel="noreferrer"
                  target="_blank"
                >
                  <WhatsappIcon className="h-4 w-4" />
                  WhatsApp Now
                </Link>
                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2874F0] px-5 py-3 text-sm font-semibold text-white"
                  href={buildPhoneLink(siteConfig.phone)}
                >
                  <PhoneIcon className="h-4 w-4" />
                  Call Now
                </Link>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-[#1f2937]"
                  onClick={() => setShowQuoteForm(true)}
                  type="button"
                >
                  📝 Request Quote
                </button>
                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-[#1f2937]"
                  href="/catalog"
                >
                  <DownloadIcon className="h-4 w-4" />
                  Download Catalog
                </Link>
              </div>

              <div className="mt-8 rounded-[28px] bg-[#f8fbff] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#6b7280]">
                  Product Highlights
                </p>
                <ul className="mt-4 space-y-3">
                  {product.highlights.map((highlight) => (
                    <li className="flex items-center gap-3 text-sm text-[#1f2937]" key={highlight}>
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#2874F0] text-xs font-bold text-white">
                        ✓
                      </span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 surface-card p-6 sm:p-8">
            <div className="flex flex-wrap gap-3">
              {tabs.map((tab) => (
                <button
                  className={`rounded-full px-5 py-3 text-sm font-semibold ${
                    activeTab === tab
                      ? "bg-[#2874F0] text-white"
                      : "bg-[#f8fbff] text-[#1f2937]"
                  }`}
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-8">
              {activeTab === "Description" ? (
                <div className="max-w-4xl space-y-4 text-sm leading-8 text-[#4b5563]">
                  <p>{product.description}</p>
                  <p>{product.marketingCopy}</p>
                </div>
              ) : null}

              {activeTab === "Specifications" ? (
                <div className="overflow-hidden rounded-[24px] border border-slate-200">
                  {product.specifications.map((specification) => (
                    <div
                      className="grid grid-cols-[180px,1fr] border-b border-slate-200 px-5 py-4 last:border-b-0"
                      key={specification.label}
                    >
                      <p className="text-sm font-semibold text-[#1f2937]">{specification.label}</p>
                      <p className="text-sm text-[#6b7280]">{specification.value}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              {activeTab === "Shipping info" ? (
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    ["Lead time", product.deliveryEstimate],
                    ["Coverage", "Pan India delivery & dispatch support"],
                    ["Packaging", "Protective packaging with transit coordination"]
                  ].map(([title, value]) => (
                    <div className="rounded-[24px] border border-slate-200 p-5" key={title}>
                      <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#6b7280]">
                        {title}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[#1f2937]">{value}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              {activeTab === "FAQ" ? (
                <div className="space-y-4">
                  {product.faqs.map((faq) => (
                    <div className="rounded-[24px] border border-slate-200 p-5" key={faq.question}>
                      <p className="font-semibold text-[#1f2937]">{faq.question}</p>
                      <p className="mt-2 text-sm leading-7 text-[#6b7280]">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-10">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#2874F0]">
                Related products
              </p>
              <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-semibold text-[#1f2937]">
                More from the same collection
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {showQuoteForm ? (
        <>
          <button
            className="fixed inset-0 z-[70] bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setShowQuoteForm(false)}
            type="button"
          />
          <div className="fixed left-1/2 top-1/2 z-[80] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2">
            <div className="surface-card p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#2874F0]">
                    Product enquiry
                  </p>
                  <h3 className="mt-2 font-[var(--font-heading)] text-3xl font-semibold text-[#1f2937]">
                    Request a quote for {product.name}
                  </h3>
                </div>
                <button
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200"
                  onClick={() => setShowQuoteForm(false)}
                  type="button"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>
              <EnquiryForm
                compact
                productId={product.id}
                productName={product.name}
                title="Share your requirement"
                type="product"
              />
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
