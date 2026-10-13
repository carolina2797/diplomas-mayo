import { NextRequest, NextResponse } from "next/server";
import { lookupAttendeeDiplomas } from "@/lib/attendees/service";
import { renderDiplomaPdf } from "@/lib/diploma/render";
import { isValidPrefix } from "@/lib/diploma/prefixes";
import { buildDiplomaFilename } from "@/lib/diploma/filename";
import type { DiplomaType } from "@/lib/diploma/types";

const VALID_TYPES: DiplomaType[] = ["general", "precongreso"];

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const email = params.get("email");
  const type = params.get("tipo");

  if (!email || !VALID_TYPES.includes(type as DiplomaType)) {
    return NextResponse.json(
      { error: "Missing or invalid 'email'/'tipo' query params" },
      { status: 400 },
    );
  }

  const result = await lookupAttendeeDiplomas(email);

  if (!result) {
    return NextResponse.json({ error: "Attendee not found" }, { status: 404 });
  }

  const diplomaType = type as DiplomaType;
  const diploma = result.diplomas.find((d) => d.diplomaType === diplomaType);

  if (!diploma) {
    return NextResponse.json(
      { error: "Diploma not available for this attendee" },
      { status: 404 },
    );
  }

  const rawPrefix = params.get("prefijo");
  const prefix = isValidPrefix(rawPrefix) ? rawPrefix : null;

  const pdfBuffer = await renderDiplomaPdf({
    attendeeName: result.attendee.name,
    prefix,
    diplomaType: diploma.diplomaType,
    role: diploma.role,
    courseCode: diploma.courseCode,
    courseName: diploma.courseName,
  });

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${buildDiplomaFilename(diploma)}"`,
    },
  });
}
