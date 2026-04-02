import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { seedBlogPosts } from "@/data/catalog";
import { getBlogPostBySlug } from "@/lib/store";
import { formatDate } from "@/lib/utils";

type BlogDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return seedBlogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  return {
    title: post?.seoTitle || post?.title,
    description: post?.seoDescription || post?.excerpt
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <section className="section-space pt-8">
      <div className="container-shell">
        <article className="mx-auto max-w-4xl surface-card overflow-hidden p-6 sm:p-8">
          <div className="relative h-80 overflow-hidden rounded-[30px] bg-[#f8fbff]">
            <Image alt={post.title} className="object-contain p-6" fill src={post.featuredImage} unoptimized />
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.35em] text-[#2874F0]">
            {formatDate(post.publishedAt)}
          </p>
          <h1 className="mt-4 font-[var(--font-heading)] text-5xl font-semibold text-[#1f2937]">
            {post.title}
          </h1>
          <p className="mt-4 text-sm leading-8 text-[#6b7280]">{post.excerpt}</p>
          <div className="mt-8 text-base leading-9 text-[#374151]">{post.body}</div>
        </article>
      </div>
    </section>
  );
}
