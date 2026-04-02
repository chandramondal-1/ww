import { NextResponse } from "next/server";

import { getAllCategories, saveCategory } from "@/lib/store";

export async function GET() {
  const categories = await getAllCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.name || !body.description) {
    return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
  }

  await saveCategory({
    name: body.name,
    folder: body.folder,
    description: body.description,
    bannerImage: body.bannerImage || "/assets/catalog/Sofa Sets/Haven.png"
  });

  return NextResponse.json({ success: true });
}
