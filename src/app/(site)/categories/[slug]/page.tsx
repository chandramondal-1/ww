import { Metadata } from "next";
import { notFound } from "next/navigation";

import { ShopCatalog } from "@/components/shop-catalog";
import { categories as seedCategories } from "@/data/catalog";
import { getAllCategories, getAllProducts } from "@/lib/store";

type CategoryDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return seedCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getAllCategories();
  const category = categories.find((item) => item.slug === slug);

  return {
    title: category ? category.name : "Category",
    description: category?.description
  };
}

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { slug } = await params;
  const [categories, products] = await Promise.all([getAllCategories(), getAllProducts()]);
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  return (
    <section className="section-space pt-8">
      <div className="container-shell">
        <div
          className="mb-8 rounded-[38px] p-8 text-white shadow-soft sm:p-10"
          style={{
            background: `linear-gradient(135deg, ${category.accentFrom} 0%, ${category.accentTo} 100%)`
          }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/80">
            Category Page
          </p>
          <h1 className="mt-3 font-[var(--font-heading)] text-5xl font-semibold sm:text-6xl">
            {category.name}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-white/80">{category.description}</p>
        </div>

        <ShopCatalog categories={categories} initialCategorySlug={slug} products={products} />
      </div>
    </section>
  );
}
