import type { Attendee, Course, Role } from "./types";

const VALID_ROLES: Role[] = ["asistente", "conferencista", "moderador"];
const NO_GENERAL_DIPLOMA_MARKERS = ["ninguno", "no aplica", "n/a", "no"];

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function parseRole(value: string | undefined): Role {
  const normalized = (value ?? "").trim().toLowerCase();
  return (VALID_ROLES as string[]).includes(normalized) ? (normalized as Role) : "asistente";
}

/**
 * Like parseRole, but for RolGeneral specifically: a marker value (e.g.
 * "Ninguno") means this attendee doesn't receive a general-congress diploma
 * at all, as opposed to a blank value, which still defaults to "asistente".
 */
function parseGeneralRole(value: string | undefined): Role | null {
  const normalized = (value ?? "").trim().toLowerCase();
  if (NO_GENERAL_DIPLOMA_MARKERS.includes(normalized)) {
    return null;
  }
  return parseRole(value);
}

/**
 * Parses raw rows from the `Asistentes` sheet tab (including header row).
 * Expected columns: Correo, Nombre, CodigoPrecongreso, RolGeneral, RolPrecongreso.
 * Both role columns default to "asistente" when blank or unrecognized, except
 * RolGeneral also accepts "Ninguno" (no general diploma at all).
 */
export function parseAttendees(rows: string[][]): Attendee[] {
  const [, ...dataRows] = rows;
  return dataRows
    .filter((row) => (row[0] ?? "").trim() !== "")
    .map((row) => {
      const [email, name, precongressCode, generalRole, precongressRole] = row;
      const trimmedCode = (precongressCode ?? "").trim();
      return {
        email: normalizeEmail(email),
        name: (name ?? "").trim(),
        precongressCode: trimmedCode === "" ? null : trimmedCode,
        generalRole: parseGeneralRole(generalRole),
        precongressRole: parseRole(precongressRole),
      };
    });
}

/**
 * Parses raw rows from the `Cursos` sheet tab (including header row).
 * Expected columns: CodigoPrecongreso, NombreCompletoCurso.
 */
export function parseCourses(rows: string[][]): Course[] {
  const [, ...dataRows] = rows;
  return dataRows
    .filter((row) => (row[0] ?? "").trim() !== "")
    .map((row) => {
      const [code, name] = row;
      return {
        code: code.trim(),
        name: (name ?? "").trim(),
      };
    });
}

export { normalizeEmail };
