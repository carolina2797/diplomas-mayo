import { describe, it, expect, afterEach } from "vitest";
import { getSpreadsheetId, ASISTENTES_RANGE, CURSOS_RANGE } from "./config";

describe("sheets config", () => {
  afterEach(() => {
    delete process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  });

  it("reads the spreadsheet id from the environment", () => {
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID = "abc123";
    expect(getSpreadsheetId()).toBe("abc123");
  });

  it("throws when the spreadsheet id is missing", () => {
    delete process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    expect(() => getSpreadsheetId()).toThrow();
  });

  it("exposes the expected sheet ranges", () => {
    expect(ASISTENTES_RANGE).toBe("Asistentes!A:E");
    expect(CURSOS_RANGE).toBe("Cursos!A:B");
  });
});
