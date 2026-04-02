import { Metadata } from "next";

import { ShopCatalog } from "@/components/shop-catalog";
import { getAllCategories, getAllProducts } from "@/lib/store";

export const metadata: Metadata = {
  title: "Shop Luxury Outdoor Furniture",
  description:
    "Browse, filter and enquire on premium outdoor sofas, dining sets, swings, loungers and more from Wicker & Weave."
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getAllCategories()]);

  return (
    <section className="section-space pt-8">
      <div className="container-shell">
        <div className="mb-8 rounded-[38px] bg-white p-8 shadow-card sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#2874F0]">Shop / All Products</p>
          <h1 className="mt-3 font-[var(--font-heading)] text-5xl font-semibold text-[#1f2937] sm:text-6xl">
            Luxury furniture catalogue with filters, quick view and enquiry-first CTAs.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-[#6b7280] sm:text-base">
            This is the largest catalog page in the experience. Filter by price, material, seating
            capacity and availability, then open a quick view or jump into a full detail page.
          </p>
        </div>

        <ShopCatalog categories={categories} products={products} />
      </div>
    </section>
  );
}
