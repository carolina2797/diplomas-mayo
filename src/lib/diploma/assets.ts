import fs from "fs";
import path from "path";
import type { DiplomaType, Role } from "./types";

export const TEMPLATE_DIR = path.join(process.cwd(), "assets", "diploma-template");

// Preserves the code's original casing (e.g. "PC1" stays "PC1") since the
// real filesystem in production (Linux) is case-sensitive, unlike Windows —
// this must match the CodigoPrecongreso value from the sheet exactly.
function slugifyCode(code: string): string {
  return code
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// "asistente" is the default/most common role and reuses the existing
// no-suffix filenames (e.g. "background-general.png"); conferencista/
// moderador get their own suffixed files.
function roleSuffix(role: Role): string {
  return role === "asistente" ? "" : `-${role}`;
}

/**
 * Filename of the dedicated background for a given diploma variant
 * (event + role). For "precongreso", this is specific to a single course
 * (e.g. "background-precongreso-PC1-moderador.png"); a separate generic
 * fallback ("background-precongreso-moderador.png") is used when that
 * specific course design isn't ready yet.
 */
export function resolveBackgroundFilename(
  diplomaType: DiplomaType,
  role: Role,
  courseCode?: string | null,
): string {
  const suffix = roleSuffix(role);
  if (diplomaType === "precongreso") {
    const slug = courseCode ? slugifyCode(courseCode) : "";
    return slug
      ? `background-precongreso-${slug}${suffix}.png`
      : `background-precongreso${suffix}.png`;
  }
  return `background-general${suffix}.png`;
}

/**
 * Ordered list of filenames to try for a diploma's background: the
 * dedicated design first, then (for "precongreso" only) a generic,
 * course-agnostic fallback for that same role.
 * Pure — no filesystem access, so it's plain unit-testable.
 */
export function resolveBackgroundCandidateFilenames(
  diplomaType: DiplomaType,
  role: Role,
  courseCode?: string | null,
): string[] {
  const filenames = [resolveBackgroundFilename(diplomaType, role, courseCode)];
  if (diplomaType === "precongreso") {
    filenames.push(resolveBackgroundFilename(diplomaType, role, null));
  }
  return filenames;
}

/**
 * Returns the given path if the file exists on disk, or null otherwise.
 * Used to fall back to a solid-color mockup background until the real
 * design asset is added to the project.
 */
export function resolveBackgroundImagePath(candidatePath: string): string | null {
  return fs.existsSync(candidatePath) ? candidatePath : null;
}

/**
 * Loads an image file as a Buffer, or null if it doesn't exist yet.
 * A Buffer (not a path string) is what must be handed to @react-pdf/renderer's
 * <Image>: passing a path breaks on Windows, since it misreads a drive letter
 * (e.g. "C:") as a URL scheme and tries to fetch() it instead of reading it.
 */
export function loadBackgroundImage(candidatePath: string): Buffer | null {
  const resolvedPath = resolveBackgroundImagePath(candidatePath);
  return resolvedPath ? fs.readFileSync(resolvedPath) : null;
}

export interface DiplomaBackground {
  buffer: Buffer | null;
  /** True when a design specific to this exact diploma variant was found. */
  hasDedicatedDesign: boolean;
}

/**
 * Resolves the background image for a diploma, trying (in order):
 * 1. The dedicated design for this exact variant (event + role + course).
 * 2. For "precongreso" only, a generic background for that same role.
 * 3. No image (the caller falls back to a solid-color mockup).
 *
 * `process.cwd()` is inlined directly in the path.join() call below (rather
 * than routed through the TEMPLATE_DIR constant) so Next.js's build-time
 * file tracer can statically resolve the base directory and only bundle
 * assets/diploma-template — see the "make sure the path is statically
 * scoped" guidance in the Next.js file-tracing warning.
 */
/* v8 ignore start -- thin IO orchestration; the real logic lives in the pure/tested helpers above */
export function loadDiplomaBackground(
  diplomaType: DiplomaType,
  role: Role,
  courseCode?: string | null,
): DiplomaBackground {
  const filenames = resolveBackgroundCandidateFilenames(diplomaType, role, courseCode);

  for (let i = 0; i < filenames.length; i += 1) {
    const fullPath = path.join(process.cwd(), "assets", "diploma-template", filenames[i]);
    const buffer = loadBackgroundImage(fullPath);
    if (buffer) {
      return { buffer, hasDedicatedDesign: i === 0 };
    }
  }

  return { buffer: null, hasDedicatedDesign: false };
}
/* v8 ignore stop */
