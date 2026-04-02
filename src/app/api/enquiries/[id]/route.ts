import { NextResponse } from "next/server";

import { updateEnquiryStatus } from "@/lib/store";

type EnquiryStatusRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, { params }: EnquiryStatusRouteProps) {
  const { id } = await params;
  const body = await request.json();
  const enquiry = await updateEnquiryStatus(id, body.status || "New");

  if (!enquiry) {
    return NextResponse.json({ message: "Enquiry not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, enquiry });
}
