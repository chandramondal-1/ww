import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

import { getAllCategories, getAllProducts } from "@/lib/store";

export const metadata: Metadata = {
  title: "Furniture Categories",
  description: "Explore all SUN SEATINGS categories, from outdoor sofas to swings, umbrellas and bar sets."
};

export default async function CategoriesPage() {
  const [categories, products] = await Promise.all([getAllCategories(), getAllProducts()]);

  const counts = new Map<string, number>();
  products.forEach((product) => {
    counts.set(product.categorySlug, (counts.get(product.categorySlug) || 0) + 1);
  });

  return (
    <section className="section-space pt-8">
      <div className="container-shell">
        <div className="mb-8 rounded-[38px] bg-white p-8 shadow-card sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#2874F0]">Categories</p>
          <h1 className="mt-3 font-[var(--font-heading)] text-5xl font-semibold text-[#1f2937] sm:text-6xl">
            Browse the SUN SEATINGS collection by furniture type.
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <Link className="surface-card overflow-hidden p-4" href={`/categories/${category.slug}`} key={category.slug}>
              <div
                className="rounded-[30px] p-5"
                style={{
                  background: `linear-gradient(135deg, ${category.accentFrom} 0%, ${category.accentTo} 100%)`
                }}
              >
                <div className="relative h-60">
                  <Image alt={category.name} className="object-contain p-3" fill src={category.bannerImage} unoptimized />
                </div>
              </div>
              <h2 className="mt-5 text-xl font-semibold text-[#1f2937]">{category.name}</h2>
              <p className="mt-2 text-sm leading-7 text-[#6b7280]">{category.description}</p>
              <p className="mt-4 text-sm font-semibold text-[#2874F0]">
                {counts.get(category.slug) || 0} products available
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
