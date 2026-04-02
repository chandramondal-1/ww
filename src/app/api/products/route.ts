import { NextResponse } from "next/server";

import { getAllProducts, saveProduct } from "@/lib/store";

export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.name || !body.categorySlug || !body.description) {
    return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
  }

  await saveProduct({
    name: body.name,
    categorySlug: body.categorySlug,
    tagline: body.tagline || "",
    description: body.description,
    price: Number(body.price || 0),
    originalPrice: Number(body.originalPrice || 0) || undefined,
    material: body.material || "",
    seatingCapacity: body.seatingCapacity || "",
    availability: body.availability || "In Stock",
    featured: Boolean(body.featured),
    image: body.image || "/assets/catalog/Sofa Sets/Haven.png"
  });

  return NextResponse.json({ success: true });
}
