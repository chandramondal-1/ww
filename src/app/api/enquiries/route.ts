import { NextResponse } from "next/server";

import { saveEnquiry, getStoredEnquiries } from "@/lib/store";

export async function GET() {
  const enquiries = await getStoredEnquiries();
  return NextResponse.json({ enquiries });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (body.website) {
    return NextResponse.json({ success: true });
  }

  if (!body.name || !body.phone) {
    return NextResponse.json(
      { message: "Name and phone are required." },
      { status: 400 }
    );
  }

  if (String(body.phone).replace(/\D/g, "").length < 10) {
    return NextResponse.json(
      { message: "Please enter a valid phone number." },
      { status: 400 }
    );
  }

  const enquiry = await saveEnquiry({
    type: body.type || "general",
    productId: body.productId,
    productName: body.productName,
    name: body.name,
    phone: body.phone,
    email: body.email || "",
    city: body.city || "",
    message: body.message || "",
    source: body.source || "Website"
  });

  // SMTP / admin notification hooks can be connected here later.
  return NextResponse.json({ success: true, enquiry });
}
