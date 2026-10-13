import type { DiplomaData } from "./types";

export function formatDisplayName(name: string, prefix?: string | null): string {
  const trimmedPrefix = (prefix ?? "").trim();
  const trimmedName = name.trim();
  return trimmedPrefix ? `${trimmedPrefix} ${trimmedName}` : trimmedName;
}

function roleLabel(data: Pick<DiplomaData, "role">): string {
  if (data.role === "conferencista") {
    return "Diploma de reconocimiento a conferencista";
  }
  if (data.role === "moderador") {
    return "Diploma de reconocimiento a moderador";
  }
  return "Diploma de participación";
}

export function buildDiplomaTitle(
  data: Pick<DiplomaData, "diplomaType" | "role" | "courseName">,
): string {
  const label = roleLabel(data);
  if (data.diplomaType === "precongreso") {
    return `${label} — ${data.courseName ?? "Precongreso"}`;
  }
  return label;
}
