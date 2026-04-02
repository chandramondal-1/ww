import { promises as fs } from "fs";
import path from "path";

import {
  Banner,
  BlogPost,
  Category,
  CategoryDraft,
  Enquiry,
  EnquiryStatus,
  Product,
  ProductDraft
} from "@/lib/types";
import { categories, products, seedBanners, seedBlogPosts } from "@/data/catalog";
import { createId, slugify } from "@/lib/utils";

const contentDir = path.join(process.cwd(), "content");

async function ensureContentDir() {
  await fs.mkdir(contentDir, { recursive: true });
}

async function readJson<T>(fileName: string, fallback: T): Promise<T> {
  try {
    const filePath = path.join(contentDir, fileName);
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(fileName: string, data: T) {
  await ensureContentDir();
  const filePath = path.join(contentDir, fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

function normalizeStoredCategory(draft: CategoryDraft): Category {
  return {
    id: draft.id,
    name: draft.name,
    slug: draft.slug || slugify(draft.name),
    folder: draft.folder || "Sofa Sets",
    description: draft.description,
    bannerImage: draft.bannerImage,
    accentFrom: "#2874F0",
    accentTo: "#00C6FF",
    badge: "Custom Category",
    order: 100,
    heroStat: "Custom collection"
  };
}

function normalizeStoredProduct(draft: ProductDraft, allCategories: Category[]): Product {
  const category =
    allCategories.find((item) => item.slug === draft.categorySlug) ??
    allCategories.find((item) => item.slug === "outdoor-sofa")!;
  const originalPrice = draft.originalPrice || Math.round(draft.price * 1.18);
  const discountPercentage = Math.round(((originalPrice - draft.price) / originalPrice) * 100);

  return {
    id: draft.id,
    name: draft.name,
    slug: draft.slug || slugify(draft.name),
    sku: `WW-CUSTOM-${draft.id.slice(-5).toUpperCase()}`,
    categoryId: category.id,
    categorySlug: category.slug,
    categoryName: category.name,
    tagline: draft.tagline,
    description: draft.description,
    marketingCopy: draft.description,
    price: draft.price,
    originalPrice,
    discountPercentage,
    rating: 4.8,
    reviewCount: 12,
    material: draft.material,
    seatingCapacity: draft.seatingCapacity,
    availability: draft.availability,
    featured: draft.featured,
    badge: draft.featured ? "Featured" : "Custom",
    images: [draft.image, draft.image, draft.image],
    primaryImage: draft.image,
    highlights: ["Admin managed product", "CMS ready entry", "Available for quotations"],
    specifications: [
      { label: "Material", value: draft.material },
      { label: "Seating Capacity", value: draft.seatingCapacity },
      { label: "Availability", value: draft.availability }
    ],
    faqs: [
      {
        question: "Can I customise this product?",
        answer: "Yes. Use the Request Quote form to ask about finishes, quantity and dispatch lead time."
      }
    ],
    onlyFewLeft: false,
    isNew: true,
    bestSeller: draft.featured,
    deliveryEstimate: "Custom dispatch timeline on request",
    warranty: "As per quotation",
    seoTitle: `${draft.name} | ${category.name} by SUN SEATINGS`,
    seoDescription: draft.description
  };
}

export async function getStoredCategories() {
  return readJson<CategoryDraft[]>("categories.json", []);
}

export async function getAllCategories() {
  const stored = await getStoredCategories();
  const merged = [...categories, ...stored.map(normalizeStoredCategory)];
  return merged.sort((a, b) => a.order - b.order);
}

export async function saveCategory(input: Omit<CategoryDraft, "id" | "createdAt" | "slug"> & { slug?: string }) {
  const current = await getStoredCategories();
  const next: CategoryDraft[] = [
    ...current,
    {
      id: createId("category"),
      name: input.name,
      slug: input.slug || slugify(input.name),
      folder: input.folder,
      description: input.description,
      bannerImage: input.bannerImage,
      createdAt: new Date().toISOString()
    }
  ];
  await writeJson("categories.json", next);
  return next;
}

export async function getStoredProducts() {
  return readJson<ProductDraft[]>("products.json", []);
}

export async function getAllProducts() {
  const allCategories = await getAllCategories();
  const stored = await getStoredProducts();
  const normalizedStored = stored.map((item) => normalizeStoredProduct(item, allCategories));
  return [...products, ...normalizedStored];
}

export async function saveProduct(
  input: Omit<ProductDraft, "id" | "createdAt" | "slug"> & { slug?: string }
) {
  const current = await getStoredProducts();
  const next: ProductDraft[] = [
    ...current,
    {
      id: createId("product"),
      name: input.name,
      slug: input.slug || slugify(input.name),
      categorySlug: input.categorySlug,
      tagline: input.tagline,
      description: input.description,
      price: input.price,
      originalPrice: input.originalPrice,
      material: input.material,
      seatingCapacity: input.seatingCapacity,
      availability: input.availability,
      featured: input.featured,
      image: input.image,
      createdAt: new Date().toISOString()
    }
  ];
  await writeJson("products.json", next);
  return next;
}

export async function getFeaturedProducts() {
  const all = await getAllProducts();
  return all.filter((item) => item.featured).slice(0, 12);
}

export async function getProductBySlug(categorySlug: string, productSlug: string) {
  const all = await getAllProducts();
  return all.find((item) => item.categorySlug === categorySlug && item.slug === productSlug);
}

export async function getProductsByCategory(categorySlug: string) {
  const all = await getAllProducts();
  return all.filter((item) => item.categorySlug === categorySlug);
}

export async function getRelatedProducts(product: Product) {
  const all = await getAllProducts();
  return all
    .filter((item) => item.categorySlug === product.categorySlug && item.slug !== product.slug)
    .slice(0, 4);
}

export async function getProductSearchIndex() {
  const all = await getAllProducts();
  return all.map((item) => ({
    slug: item.slug,
    categorySlug: item.categorySlug,
    name: item.name,
    categoryName: item.categoryName,
    image: item.primaryImage
  }));
}

export async function getStoredEnquiries() {
  return readJson<Enquiry[]>("enquiries.json", []);
}

export async function saveEnquiry(
  input: Omit<Enquiry, "id" | "createdAt" | "status">
) {
  const current = await getStoredEnquiries();
  const next: Enquiry[] = [
    {
      ...input,
      id: createId("enquiry"),
      createdAt: new Date().toISOString(),
      status: "New"
    },
    ...current
  ];
  await writeJson("enquiries.json", next);
  return next[0];
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus) {
  const current = await getStoredEnquiries();
  const next = current.map((item) => (item.id === id ? { ...item, status } : item));
  await writeJson("enquiries.json", next);
  return next.find((item) => item.id === id);
}

export async function getStoredBanners() {
  return readJson<Banner[]>("banners.json", []);
}

export async function getAllBanners() {
  const stored = await getStoredBanners();
  return [...seedBanners, ...stored];
}

export async function saveBanner(input: Omit<Banner, "id">) {
  const current = await getStoredBanners();
  const next = [...current, { ...input, id: createId("banner") }];
  await writeJson("banners.json", next);
  return next;
}

export async function getStoredBlogPosts() {
  return readJson<BlogPost[]>("blog-posts.json", []);
}

export async function getAllBlogPosts() {
  const stored = await getStoredBlogPosts();
  return [...seedBlogPosts, ...stored].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getBlogPostBySlug(slug: string) {
  const all = await getAllBlogPosts();
  return all.find((post) => post.slug === slug);
}

export async function saveBlogPost(
  input: Omit<BlogPost, "id" | "slug" | "publishedAt"> & { slug?: string }
) {
  const current = await getStoredBlogPosts();
  const next = [
    ...current,
    {
      ...input,
      id: createId("blog"),
      slug: input.slug || slugify(input.title),
      publishedAt: new Date().toISOString()
    }
  ];
  await writeJson("blog-posts.json", next);
  return next;
}
