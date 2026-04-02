"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { signInAdmin, signOutAdmin } from "@/lib/auth";
import { saveBanner, saveBlogPost, saveCategory, saveProduct, updateEnquiryStatus } from "@/lib/store";
import { Availability, EnquiryStatus } from "@/lib/types";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");
  const success = await signInAdmin(username, password);

  if (!success) {
    redirect("/admin/login?error=1");
  }

  redirect("/admin");
}

export async function logoutAction() {
  await signOutAdmin();
  redirect("/admin/login");
}

export async function createProductAction(formData: FormData) {
  await saveProduct({
    name: String(formData.get("name") || ""),
    categorySlug: String(formData.get("categorySlug") || "outdoor-sofa"),
    tagline: String(formData.get("tagline") || ""),
    description: String(formData.get("description") || ""),
    price: Number(formData.get("price") || 0),
    originalPrice: Number(formData.get("originalPrice") || 0) || undefined,
    material: String(formData.get("material") || ""),
    seatingCapacity: String(formData.get("seatingCapacity") || ""),
    availability: String(formData.get("availability") || "In Stock") as Availability,
    featured: formData.get("featured") === "on",
    image: String(formData.get("image") || "/assets/catalog/Sofa Sets/Haven.png")
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/categories");
  revalidatePath("/admin/products");
  redirect("/admin/products?created=1");
}

export async function createCategoryAction(formData: FormData) {
  await saveCategory({
    name: String(formData.get("name") || ""),
    folder: String(formData.get("folder") || "Sofa Sets"),
    description: String(formData.get("description") || ""),
    bannerImage: String(formData.get("bannerImage") || "/assets/catalog/Sofa Sets/Haven.png")
  });

  revalidatePath("/");
  revalidatePath("/categories");
  revalidatePath("/admin/categories");
  redirect("/admin/categories?created=1");
}

export async function createBannerAction(formData: FormData) {
  await saveBanner({
    title: String(formData.get("title") || ""),
    subtitle: String(formData.get("subtitle") || ""),
    image: String(formData.get("image") || "/assets/catalog/Sofa Sets/Haven.png"),
    ctaLabel: String(formData.get("ctaLabel") || "Explore"),
    ctaHref: String(formData.get("ctaHref") || "/shop"),
    active: formData.get("active") === "on"
  });

  revalidatePath("/");
  revalidatePath("/admin/banners");
  redirect("/admin/banners?created=1");
}

export async function createBlogPostAction(formData: FormData) {
  await saveBlogPost({
    title: String(formData.get("title") || ""),
    excerpt: String(formData.get("excerpt") || ""),
    body: String(formData.get("body") || ""),
    featuredImage: String(formData.get("featuredImage") || "/assets/catalog/Sofa Sets/Haven.png"),
    tags: String(formData.get("tags") || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    seoTitle: String(formData.get("seoTitle") || formData.get("title") || ""),
    seoDescription: String(formData.get("seoDescription") || formData.get("excerpt") || "")
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  redirect("/admin/blog?created=1");
}

export async function updateEnquiryStatusAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "New") as EnquiryStatus;
  await updateEnquiryStatus(id, status);
  revalidatePath("/admin/enquiries");
}
