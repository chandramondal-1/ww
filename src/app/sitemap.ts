import type { MetadataRoute } from "next";

import { categories, products, seedBlogPosts } from "@/data/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wickerandweave.in";

  const staticRoutes = ["", "/shop", "/categories", "/about", "/contact", "/catalog", "/blog", "/admin/login"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date()
    })),
    ...categories.map((category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date()
    })),
    ...products.map((product) => ({
      url: `${baseUrl}/${product.categorySlug}/${product.slug}`,
      lastModified: new Date()
    })),
    ...seedBlogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt)
    }))
  ];
}
