import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

import { getAllBlogPosts } from "@/lib/store";

export const metadata: Metadata = {
  title: "Furniture Blog",
  description: "SEO-ready blog for Wicker & Weave covering outdoor furniture buying guides, styling and trends."
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <section className="section-space pt-8">
      <div className="container-shell">
        <div className="mb-8 rounded-[38px] bg-white p-8 shadow-card sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#2874F0]">Blog / SEO Engine</p>
          <h1 className="mt-3 font-[var(--font-heading)] text-5xl font-semibold text-[#1f2937] sm:text-6xl">
            Design stories and search-friendly buying guides.
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {posts.map((post) => (
            <article className="surface-card overflow-hidden p-4" key={post.id}>
              <div className="relative h-64 overflow-hidden rounded-[28px] bg-[#f8fbff]">
                <Image alt={post.title} className="object-contain p-6" fill src={post.featuredImage} unoptimized />
              </div>
              <div className="mt-5">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#2874F0]" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-[#1f2937]">{post.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#6b7280]">{post.excerpt}</p>
                <Link className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2874F0]" href={`/blog/${post.slug}`}>
                  Read article
                  <span>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
