import { Metadata } from "next";

import { EnquiryForm } from "@/components/enquiry-form";
import { getAllCategories, getAllProducts } from "@/lib/store";

export const metadata: Metadata = {
  title: "Catalog PDF",
  description: "Request the Wicker & Weave digital catalog and get a quotation-ready product guide."
};

export default async function CatalogPage() {
  const [categories, products] = await Promise.all([getAllCategories(), getAllProducts()]);

  return (
    <section className="section-space pt-8">
      <div className="container-shell">
        <div className="mb-8 grid gap-8 lg:grid-cols-[1fr,0.95fr]">
          <div className="rounded-[38px] bg-white p-8 shadow-card sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#2874F0]">Catalog PDF download page</p>
            <h1 className="mt-3 font-[var(--font-heading)] text-5xl font-semibold text-[#1f2937] sm:text-6xl">
              Get the digital catalog and request pricing in one flow.
            </h1>
            <p className="mt-4 text-sm leading-8 text-[#6b7280] sm:text-base">
              The current build is designed so the CTA can point to a real PDF later, but already
              captures catalog requests, product interest and contact details for the sales team.
            </p>
          </div>

          <div className="surface-card p-8 sm:p-10">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] bg-[#f8fbff] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#6b7280]">Categories</p>
                <p className="mt-3 text-4xl font-extrabold text-[#1f2937]">{categories.length}</p>
              </div>
              <div className="rounded-[28px] bg-[#f8fbff] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#6b7280]">Products</p>
                <p className="mt-3 text-4xl font-extrabold text-[#1f2937]">{products.length}</p>
              </div>
            </div>
          </div>
        </div>

        <EnquiryForm title="Request catalog PDF" type="catalog" />
      </div>
    </section>
  );
}
