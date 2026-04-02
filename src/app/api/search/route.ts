import { NextResponse } from "next/server";

import { getAllCategories, getAllProducts } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").toLowerCase();

  const [products, categories] = await Promise.all([getAllProducts(), getAllCategories()]);

  if (!query) {
    return NextResponse.json({
      products: products.slice(0, 6),
      categories: categories.slice(0, 6)
    });
  }

  return NextResponse.json({
    products: products.filter((item) => item.name.toLowerCase().includes(query)).slice(0, 6),
    categories: categories.filter((item) => item.name.toLowerCase().includes(query)).slice(0, 6)
  });
}
