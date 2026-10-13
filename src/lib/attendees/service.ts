import { createSheetsClient, fetchRange } from "@/lib/sheets/client";
import { getSpreadsheetId, ASISTENTES_RANGE, CURSOS_RANGE } from "@/lib/sheets/config";
import { parseAttendees, parseCourses } from "./parsing";
import { findDiplomas } from "./matching";
import type { AttendeeLookupResult } from "./types";

/* v8 ignore start -- thin orchestration over the Sheets data access layer, not unit-tested */
export async function lookupAttendeeDiplomas(
  email: string,
): Promise<AttendeeLookupResult | null> {
  const sheets = createSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const [attendeeRows, courseRows] = await Promise.all([
    fetchRange(sheets, spreadsheetId, ASISTENTES_RANGE),
    fetchRange(sheets, spreadsheetId, CURSOS_RANGE),
  ]);

  const attendees = parseAttendees(attendeeRows);
  const courses = parseCourses(courseRows);

  return findDiplomas(email, attendees, courses);
}
/* v8 ignore stop */
