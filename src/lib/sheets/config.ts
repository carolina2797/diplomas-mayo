import { requireEnv } from "@/lib/env";

export function getSpreadsheetId(): string {
  return requireEnv("GOOGLE_SHEETS_SPREADSHEET_ID");
}

export const ASISTENTES_RANGE = "Asistentes!A:E";
export const CURSOS_RANGE = "Cursos!A:B";
