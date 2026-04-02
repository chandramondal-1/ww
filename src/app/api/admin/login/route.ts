import { NextResponse } from "next/server";

import { signInAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const success = await signInAdmin(body.username || "", body.password || "");

  if (!success) {
    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}
