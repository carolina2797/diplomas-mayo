import type { DiplomaData } from "./types";

const COMBINING_DIACRITICS = /[̀-ͯ]/g;

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(COMBINING_DIACRITICS, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// "asistente" keeps the plain, pre-existing filenames; conferencista/moderador
// get a role prefix so they're distinguishable in a downloads folder.
function rolePrefix(role: DiplomaData["role"]): string {
  return role === "asistente" ? "" : `${role}-`;
}

export function buildDiplomaFilename(
  data: Pick<DiplomaData, "diplomaType" | "role" | "courseName">,
): string {
  const prefix = rolePrefix(data.role);

  if (data.diplomaType === "precongreso") {
    const slug = slugify(data.courseName ?? "precongreso") || "precongreso";
    return `diploma-${prefix}${slug}.pdf`;
  }

  return data.role === "asistente"
    ? "diploma-participacion-general.pdf"
    : `diploma-${prefix}general.pdf`;
}
