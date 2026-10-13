import { NextRequest, NextResponse } from "next/server";
import { lookupAttendeeDiplomas } from "@/lib/attendees/service";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing 'email' query param" }, { status: 400 });
  }

  const result = await lookupAttendeeDiplomas(email);

  if (!result) {
    return NextResponse.json({ error: "Attendee not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
