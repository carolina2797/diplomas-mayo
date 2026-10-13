import { describe, it, expect } from "vitest";
import { formatDisplayName, buildDiplomaTitle } from "./content";

describe("formatDisplayName", () => {
  it("prepends the prefix when provided", () => {
    expect(formatDisplayName("María Fernanda Rodríguez", "Dra.")).toBe(
      "Dra. María Fernanda Rodríguez",
    );
  });

  it("returns just the name when there is no prefix", () => {
    expect(formatDisplayName("Ana Pérez", null)).toBe("Ana Pérez");
    expect(formatDisplayName("Ana Pérez", undefined)).toBe("Ana Pérez");
  });

  it("treats a blank/whitespace prefix as no prefix", () => {
    expect(formatDisplayName("Ana Pérez", "   ")).toBe("Ana Pérez");
  });

  it("trims surrounding whitespace from name and prefix", () => {
    expect(formatDisplayName("  Ana Pérez  ", "  Dra.  ")).toBe("Dra. Ana Pérez");
  });
});

describe("buildDiplomaTitle", () => {
  it("returns the general participation title for an asistente/general diploma", () => {
    expect(buildDiplomaTitle({ diplomaType: "general", role: "asistente" })).toBe(
      "Diploma de participación",
    );
  });

  it("includes the course name for a precongreso/asistente diploma", () => {
    expect(
      buildDiplomaTitle({ diplomaType: "precongreso", role: "asistente", courseName: "Curso de IA" }),
    ).toBe("Diploma de participación — Curso de IA");
  });

  it("falls back to a generic label when the course name is missing", () => {
    expect(buildDiplomaTitle({ diplomaType: "precongreso", role: "asistente" })).toBe(
      "Diploma de participación — Precongreso",
    );
  });

  it("returns the conferencista title for the general diploma", () => {
    expect(buildDiplomaTitle({ diplomaType: "general", role: "conferencista" })).toBe(
      "Diploma de reconocimiento a conferencista",
    );
  });

  it("returns the moderador title, including course, for a precongreso diploma", () => {
    expect(
      buildDiplomaTitle({ diplomaType: "precongreso", role: "moderador", courseName: "Curso de IA" }),
    ).toBe("Diploma de reconocimiento a moderador — Curso de IA");
  });
});
