import { NextResponse } from "next/server";

import { getAllBanners, saveBanner } from "@/lib/store";

export async function GET() {
  const banners = await getAllBanners();
  return NextResponse.json({ banners });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.title || !body.subtitle) {
    return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
  }

  await saveBanner({
    title: body.title,
    subtitle: body.subtitle,
    image: body.image || "/assets/catalog/Sofa Sets/Haven.png",
    ctaLabel: body.ctaLabel || "Explore",
    ctaHref: body.ctaHref || "/shop",
    active: Boolean(body.active)
  });

  return NextResponse.json({ success: true });
}
