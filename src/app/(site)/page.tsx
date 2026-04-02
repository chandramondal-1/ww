import Image from "next/image";
import Link from "next/link";

import { FeaturedCarousel } from "@/components/featured-carousel";
import { HeroCarousel } from "@/components/hero-carousel";
import { ReviewSlider } from "@/components/review-slider";
import { categories as seedCategories, heroSlides, instagramShots, siteConfig, testimonials, trustPoints } from "@/data/catalog";
import { ArrowRightIcon, ShieldIcon, SparklesIcon, TruckIcon, WhatsappIcon } from "@/components/icons";
import { buildWhatsAppLink } from "@/lib/utils";
import { getAllProducts, getFeaturedProducts } from "@/lib/store";

export default async function HomePage() {
  const [allProducts, featuredProducts] = await Promise.all([getAllProducts(), getFeaturedProducts()]);

  const counts = new Map<string, number>();
  allProducts.forEach((product) => {
    counts.set(product.categorySlug, (counts.get(product.categorySlug) || 0) + 1);
  });

  return (
    <>
      <HeroCarousel slides={heroSlides} />

      <section className="section-space pt-4">
        <div className="container-shell">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#2874F0]">
              Category Grid
            </p>
            <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-semibold text-[#1f2937] sm:text-5xl">
              Browse collections the way shoppers do on top ecommerce sites.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {seedCategories.map((category) => (
              <Link
                className="surface-card group overflow-hidden p-4 transition hover:-translate-y-1"
                href={`/categories/${category.slug}`}
                key={category.id}
              >
                <div
                  className="relative overflow-hidden rounded-[28px] p-5"
                  style={{
                    background: `linear-gradient(135deg, ${category.accentFrom} 0%, ${category.accentTo} 100%)`
                  }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_35%)]" />
                  <div className="relative flex min-h-[220px] items-center justify-center">
                    <Image
                      alt={category.name}
                      className="h-auto max-h-[180px] w-full object-contain transition duration-500 group-hover:scale-105"
                      height={280}
                      src={category.bannerImage}
                      unoptimized
                      width={280}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-[#1f2937]">{category.name}</h3>
                    <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#2874F0]">
                      {category.badge}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[#6b7280]">{category.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#1f2937]">
                      {counts.get(category.slug) || 0} products
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#2874F0]">
                      Shop Now
                      <ArrowRightIcon className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space pt-2">
        <div className="container-shell">
          <FeaturedCarousel products={featuredProducts} />
        </div>
      </section>

      <section className="section-space pt-2">
        <div className="container-shell">
          <div className="surface-card overflow-hidden p-6 sm:p-10">
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#2874F0]">
                Why Choose Us
              </p>
              <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-semibold text-[#1f2937] sm:text-5xl">
                Trust signals built to convert catalogue visits into enquiries.
              </h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-4">
              {trustPoints.map((point, index) => {
                const Icon = [SparklesIcon, ShieldIcon, TruckIcon, SparklesIcon][index];
                return (
                  <div className="rounded-[28px] border border-slate-200 bg-[#f8fbff] p-6" key={point.id}>
                    <Icon className="h-6 w-6 text-[#2874F0]" />
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.35em] text-[#6b7280]">
                      {point.stat}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-[#1f2937]">{point.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#6b7280]">{point.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <ReviewSlider items={testimonials} />

      <section className="section-space pt-0">
        <div className="container-shell">
          <div className="hero-gradient overflow-hidden rounded-[38px] p-8 shadow-soft sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
              <div className="text-white">
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/70">
                  WhatsApp Banner
                </p>
                <h2 className="mt-4 font-[var(--font-heading)] text-5xl font-semibold leading-none">
                  Talk to our furniture expert.
                </h2>
                <p className="mt-5 max-w-xl text-sm leading-8 text-white/80">
                  Share a product link, a rough layout or just your space type. We can help with
                  finish suggestions, delivery estimates and quotation support on WhatsApp.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white"
                    href={buildWhatsAppLink(siteConfig.whatsappNumber)}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <WhatsappIcon className="h-4 w-4" />
                    Open WhatsApp Chat
                  </Link>
                  <Link
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white"
                    href="/contact"
                  >
                    Request Quotation
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {featuredProducts.slice(0, 2).map((product) => (
                  <div className="rounded-[28px] border border-white/15 bg-white/10 p-4 text-white" key={product.id}>
                    <div className="relative h-44 overflow-hidden rounded-[24px] bg-white/10">
                      <Image
                        alt={product.name}
                        className="object-contain p-4"
                        fill
                        src={product.primaryImage}
                        unoptimized
                      />
                    </div>
                    <p className="mt-4 text-sm font-semibold">{product.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/70">
                      {product.categoryName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="container-shell">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#2874F0]">
              Instagram Gallery
            </p>
            <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-semibold text-[#1f2937] sm:text-5xl">
              A social-style inspiration grid built from your real catalogue assets.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {instagramShots.map((shot) => (
              <div className="group surface-card overflow-hidden p-4" key={shot.id}>
                <div className="relative h-72 overflow-hidden rounded-[28px] bg-[#f8fbff]">
                  <Image
                    alt={shot.caption}
                    className="object-contain p-5 transition duration-500 group-hover:scale-105"
                    fill
                    src={shot.image}
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent opacity-0 transition group-hover:opacity-100" />
                </div>
                <p className="mt-4 text-sm font-semibold text-[#1f2937]">{shot.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
