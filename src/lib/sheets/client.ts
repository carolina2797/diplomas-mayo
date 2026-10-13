import { google, sheets_v4 } from "googleapis";
import { requireEnv, normalizePrivateKey } from "@/lib/env";

/* v8 ignore start -- thin adapter over the Google Sheets API, not unit-tested */

export function createSheetsClient(): sheets_v4.Sheets {
  const auth = new google.auth.JWT({
    email: requireEnv("GOOGLE_SHEETS_CLIENT_EMAIL"),
    key: normalizePrivateKey(requireEnv("GOOGLE_SHEETS_PRIVATE_KEY")),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  return google.sheets({ version: "v4", auth });
}

export async function fetchRange(
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  range: string,
): Promise<string[][]> {
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  return (res.data.values ?? []) as string[][];
}

/* v8 ignore stop */
