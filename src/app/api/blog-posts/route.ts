import { NextResponse } from "next/server";

import { getAllBlogPosts, saveBlogPost } from "@/lib/store";

export async function GET() {
  const posts = await getAllBlogPosts();
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.title || !body.body || !body.excerpt) {
    return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
  }

  await saveBlogPost({
    title: body.title,
    excerpt: body.excerpt,
    body: body.body,
    featuredImage: body.featuredImage || "/assets/catalog/Sofa Sets/Haven.png",
    tags: Array.isArray(body.tags) ? body.tags : [],
    seoTitle: body.seoTitle || body.title,
    seoDescription: body.seoDescription || body.excerpt
  });

  return NextResponse.json({ success: true });
}
