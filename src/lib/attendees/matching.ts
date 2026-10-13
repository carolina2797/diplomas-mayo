import type { Attendee, AttendeeLookupResult, Course, DiplomaEntry } from "./types";
import { normalizeEmail } from "./parsing";

/**
 * Finds an attendee by email and builds the list of diplomas they're
 * entitled to: a "general" diploma (with their generalRole), unless
 * generalRole is null (they don't attend the congress itself); plus a
 * "precongreso" diploma (with their precongressRole) when they have a
 * precongressCode, matched against the course catalog for the display name.
 */
export function findDiplomas(
  email: string,
  attendees: Attendee[],
  courses: Course[],
): AttendeeLookupResult | null {
  const target = normalizeEmail(email);
  const attendee = attendees.find((a) => a.email === target);

  if (!attendee) {
    return null;
  }

  const diplomas: DiplomaEntry[] = [];

  if (attendee.generalRole !== null) {
    diplomas.push({ diplomaType: "general", role: attendee.generalRole });
  }

  if (attendee.precongressCode) {
    const course = courses.find((c) => c.code === attendee.precongressCode);
    diplomas.push({
      diplomaType: "precongreso",
      role: attendee.precongressRole,
      courseCode: attendee.precongressCode,
      courseName: course?.name ?? attendee.precongressCode,
    });
  }

  return { attendee, diplomas };
}
